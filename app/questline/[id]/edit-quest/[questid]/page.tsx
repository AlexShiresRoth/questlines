import {
  COLLECTION_NAME,
  DB_NAME,
  QUESTLINE_COLLECTION,
} from "@/app/constants";
import BackButton from "@/app/questline/components/back-button";
import { QuestForm } from "@/app/questline/components/quest-form";
import { Quest, Questline } from "@/app/schemas";
import { ObjectId } from "mongodb";
import { Session } from "next-auth";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import { auth } from "../../../../auth";
import client from "../../../../mongo-client";

type Props = {
  params: Promise<{ id: string; questid: string }>;
};

async function getQuestById(questlineId: string, questId: string) {
  try {
    const db = client.db(DB_NAME);
    const collection = db.collection<Quest>(COLLECTION_NAME);

    const foundQuest = await collection.findOne({
      _id: new ObjectId(questId),
      questLine: questlineId,
    });

    if (!foundQuest) {
      throw new Error("Could not locate quest with this id");
    }

    return { ...foundQuest, _id: foundQuest._id.toString() };
  } catch (error) {
    console.error("ERROR LOCATING QUEST:", error);
    return null;
  }
}

async function getQuestlineAccess(id: string, session: Session) {
  try {
    const db = client.db(DB_NAME);
    const collection = db.collection<Questline>(QUESTLINE_COLLECTION);
    const foundQuestline = await collection.findOne({
      _id: new ObjectId(id),
      access: {
        $in: [session.user?.email as string],
      },
    });

    if (!foundQuestline) {
      throw new Error("Could not locate questline with this id");
    }

    return foundQuestline;
  } catch (error) {
    console.error("ERROR LOCATING QUEST:", error);
    return null;
  }
}

export default async function EditQuest({ params }: Props) {
  const { id, questid } = await params;

  const session = await auth();

  if (!session || !session.user?.id) {
    notFound();
  }

  const cache = unstable_cache(
    async () => {
      return {
        quest: await getQuestById(id, questid),
        questlineAccess: await getQuestlineAccess(id, session),
      };
    },
    [session.user.id, session?.user?.email as string, questid],
    { tags: ["quests", "questlines"], revalidate: 60 }
  );

  const { quest, questlineAccess } = await cache();
  if (!quest || !questlineAccess) {
    notFound();
  }

  return (
    <>
      <div className="flex flex-col w-full px-4 md:px-0 pb-28 md:pb-16 gap-4">
        <div className="w-full flex items-end justify-between">
          <div className="flex flex-col">
            <p className="text-sm text-orange-100 uppercase">Edit Quest</p>
            <h1 className="text-base md:text-4xl font-bold text-orange-50">
              {quest.name}
            </h1>
          </div>
          <BackButton />
        </div>
        <QuestForm
          type={quest.questType}
          quest={quest}
          questLineId={id}
          partnerAccess={questlineAccess.partnerAccess}
        />
      </div>
    </>
  );
}
