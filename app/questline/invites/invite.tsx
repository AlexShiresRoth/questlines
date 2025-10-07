import { auth } from "@/app/auth";
import { DB_NAME, QUESTLINE_COLLECTION } from "@/app/constants";
import client from "@/app/mongo-client";
import { Questline, QuestlineInvite } from "@/app/schemas";
import clsx from "clsx";
import { format } from "date-fns";
import { ObjectId } from "mongodb";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AcceptForm } from "./[type]/accept-form";
import { DeclineForm } from "./[type]/decline-form";
import { DeleteForm } from "./[type]/delete-form";

type Props = {
  id: string;
  invite: QuestlineInvite;
  received: boolean;
};

async function getQuestline(
  id: string,
  userId?: string,
  userEmail?: string | null
) {
  try {
    const db = client.db(DB_NAME);
    const collection = db.collection<Questline>(QUESTLINE_COLLECTION);
    const questline = await collection.findOne({
      $or: [
        { _id: new ObjectId(id), createdBy: new ObjectId(userId) },
        { _id: new ObjectId(id), partnerAccess: userEmail ?? "" },
      ],
    });

    if (!questline) {
      throw new Error("Could not locate questline with this id");
    }

    return questline;
  } catch (error) {
    console.error(error);

    return null;
  }
}

export default async function Invite({ id, invite, received }: Props) {
  const session = await auth();

  // this is not really necessary, parent component has this check
  if (!session || !session.user?.id) {
    notFound();
  }

  const cache = unstable_cache(
    async () => {
      return await getQuestline(id, session.user?.id, session?.user?.email);
    },
    [session.user.id],
    { tags: ["questlines", "invites"], revalidate: 60 }
  );

  const questline = await cache();

  return (
    <div
      className={clsx(
        "md:items-center w-full md:justify-between p-3 bg-white/10 border-b border-b-white/20 text-white text-sm",
        {
          "flex items-center justify-between gap-2 md:grid grid-cols-5":
            received,
          "flex items-center justify-between md:grid grid-cols-5": !received,
        }
      )}
    >
      {!received && (
        <>
          {invite.pending && !invite.accepted && (
            <div className="flex justify-start">
              <p className="flex items-center gap-2 p-1 md:p-2 rounded bg-orange-100 text-orange-400 text-xs md:text-sm">
                <span className="w-2 h-2 bg-orange-400/80 block rounded-full" />
                pending
              </p>
            </div>
          )}
          {!invite.pending && !invite.accepted && (
            <div className="flex justify-start">
              <p className="flex items-center gap-2 p-1 md:p-2 rounded bg-red-100 text-red-400 text-xs md:text-sm">
                <span className="w-2 h-2 bg-red-400/80 block rounded-full" />
                declined
              </p>
            </div>
          )}
        </>
      )}
      {received && <AcceptForm inviteId={invite._id.toString("hex")} />}
      {/* Small screen section */}
      <div className="flex flex-col md:hidden">
        <Link
          href={`/questline/${questline?._id.toString("hex")}`}
          className="text-md font-semibold"
        >
          {questline?.name}
        </Link>
        <p className="text-xs text-gray-400">{invite.invitee}</p>
        <p className="text-xs text-gray-400">{format(invite.sendDate, "PP")}</p>
      </div>

      {/* Wide screen section */}
      <Link
        href={`/questline/${questline?._id.toString("hex")}`}
        className="hidden md:block"
      >
        {questline?.name}
      </Link>
      <p className="hidden md:block">{invite.invitee}</p>
      <p className="hidden md:block">{format(invite.sendDate, "PP")}</p>
      {!received && <DeleteForm inviteId={invite._id.toString("hex")} />}
      {/*  */}

      {received && <DeclineForm inviteId={invite._id.toString("hex")} />}
    </div>
  );
}
