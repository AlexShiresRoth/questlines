"use server";
import { auth } from "@/app/auth";
import {
  ACCOUNTS_COLLECTION,
  COLLECTION_NAME,
  DB_NAME,
  QUESTLINE_COLLECTION,
  SESSION_COLLECTION,
  USERS_COLLECTION,
} from "@/app/constants";
import client from "@/app/mongo-client";
import {
  Account,
  DeleteAccountSchema,
  Quest,
  Questline,
  Session,
  User,
} from "@/app/schemas";
import { parseWithZod } from "@conform-to/zod";
import { ObjectId } from "mongodb";

// TODO we're going to have to delete all quests and questlines created by account.
// OR should we transfer ownership of questline
// TODO for another ticket: we need to have accept questline invite for partners
export async function deleteAccount(
  _prevState: unknown | undefined,
  formData: FormData
) {
  const session = await auth();

  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  const submission = parseWithZod(formData, {
    schema: DeleteAccountSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const db = client.db(DB_NAME);
  const accounts = db.collection<Account>(ACCOUNTS_COLLECTION);
  const user = db.collection<User>(USERS_COLLECTION);
  const sessions = db.collection<Session>(SESSION_COLLECTION);
  const quests = db.collection<Quest>(COLLECTION_NAME);
  const questlines = db.collection<Questline>(QUESTLINE_COLLECTION);

  const foundQuestsCursor = quests.find({
    createdBy: session.user.id,
  });

  const foundAccountsCursor = accounts.find({
    userId: new ObjectId(session.user.id),
  });

  const foundSessionsCursor = sessions.find({
    userId: new ObjectId(session.user.id),
  });

  const foundQuestlinesCursor = questlines.find({
    createdBy: new ObjectId(session.user.id),
  });

  const questIds = (await foundQuestsCursor.toArray()).map(
    (quest) => quest._id
  );
  const questlineIds = (await foundQuestlinesCursor.toArray()).map(
    (questline) => questline._id
  );
  const sessionIds = (await foundSessionsCursor.toArray()).map(
    (session) => session._id
  );
  const accountIds = (await foundAccountsCursor.toArray()).map(
    (account) => account._id
  );

  await quests.deleteMany({
    _id: {
      $in: questIds,
    },
  });
  await questlines.deleteMany({
    _id: {
      $in: questlineIds,
    },
  });
  await sessions.deleteMany({
    _id: { $in: sessionIds },
  });
  await accounts.deleteMany({
    _id: { $in: accountIds },
  });
  await user.findOneAndDelete({
    _id: new ObjectId(session.user.id),
  });

  return submission.reply();
}
