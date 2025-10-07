import {
  DB_NAME,
  QUESTLINE_COLLECTION,
  USERS_COLLECTION,
} from "@/app/constants";
import { Questline, User as UserType } from "@/app/schemas";
import clsx from "clsx";
import { Cog, Edit, User } from "lucide-react";
import { ObjectId } from "mongodb";
import Link from "next/link";
import { auth } from "../../../auth";
import client from "../../../mongo-client";

type Props = {
  id: string;
};

async function getQuestline(id: string) {
  const db = client.db(DB_NAME);
  const collection = db.collection<Questline>(QUESTLINE_COLLECTION);
  const foundQuestline = await collection.findOne({
    _id: new ObjectId(id),
  });

  return foundQuestline;
}

async function getQuestlineCreatorName(creatorId: string) {
  const db = client.db(DB_NAME);
  const collection = db.collection<UserType>(USERS_COLLECTION);
  return await collection.findOne({
    _id: new ObjectId(creatorId),
  });
}

export default async function QuestlineSettings({ id }: Props) {
  const session = await auth();

  const questline = await getQuestline(id);

  const isCreator = questline?.createdBy.toString() === session?.user?.id;

  const creator = await getQuestlineCreatorName(questline?.createdBy);

  return (
    <div
      className={clsx(
        "fixed bottom-0 left-0 p-8 md:p-0 justify-center md:justify-start flex-row w-screen md:relative md:z-0 md:w-full flex md:flex-col md:pr-8"
      )}
    >
      <div className="rounded-md justify-between flex md:flex-col gap-4 w-full bg-orange-500 dark:bg-emerald-900 md:dark:bg-transparent  md:bg-transparent md:border-transparent md:w-11/12">
        <div
          data-testid="questline-settings"
          className="w-full flex items-center rounded-md md:flex-col md:items-start justify-between border-2 border-white/40 md:border-0 md:bg-transparent md:gap-4 p-4 md:p-0"
        >
          <p className="hidden md:block text-xs font-semibold uppercase text-orange-100">
            Questline
          </p>
          {isCreator && (
            <Link
              href={`/questline/${id}/edit-questline`}
              className="flex items-center gap-2 text-sm hover:text-orange-500 text-orange-100 transition-colors"
            >
              <Edit className="size-5 md:size-4" />
              Edit
            </Link>
          )}
          {isCreator && (
            <Link
              href={`/questline/${id}/settings`}
              className="flex items-center gap-2 text-sm hover:text-orange-500 text-orange-100 transition-colors"
            >
              <Cog className="size-5 md:size-4" />
              Settings
            </Link>
          )}
          {!isCreator && (
            <Link
              href={`/questline/${id}/partner-settings`}
              className="flex items-center gap-2 text-sm hover:text-orange-500 text-orange-100 transition-colors"
            >
              <Cog className="size-5 md:size-4" />
              Settings
            </Link>
          )}
          <div className="hidden md:flex text-sm flex-wrap  text-orange-100">
            <span className="flex items-center gap-2">
              <User className="size-5 md:size-4" /> Creator
            </span>
            <span className="text-orange-200 flex items-center gap-2">
              <User className="size-5 md:size-4 opacity-0" />
              {creator?.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
