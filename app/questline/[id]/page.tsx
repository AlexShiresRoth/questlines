import { auth } from "@/app/auth";
import {
  COLLECTION_NAME,
  DB_NAME,
  QUESTLINE_COLLECTION,
  USERS_COLLECTION,
} from "@/app/constants";
import client from "@/app/mongo-client";
import { Quest, Questline, QuestType, User } from "@/app/schemas";
import clsx from "clsx";
import { ObjectId } from "mongodb";
import { unstable_cache } from "next/cache";
import Image from "next/image";
import { redirect } from "next/navigation";
import { QuestlineProgress } from "../components/questline-progress";
import QuestLineTemplate from "../components/questline-template";
import { SearchAndTitleWrapper } from "../components/search-and-title-wrapper";
import { SearchQuest } from "../components/search-quest";
import UpcomingQuests from "../components/upcoming-quests";
import QuestlineSettings from "./components/questline-settings";

async function getQuests(
  type: QuestType,
  questLineId: string,
  userId?: string,
  completed?: boolean
) {
  try {
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const db = client.db(DB_NAME);
    const collection = db.collection<Quest>(COLLECTION_NAME);

    const questsCursor = collection.find({
      $or: [
        {
          questType: type,
          completed: !!completed,
          questLine: questLineId,
        },
      ],
    });

    return questsCursor.toArray();
  } catch (error) {
    console.error("ERROR RETRIEVING QUESTS::", error);
    return null;
  }
}

async function getQuestLine(id: string, userId: string, userEmail?: string) {
  try {
    if (!id) {
      throw new Error("No questline id provied");
    }

    const db = client.db(DB_NAME);
    const collection = db.collection<Questline>(QUESTLINE_COLLECTION);

    const collectionCursor = collection.findOne({
      $or: [
        {
          _id: new ObjectId(id),
          partnerAccess: userEmail,
        },
        {
          _id: new ObjectId(id),
          createdBy: new ObjectId(userId),
        },
      ],
    });

    return await collectionCursor;
  } catch (error) {
    console.error("ERROR", error);
    return null;
  }
}

async function getUsersWithAccess(creator: string, partner: string) {
  try {
    const db = client.db(DB_NAME);
    const collection = db.collection<User>(USERS_COLLECTION);

    return await collection
      .find({
        $or: [
          {
            _id: new ObjectId(creator),
          },
          {
            email: partner,
          },
        ],
      })
      .toArray();
  } catch (error) {
    console.error("error getting users with access", error);
    return null;
  }
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  if (!session || !session?.user?.id) {
    redirect("/sign-in");
  }

  const cachedQuests = unstable_cache(
    async () => {
      const userId = session?.user?.id;
      const mainQuests = await getQuests(QuestType.Main, id, userId);
      const secondaryQuests = await getQuests(QuestType.Secondary, id, userId);
      const completedQuests = await getQuests(
        QuestType.Completed,
        id,
        userId,
        true
      );
      return [mainQuests, secondaryQuests, completedQuests];
    },
    [id],
    { tags: ["quests", "questlines"], revalidate: 60 }
  );

  const questLine = unstable_cache(
    async () => {
      const questLine = await getQuestLine(
        id,
        session.user?.id as string,
        session.user?.email as string
      );

      return questLine;
    },
    [id],
    { tags: ["quests", "questlines"], revalidate: 60 }
  );

  const foundQuestLine = await questLine();

  const usersCache = unstable_cache(
    async () => {
      return await getUsersWithAccess(
        foundQuestLine?.createdBy.toString(),
        foundQuestLine?.partnerAccess ?? ""
      );
    },
    [foundQuestLine?.createdBy, foundQuestLine?.partnerAccess, session.user.id],
    { tags: ["questlines", "users", "quests"], revalidate: 60 }
  );

  const [mainQuests, secondaryQuests, completedQuests] = await cachedQuests();

  const usersWithAccess = await usersCache();

  const percentageComplete = Math.round(
    ((completedQuests?.length || 0) /
      [
        ...(mainQuests ?? []),
        ...(secondaryQuests ?? []),
        ...(completedQuests ?? []),
      ].length || 0) * 100
  );

  const remainingQuestCount =
    (mainQuests?.length || 0) + (secondaryQuests?.length || 0);

  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + 1);
  const monthAway = currentDate.getTime();
  const upcomingMainQuests = mainQuests?.filter(
    (quest) => new Date(quest.endDate ?? "").getTime() < monthAway
  );
  const upcomingSideQuests = secondaryQuests?.filter(
    (quest) => new Date(quest.endDate ?? "").getTime() < monthAway
  );

  const UpcomingComponent = ({
    upcomingMainQuests,
    upcomingSideQuests,
    hiddenClass,
  }: {
    upcomingMainQuests: Quest[];
    upcomingSideQuests: Quest[];
    hiddenClass: string;
  }) => (
    <div
      className={clsx("flex-col gap-8", {
        [hiddenClass]: hiddenClass,
      })}
    >
      <UpcomingQuests quests={upcomingMainQuests} type="Main" />
      <UpcomingQuests quests={upcomingSideQuests} type="Side" />
    </div>
  );

  return (
    <>
      <div className="flex flex-col gap-8 w-full pb-24 md:pb-0 px-4 md:px-0">
        <SearchAndTitleWrapper>
          {foundQuestLine && (
            <div className="flex flex-col order-2 md:order-1">
              <p className="text-xs uppercase font-semibold text-orange-100">
                Questline
              </p>
              <h2 className="text-3xl md:text-4xl text-orange-50 font-semibold text-nowrap">
                {foundQuestLine?.name}
              </h2>
            </div>
          )}
          <div className="order-3 md:order-2 w-full md:pl-8">
            <SearchQuest questLine={id} />
          </div>
          {usersWithAccess?.length && (
            <div className="flex flex-col items-start mt-2 md:mt-0 md:translate-x-4 order-1 md:order-3">
              <p className="text-xs font-semibold text-orange-100 uppercase">
                Access
              </p>
              <div className="flex items-center">
                {usersWithAccess.map(
                  (user, i) =>
                    user.image && (
                      <div key={user._id.toString("hex")}>
                        <Image
                          unoptimized
                          width={45}
                          height={45}
                          src={user.image}
                          alt={user.name}
                          className={clsx(
                            "rounded-full border-2 border-orange-200",
                            {
                              "-translate-x-4": i > 0,
                            }
                          )}
                        />
                      </div>
                    )
                )}
              </div>
            </div>
          )}
        </SearchAndTitleWrapper>
        <UpcomingComponent
          upcomingMainQuests={upcomingMainQuests as Quest[]}
          upcomingSideQuests={upcomingSideQuests as Quest[]}
          hiddenClass="flex md:hidden"
        />
        <QuestlineProgress
          percentage={percentageComplete}
          totalQuestsRemaining={remainingQuestCount}
          mainQuestNum={mainQuests?.length || 0}
          sideQuestNum={secondaryQuests?.length || 0}
        />
        <QuestLineTemplate
          mainQuests={mainQuests}
          secondaryQuests={secondaryQuests}
          completedQuests={completedQuests}
          questLine={id}
        />
      </div>
      <div className="flex flex-col gap-8">
        <QuestlineSettings id={id} />
        <UpcomingComponent
          upcomingMainQuests={upcomingMainQuests as Quest[]}
          upcomingSideQuests={upcomingSideQuests as Quest[]}
          hiddenClass="hidden md:flex"
        />
      </div>
    </>
  );
}
