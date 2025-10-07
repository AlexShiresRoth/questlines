import { auth } from "@/app/auth";
import { COLLECTION_NAME, DB_NAME, PERSONAL_QUESTLINE } from "@/app/constants";
import client from "@/app/mongo-client";
import { Quest } from "@/app/schemas";
import { ArrowLeft } from "lucide-react";
import { ObjectId } from "mongodb";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageWrapper from "../../components/page-wrapper";
import { QuestForm } from "../../components/quest-form";
import Sidebar from "../../components/side-bar";

type Props = {
  params: Promise<{ id: string }>;
};

async function getQuestById(userId: string, id: string) {
  try {
    const db = client.db(DB_NAME);
    const collection = db.collection<Quest>(COLLECTION_NAME);
    const foundQuest = await collection.findOne({
      _id: new ObjectId(id),
      createdBy: userId,
      questLine: PERSONAL_QUESTLINE,
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

export default async function EditQuest({ params }: Props) {
  const { id } = await params;

  const session = await auth();

  if (!session || !session.user?.id) {
    notFound();
  }

  const quest = await getQuestById(session.user.id, id);

  if (!quest) {
    notFound();
  }

  return (
    <PageWrapper>
      <Sidebar />
      <div className="flex flex-col w-full">
        <div className="flex flex-col px-4 w-full pt-4 md:pt-0 md:px-0 gap-4">
          <div className="w-full flex items-end justify-between">
            <div className="flex flex-col">
              <p className="text-sm text-orange-100 uppercase">Edit Quest</p>
              <h1 className="text-base md:text-4xl font-bold text-orange-50">
                {quest.name}
              </h1>
            </div>
            <Link
              href="/questline"
              className="flex items-center gap-2 text-orange-100"
            >
              <ArrowLeft size={16} />
              Back
            </Link>
          </div>
          <QuestForm
            type={quest.questType}
            quest={quest}
            questLineId={PERSONAL_QUESTLINE}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
