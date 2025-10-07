import { auth } from "@/app/auth";
import { DB_NAME, QUESTLINE_COLLECTION } from "@/app/constants";
import client from "@/app/mongo-client";
import { Questline } from "@/app/schemas";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";
import BackButton from "../../components/back-button";
import CreateQuestlineForm from "../../components/questline-form";

type Props = {
  params: Promise<{ id: string }>;
};

// TODO need to refactor the app and reuse this function
async function getQuestLine(id: string, userId: string) {
  try {
    if (!id) {
      throw new Error("No questline id provied");
    }

    const db = client.db(DB_NAME);
    const collection = db.collection<Questline>(QUESTLINE_COLLECTION);

    const questline = collection.findOne({
      $or: [
        {
          _id: new ObjectId(id),
          createdBy: new ObjectId(userId),
        },
      ],
    });

    return await questline;
  } catch (error) {
    console.error("ERROR", error);
    return null;
  }
}

export default async function EditQuestline({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  if (!session || !session?.user?.id) {
    notFound();
  }
  const foundQuestLine = await getQuestLine(id, session.user.id);

  if (!foundQuestLine) {
    notFound();
  }

  const questline: Questline = {
    ...foundQuestLine,
    _id: foundQuestLine._id.toString("hex"),
    createdBy: foundQuestLine.createdBy.toString("hex"),
  };

  return (
    <div className="flex flex-col gap-4 w-full px-4 md:px-0">
      <div className="flex items-end justify-between w-full">
        <div className="flex flex-col">
          <p className="text-sm text-orange-100 uppercase">Edit Questline</p>
          <h1 className="text-base md:text-4xl font-bold text-orange-50">
            {questline.name}
          </h1>
        </div>
        <BackButton />
      </div>
      <CreateQuestlineForm questLine={questline} />
    </div>
  );
}
