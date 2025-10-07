import {
  DB_NAME,
  INVITES_COLLECTION,
  QUESTLINE_COLLECTION,
} from "@/app/constants";
import { Questline, QuestlineInvite } from "@/app/schemas";
import clsx from "clsx";
import { AppWindow, Home } from "lucide-react";
import { ObjectId } from "mongodb";
import { Session } from "next-auth";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "../../auth";
import client from "../../mongo-client";
import NavigationContextProvider from "../navigation-context";
import MobileNav from "./mobile-nav";
import SidebarContent from "./side-bar-content";

async function getQuestlines(session: Session) {
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  const db = client.db(DB_NAME);
  const collection = db.collection<Questline>(QUESTLINE_COLLECTION);

  const questlinesCursor = collection.find({
    $or: [
      {
        createdBy: new ObjectId(session.user.id),
      },
      {
        access: {
          $in: [session.user.email ?? ""],
        },
      },
    ],
  });

  return questlinesCursor.toArray();
}

async function getPendingInvitesAmount(session: Session): Promise<number> {
  if (!session || !session.user?.id || !session.user.email) {
    throw new Error("Unauthorized");
  }

  const db = client.db(DB_NAME);
  const invitesCollection = db.collection<QuestlineInvite>(INVITES_COLLECTION);

  const invitesCursor = invitesCollection.find({
    invitee: session.user.email,
    pending: true,
  });

  return (await invitesCursor.toArray()).length;
}

type Props = {
  pageId?: string;
};

export default async function Sidebar({ pageId }: Props) {
  const session = await auth();

  if (!session || !session.user?.id) {
    notFound();
  }

  const cache = unstable_cache(
    async () => {
      const questlines = await getQuestlines(session);
      const pendingInvites = await getPendingInvitesAmount(session);
      return { questlines, pendingInvites };
    },
    ["questlines", session?.user?.id as string],
    { tags: ["quests", "questlines", "invites"], revalidate: 60 }
  );

  const { questlines, pendingInvites } = await cache();

  return (
    <NavigationContextProvider>
      <MobileNav />
      <SidebarContent
        userName={session.user?.name ?? ""}
        userImage={session.user?.image ?? ""}
        pendingInvites={pendingInvites as number}
      >
        {questlines.length > 0 && (
          <div className="flex flex-col gap-4">
            <p className="font-semibold uppercase text-sm text-orange-50">
              Questlines
            </p>
            <div className="pl-4 flex flex-col gap-2 max-h-[30vh] md:max-h-[50vh] overflow-y-auto">
              <Link
                href={`/questline`}
                key={"home"}
                className={clsx(
                  "flex items-center p-2 rounded-md text-sm gap-2 text-orange-50 hover:text-orange-200 transition-colors",
                  {
                    "bg-white/20": pageId === "questline",
                  }
                )}
              >
                <Home size={14} />
                Personal
              </Link>
              {questlines.map((line) => (
                <Link
                  href={`/questline/${line._id}`}
                  key={line._id.toString()}
                  className={clsx(
                    "flex items-center p-2 rounded-md text-sm gap-2 hover:text-orange-200 transition-colors",
                    {
                      "bg-white/20 text-orange-50":
                        pageId === line._id.toString("hex"),
                      "text-orange-50": pageId !== line._id.toString("hex"),
                    }
                  )}
                >
                  <AppWindow size={14} />
                  {line.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </SidebarContent>
    </NavigationContextProvider>
  );
}
