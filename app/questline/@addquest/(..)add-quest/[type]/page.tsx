import { auth } from "@/app/auth";
import {
  DB_NAME,
  PERSONAL_QUESTLINE,
  QUESTLINE_COLLECTION,
} from "@/app/constants";
import client from "@/app/mongo-client";
import { Questline, QuestType } from "@/app/schemas";
import { ObjectId } from "mongodb";
import { QuestForm } from "../../../components/quest-form";
import BackButton from "./back-button";

type Props = {
  params: Promise<{ type: QuestType }>;
  searchParams: Promise<{ questLine: string }>;
};

async function getQuestline(questlineId: string) {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      throw new Error("Unauthorized");
    }

    // personal questlines do not have shared access
    if (questlineId === PERSONAL_QUESTLINE) {
      return null;
    }

    const db = client.db(DB_NAME);
    const collection = db.collection<Questline>(QUESTLINE_COLLECTION);

    return await collection.findOne({
      $or: [
        {
          _id: new ObjectId(questlineId),
          createdBy: new ObjectId(session.user.id),
        },
        {
          _id: new ObjectId(questlineId),
          partnerAccess: session.user.email ?? "",
        },
      ],
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function AddQuestModal({ params, searchParams }: Props) {
  const { type } = await params;
  const { questLine } = await searchParams;
  const foundQuestline = await getQuestline(questLine);

  return (
    <div className="overflow-y-auto z-50 max-h-screen fixed top-0 left-0 min-h-screen w-screen bg-black/20 flex flex-col items-center px-4 py-16 md:px-16 animate-fade-in">
      <div className="w-full md:w-1/2 flex flex-col bg-orange-400 dark:bg-emerald-950 rounded-xl shadow-lg p-8 gap-8 animate-pop-in">
        <div className="w-full flex justify-between border-b border-b-white/20 py-2">
          <h2 className="text-xl uppercase text-orange-50">New {type} Quest</h2>
          <BackButton />
        </div>
        <QuestForm
          type={type}
          questLineId={questLine}
          partnerAccess={foundQuestline?.partnerAccess}
        />
      </div>
    </div>
  );
}
