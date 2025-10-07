"use server";

import { parseWithZod } from "@conform-to/zod";
import { ObjectId } from "mongodb";
import { revalidateTag, unstable_cache } from "next/cache";
import { v4 } from "uuid";
import { auth } from "../auth";
import {
  COLLECTION_NAME,
  DB_NAME,
  PERSONAL_QUESTLINE,
  QUESTLINE_COLLECTION,
} from "../constants";
import client from "../mongo-client";
import {
  ClientValidationEditQuestSchema,
  ClientValidationQuestSchema,
  Quest,
  Questline,
  QuestType,
} from "../schemas";
import { sanitizePayload } from "../utils/sanitize";

export async function createQuest(_prevState: unknown, formData: FormData) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      throw new Error("Unauthorized");
    }

    const submission = parseWithZod(formData, {
      schema: ClientValidationQuestSchema,
    });

    if (submission.status !== "success") {
      return submission.reply();
    }

    const payload = sanitizePayload<typeof submission.value>(submission.value);

    const db = client.db(DB_NAME);
    const collection = db.collection<Quest>(COLLECTION_NAME);
    const questlineCollection = db.collection<Questline>(QUESTLINE_COLLECTION);

    // make sure logged in user has access to questline
    if (payload.questLine !== PERSONAL_QUESTLINE) {
      const foundQuestline = await questlineCollection.findOne({
        _id: new ObjectId(payload.questLine),
        access: {
          $in: [session.user.email ?? ""],
        },
      });

      if (!foundQuestline) {
        throw new Error("Not authorized to create quest");
      }
    }

    const steps =
      payload.steps.length > 0
        ? payload.steps.map((step) => ({
            ...step,
            completed: step.completed === "true" ? true : false,
            _id: new ObjectId().toString("hex"),
          }))
        : [];

    const newQuest: Quest = {
      ...payload,
      questLine: payload.questLine ?? PERSONAL_QUESTLINE,
      steps: steps,
      completed: false,
      createdBy: session.user?.id,
      partnerAccess: payload.partnerAccess,
      indicatorColor: payload.indicatorColor,
    };

    const newQuestInCollection = await collection.insertOne(newQuest);

    if (!newQuestInCollection) {
      throw new Error("Something happened creating quest");
    }

    revalidateTag("quests");

    return submission.reply();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function editQuest(_prevState: unknown, formData: FormData) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      throw new Error("Unauthorized");
    }

    const submission = parseWithZod(formData, {
      schema: ClientValidationEditQuestSchema,
    });

    if (submission.status !== "success") {
      return submission.reply();
    }

    const payload = sanitizePayload<typeof submission.value>(submission.value);

    const db = client.db(DB_NAME);
    const collection = db.collection<Quest>(COLLECTION_NAME);
    const questlineCollection = db.collection<Questline>(QUESTLINE_COLLECTION);

    if (payload.questLine !== PERSONAL_QUESTLINE) {
      // make sure logged in user has access to questline
      const foundQuestline = await questlineCollection.findOne({
        _id: new ObjectId(payload.questLine),
        access: {
          $in: [session.user.email ?? ""],
        },
      });

      if (!foundQuestline) {
        throw new Error("No access to edit quest");
      }
    }

    const steps =
      payload.steps.length > 0
        ? payload.steps.map((step) => ({
            ...step,
            completed: step.completed === "true" ? true : false,
            _id: step._id ?? new ObjectId().toString("hex"),
          }))
        : [];

    const editQuest: Quest = {
      ...payload,
      steps,
      completed: false,
      createdBy: session.user?.id,
      partnerAccess: payload.partnerAccess,
      indicatorColor: payload.indicatorColor,
    };

    // console.log('edit quest', editQuest);

    const { _id, ...quest } = editQuest;

    const newQuestInCollection = await collection.findOneAndUpdate(
      {
        _id: new ObjectId(_id as string),
      },
      {
        $set: {
          ...quest,
        },
      }
    );

    if (!newQuestInCollection) {
      throw new Error("Something happened editing quest");
    }

    revalidateTag("quests");

    return submission.reply();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function completeQuest(
  id: string,
  questlineId: string
): Promise<{
  status: "success" | "error";
  updateId: string | null;
}> {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      throw new Error("Unauthorized");
    }

    const db = client.db(DB_NAME);
    const collection = db.collection<Quest>(COLLECTION_NAME);
    const questlineCollection = db.collection<Questline>(QUESTLINE_COLLECTION);

    // make sure logged in user has access to questline
    if (questlineId !== PERSONAL_QUESTLINE) {
      const foundQuestline = await questlineCollection.findOne({
        _id: new ObjectId(questlineId),
        access: {
          $in: [session.user.email ?? ""],
        },
      });

      if (!foundQuestline) {
        throw new Error("Not authorized to complete quest");
      }
    }

    const completedQuest = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          questType: QuestType.Completed,
          completed: true,
          completionDate: new Date(),
        },
      }
    );

    if (!completedQuest) {
      throw new Error("Failed to update quest");
    }

    revalidateTag("quests");

    return { status: "success", updateId: `quest-complete-${v4()}` };
  } catch (error) {
    console.error(error);
    return { status: "error", updateId: `quest-complete-error${v4()}` };
  }
}

