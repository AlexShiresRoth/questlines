import { auth } from "@/app/auth";
import { DB_NAME, QUESTLINE_COLLECTION } from "@/app/constants";
import client from "@/app/mongo-client";
import { Questline } from "@/app/schemas";
import { ObjectId } from "mongodb";
import { notFound, redirect } from "next/navigation";
import BackButton from "../../components/back-button";
import DeleteQuestline from "../components/delete-questline-form";

type Props = {
  params: Promise<{ id: string }>;
};

async function getQuestLine(id: string, userId: string) {
  try {
    const db = client.db(DB_NAME);
    const collection = db.collection<Questline>(QUESTLINE_COLLECTION);

    const foundQuestline = await collection.findOne({
      _id: new ObjectId(id),
      createdBy: new ObjectId(userId),
    });

    return foundQuestline;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function QuestlineSettings({ params }: Props) {
  const { id } = await params;

  const session = await auth();

  if (!session || !session?.user?.id) {
    notFound();
  }

  const questline = await getQuestLine(id, session.user.id);

  if (!questline) {
    redirect("/questline/new-line");
  }

  return (
    <>
      <div className="flex flex-col gap-4 w-full px-4 md:px-0">
        <div className="w-full flex items-end justify-between">
          <div className="flex flex-col">
            <p className="text-sm text-orange-100 uppercase">
              Questline Settings
            </p>
            <h1 className="text-base md:text-4xl font-bold text-orange-50">
              {questline.name}
            </h1>
          </div>
          <BackButton />
        </div>
        <DeleteQuestline
          questlineId={questline._id.toString("hex")}
          questlineName={questline.name}
        />
      </div>
    </>
  );
}
