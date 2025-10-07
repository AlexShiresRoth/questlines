"use server";
import "server-only";

import { auth } from "@/app/auth";
import {
  DB_NAME,
  INVITES_COLLECTION,
  QUESTLINE_COLLECTION,
} from "@/app/constants";
import client from "@/app/mongo-client";
import {
  AcceptOrDeclineInviteSchema,
  Questline,
  QuestlineInvite,
} from "@/app/schemas";
import { sanitizePayload } from "@/app/utils/sanitize";
import { SubmissionResult } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { ObjectId } from "mongodb";
import { revalidateTag } from "next/cache";

export async function acceptInvite(
  _prevState: SubmissionResult<string[]> | null | undefined,
  formData: FormData
) {
  const session = await auth();

  if (!session || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  const submission = parseWithZod(formData, {
    schema: AcceptOrDeclineInviteSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const db = client.db(DB_NAME);
  const invitesCollection = db.collection<QuestlineInvite>(INVITES_COLLECTION);
  const questlineCollection = db.collection<Questline>(QUESTLINE_COLLECTION);

  const payload = sanitizePayload(submission.value);

  const foundInvite = await invitesCollection.findOneAndUpdate(
    {
      _id: new ObjectId(payload._id as string),
      invitee: session.user?.email,
    },
    {
      $set: {
        accepted: true,
        pending: false,
      },
    }
  );

  const foundQuestline = await questlineCollection.findOne({
    _id: new ObjectId(foundInvite?.questlineId as string),
  });

  if (!foundQuestline) {
    throw new Error("Could not locate questline");
  }

  await questlineCollection.findOneAndUpdate(
    {
      _id: foundQuestline._id,
    },
    {
      $set: {
        access: [...(foundQuestline.access ?? []), session.user.email],
      },
    }
  );

  revalidateTag("questlines");

  return submission.reply();
}

export async function declineInvite(
  _prevState: SubmissionResult<string[]> | null | undefined,
  formData: FormData
) {
  const session = await auth();

  if (!session || !session.user?.email) {
    throw new Error("Unauthorized");
  }

  const submission = parseWithZod(formData, {
    schema: AcceptOrDeclineInviteSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const db = client.db(DB_NAME);
  const invitesCollection = db.collection<QuestlineInvite>(INVITES_COLLECTION);

  const payload = sanitizePayload(submission.value);

  await invitesCollection.findOneAndUpdate(
    {
      _id: new ObjectId(payload._id as string),
      invitee: session.user?.email,
    },
    {
      $set: {
        accepted: false,
        pending: false,
      },
    }
  );

  revalidateTag("questlines");

  return submission.reply();
}

export async function deleteInvite(
  _prevState: SubmissionResult<string[]> | null | undefined,
  formData: FormData
) {
  const session = await auth();

  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  const submission = parseWithZod(formData, {
    schema: AcceptOrDeclineInviteSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const db = client.db(DB_NAME);
  const invitesCollection = db.collection<QuestlineInvite>(INVITES_COLLECTION);

  const payload = sanitizePayload(submission.value);

  await invitesCollection.findOneAndDelete({
    _id: new ObjectId(payload._id as string),
    createdBy: session.user.id,
  });

  revalidateTag("questlines");

  return submission.reply();
}