export async function deleteQuest(
  id: string,
  questlineId: string
): Promise<{
  status: "success" | "error";
  updateId: string | null;
}> {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      throw new Error("Unauthorized");
    }

    const db = client.db(DB_NAME);
    const collection = db.collection<Quest>(COLLECTION_NAME);
    const questlineCollection = db.collection<Questline>(QUESTLINE_COLLECTION);

    if (questlineId !== PERSONAL_QUESTLINE) {
      const foundQuestline = await questlineCollection.findOne({
        _id: new ObjectId(questlineId),
        access: {
          $in: [session.user.email ?? ""],
        },
      });

      if (!foundQuestline) {
        throw new Error("Not authorized to complete quest");
      }
    }

    await collection.findOneAndDelete({
      _id: new ObjectId(id),
    });

    revalidateTag("quests");

    return { status: "success", updateId: `delete-quest-${v4()}` };
  } catch (error) {
    console.error(error);
    return { status: "error", updateId: `delete-quest-error${v4()}` };
  }
}

export async function completeStep(
  questId: string,
  stepId: string,
  questlineId: string
): Promise<{ status: "success" | "error" | null }> {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      throw new Error("Unauthorized");
    }

    const db = client.db(DB_NAME);
    const collection = db.collection<Quest>(COLLECTION_NAME);
    const questlineCollection = db.collection<Questline>(QUESTLINE_COLLECTION);

    if (questlineId !== PERSONAL_QUESTLINE) {
      const foundQuestline = await questlineCollection.findOne({
        _id: new ObjectId(questlineId),
        access: {
          $in: [session.user.email ?? ""],
        },
      });

      if (!foundQuestline) {
        throw new Error("Not authorized to complete quest");
      }
    }

    const foundQuest = await collection.findOne({
      _id: new ObjectId(questId),
    });

    if (!foundQuest) {
      throw new Error("Quest could not be found");
    }

    const steps = foundQuest.steps.map((step) => {
      if (step._id === stepId) {
        return { ...step, completed: !step.completed };
      }
      return step;
    });

    await collection.findOneAndUpdate(
      {
        _id: new ObjectId(questId),
      },
      {
        $set: {
          steps,
        },
      }
    );

    revalidateTag("quests");

    return { status: "success" };
  } catch (error) {
    console.error(error);
    return { status: "error" };
  }
}

export async function searchQuest(searchTerm: string, questline: string) {
  const session = await auth();

  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  return unstable_cache(
    async () => {
      const db = client.db(DB_NAME);
      const collection = db.collection<Quest>(COLLECTION_NAME);
      const questlines = db.collection<Questline>(QUESTLINE_COLLECTION);

      // only want to show results for questline user currently has access to
      if (questline !== PERSONAL_QUESTLINE) {
        const foundQuestline = questlines.findOne({
          _id: new ObjectId(questline),
          access: [session.user?.email ?? ""],
        });

        if (!foundQuestline) {
          return [];
        }
      }

      const cursor = collection.find({
        questLine: questline,
        $text: { $search: searchTerm as string },
      });

      const foundQuests = await cursor.toArray();

      return foundQuests.map((quest) => ({
        ...quest,
        _id: quest._id.toString("hex"),
      }));
    },
    [searchTerm],
    {
      tags: ["quests", "questlines"],
      revalidate: 60,
    }
  )();
}
