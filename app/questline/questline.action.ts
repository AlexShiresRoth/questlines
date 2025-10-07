"use server";

import {
  COLLECTION_NAME,
  DB_NAME,
  INVITES_COLLECTION,
  QUESTLINE_COLLECTION,
} from "@/app/constants";
import {
  CreateQuestlineClientSchema,
  DeleteQuestlineSchema,
  LeaveQuestlineSchema,
  Quest,
  Questline,
  QuestlineInvite,
} from "@/app/schemas";
import { parseWithZod } from "@conform-to/zod";
import { ObjectId } from "mongodb";
import { revalidateTag } from "next/cache";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { auth } from "../auth";
import client from "../mongo-client";
import { sanitizePayload } from "../utils/sanitize";

const transporter = nodemailer.createTransport<SMTPTransport>({
  host: "smtp.sendgrid.net",
  port: 465,
  secure: true,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_KEY,
  },
} as SMTPTransport.Options);

// Send email invite for partner access
async function invitePartner(
  sender: string,
  invitee: string,
  questlineId: string
) {
  return transporter.sendMail(
    {
      from: process.env.GMAIL_USER,
      to: invitee,
      subject: "Questlines - Invite",
      html: `<p>Hello there, <br /> ${sender} has invited you to join them on <a href='https://sidequest-iota.vercel.app/questline/${questlineId}'>Questlines</a></p>`,
    },
    (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    }
  );
}

const USER_PLAN_LIMITS = 5;

export async function createOrEditQuestline(
  _prevState: unknown,
  formData: FormData
) {
  const session = await auth();

  if (!session || !session.user?.id) {
    throw new Error("Unathorized");
  }

  const submission = parseWithZod(formData, {
    schema: CreateQuestlineClientSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const payload = sanitizePayload(submission.value);

  const { _id } = payload;

  const db = client.db(DB_NAME);
  const collection = db.collection<Questline>(QUESTLINE_COLLECTION);
  const inviteCollection = db.collection<QuestlineInvite>(INVITES_COLLECTION);

  if (_id) {
    const foundQuestline = await collection.findOne({
      _id: new ObjectId(_id),
      createdBy: new ObjectId(session.user.id),
    });

    if (!foundQuestline) {
      return submission.reply({
        formErrors: ["Could not edit questline"],
      });
    }

    await collection.findOneAndUpdate(
      {
        _id: new ObjectId(_id),
        createdBy: new ObjectId(session.user.id),
      },
      {
        $set: {
          name: payload.name,
          partnerAccess: payload.partnerAccess,
          // if partner access changes we want to remove the old user from access array
          access: foundQuestline.access?.filter(
            (email) =>
              email === payload.partnerAccess || email === session.user?.email
          ),
        },
      }
    );
  } else {
    const foundQuestlines = collection.find({
      createdBy: new ObjectId(session.user.id),
    });

    if ((await foundQuestlines.toArray()).length >= USER_PLAN_LIMITS) {
      return submission.reply({
        formErrors: ["New questline exceeds current plan limit"],
      });
    }

    const questline = await collection.insertOne({
      name: payload.name,
      partnerAccess: payload.partnerAccess,
      createdBy: new ObjectId(session.user.id),
      // partner access' will be provided once they accept invite
      access: [session.user?.email ?? ""],
    });

    if (!questline) {
      return submission.reply({
        formErrors: ["Could not create questline"],
      });
    }

    if (payload.partnerAccess) {
      await invitePartner(
        session?.user?.email ?? "",
        payload.partnerAccess,
        questline.insertedId.toString("hex")
      );

      await inviteCollection.insertOne({
        questlineId: questline.insertedId,
        invitee: payload.partnerAccess,
        pending: true,
        accepted: false,
        createdBy: session.user.id,
        sendDate: new Date(),
      });
    }
  }

  revalidateTag("questlines");

  return submission.reply();
}

export async function deleteQuestline(_prevState: unknown, formData: FormData) {
  const session = await auth();

  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  const submission = parseWithZod(formData, {
    schema: DeleteQuestlineSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const payload = sanitizePayload(submission.value);

  const db = client.db(DB_NAME);

  const collection = db.collection<Questline>(QUESTLINE_COLLECTION);
  const quests = db.collection<Quest>(COLLECTION_NAME);
  const invites = db.collection<QuestlineInvite>(INVITES_COLLECTION);

  const foundQuestline = await collection.findOne({
    _id: new ObjectId(payload._id),
    createdBy: new ObjectId(session.user.id),
  });

  if (!foundQuestline) {
    return submission.reply({
      formErrors: ["Could not locate questline"],
    });
  }

  const DELETE_PHRASE = `delete questline ${foundQuestline.name}`;

  if (payload.deletePhrase !== DELETE_PHRASE) {
    return submission.reply({
      fieldErrors: {
        deletePhrase: ["Phrase is incorrect"],
      },
    });
  }

  await collection.findOneAndDelete({
    _id: new ObjectId(payload._id),
    createdBy: new ObjectId(session.user.id),
  });

  const foundQuestsCursor = quests.find({
    questLine: foundQuestline._id.toString(),
    createdBy: session.user.id,
  });

  const foundInvites = invites.find({
    questlineId: foundQuestline._id,
    createdBy: session.user.id,
  });

  for await (const quest of await foundQuestsCursor.toArray()) {
    console.log("deleting quests on questline:", quest.name);
    await quests.findOneAndDelete({
      _id: quest._id,
      createdBy: session.user.id,
      questLine: foundQuestline._id.toString(),
    });
  }

  for await (const invite of await foundInvites.toArray()) {
    console.log("deleting invites on questline", invite._id);
    await invites.findOneAndDelete({
      _id: invite._id,
      createdBy: session.user.id,
      questlineId: foundQuestline._id,
    });
  }

  revalidateTag("questlines");
  revalidateTag("quests");

  return submission.reply();
}

export async function leaveQuestline(_prevState: unknown, formData: FormData) {
  const session = await auth();

  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  const submission = parseWithZod(formData, {
    schema: LeaveQuestlineSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const payload = sanitizePayload(submission.value);

  const db = client.db(DB_NAME);

  const collection = db.collection<Questline>(QUESTLINE_COLLECTION);

  const foundQuestline = await collection.findOne({
    _id: new ObjectId(payload._id),
    createdBy: { $ne: new ObjectId(session.user.id) },
    access: {
      $in: [session.user.email ?? ""],
    },
  });

  if (!foundQuestline) {
    return submission.reply({
      formErrors: ["Could not locate questline"],
    });
  }

  await collection.findOneAndUpdate(
    {
      _id: new ObjectId(payload._id),
      createdBy: { $ne: new ObjectId(session.user.id) },
      access: {
        $in: [session.user.email ?? ""],
      },
    },
    {
      $set: {
        access: foundQuestline.access?.filter(
          (email) => email !== session.user?.email
        ),
      },
    }
  );

  revalidateTag("questlines");
  revalidateTag("quests");

  return submission.reply();
}
