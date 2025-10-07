import { auth } from "@/app/auth";
import { DB_NAME, INVITES_COLLECTION } from "@/app/constants";
import client from "@/app/mongo-client";
import { QuestlineInvite } from "@/app/schemas";
import clsx from "clsx";
import { Inbox, Send } from "lucide-react";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageWrapper from "../../components/page-wrapper";
import Sidebar from "../../components/side-bar";
import Invite from "../invite";

async function getPendingSentInvites(userId: string) {
  try {
    const db = client.db(DB_NAME);
    const collection = db.collection<QuestlineInvite>(INVITES_COLLECTION);

    const invitesCursor = collection.find({
      createdBy: userId,
      accepted: false,
    });

    return await invitesCursor.toArray();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getReceivedInvites(userEmail: string) {
  try {
    const db = client.db(DB_NAME);
    const collection = db.collection<QuestlineInvite>(INVITES_COLLECTION);

    const invitesCursor = collection.find({
      invitee: userEmail,
      pending: true,
      accepted: false,
    });

    return await invitesCursor.toArray();
  } catch (error) {
    console.error(error);
    return null;
  }
}

type Props = {
  params: Promise<{ type: "received" | "sent" }>;
};

export default async function Invites({ params }: Props) {
  const { type } = await params;

  if (type !== "received" && type !== "sent") {
    notFound();
  }

  const session = await auth();

  const userId = session?.user?.id ?? "";
  const userEmail = session?.user?.email ?? "";
  if (!session || !userId) {
    notFound();
  }

  const cache = unstable_cache(
    async () => {
      return [
        await getPendingSentInvites(userId),
        await getReceivedInvites(userEmail),
      ];
    },
    [userId],
    { tags: ["invites", "questlines"], revalidate: 60 }
  );

  const [sentInvites, receivedInvites] = await cache();

  return (
    <PageWrapper>
      <Sidebar />
      <div className="flex flex-col w-full gap-8 px-4 pt-4 md:px-0 md:pt-0">
        <div>
          <h1 className="text-2xl font-bold flex items-center text-orange-100">
            Invites
          </h1>
          <p className=" text-lg text-orange-200">
            Manage your sent and received questline invites
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="received"
            className={clsx("hover:text-orange-50 transition-colors", {
              "text-orange-400": type === "received",
              "text-orange-50": type !== "received",
            })}
          >
            Received
          </Link>
          <span className="text-gray-300">{`|`}</span>
          <Link
            href="sent"
            className={clsx("hover:text-orange-50 transition-colors", {
              "text-orange-400": type !== "received",
              "text-orange-50": type === "received",
            })}
          >
            Sent
          </Link>
        </div>
        {type === "sent" && (
          <div className="flex flex-col p-4 rounded-md w-full gap-4 bg-white/20">
            <div className="border-b border-b-white/20 pb-2 ">
              <h2 className="flex items-center gap-2 text-lg text-orange-100 px-3">
                <Send size={14} /> Sent -{" "}
                <span className="text-sm w-6 h-6 flex items-center justify-center rounded-full bg-orange-400/60 text-orange-100">
                  {(sentInvites?.length || 0) > 99
                    ? "99+"
                    : sentInvites?.length || 0}
                </span>
              </h2>
            </div>
            {sentInvites && (
              <div className="flex flex-col gap-2">
                <div className="hidden md:grid grid-cols-5 px-3 text-sm text-orange-100">
                  <p>Status</p>
                  <p>Questline</p>
                  <p>Recipient</p>
                  <p>Sent Date</p>
                  <p>Delete</p>
                </div>

                <div className="flex flex-col">
                  {sentInvites?.length > 0 &&
                    sentInvites.map((invite) => (
                      <Invite
                        id={invite.questlineId}
                        key={invite._id.toString("hex")}
                        invite={invite}
                        received={false}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {type === "received" && (
          <div className="flex flex-col p-4 bg-white/20 rounded-md w-full gap-4">
            <div className="border-b border-b-white/20 pb-2">
              <h2 className="flex items-center gap-2 text-lg px-3 text-orange-100">
                <Inbox size={14} /> Received -{" "}
                <span className="text-sm w-6 h-6 flex items-center justify-center rounded-full bg-orange-400/50 text-orange-50">
                  {receivedInvites?.length || 0}
                </span>
              </h2>
            </div>
            {receivedInvites && (
              <div className="flex flex-col gap-2">
                <div className="hidden md:grid grid-cols-5 px-3 text-sm text-orange-100">
                  <p>Accept</p>
                  <p>Questline</p>
                  <p>Sender</p>
                  <p>Sent Date</p>
                  <p>Decline</p>
                </div>
                <div className="flex flex-col max-h-[60vh] overflow-y-auto">
                  {receivedInvites?.length > 0 &&
                    receivedInvites.map((invite) => (
                      <Invite
                        id={invite.questlineId}
                        key={invite._id.toString("hex")}
                        invite={invite}
                        received
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
