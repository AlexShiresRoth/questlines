import clsx from "clsx";
import { unstable_cache } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "../auth";
import { COLLECTION_NAME, DB_NAME, PERSONAL_QUESTLINE } from "../constants";
import client from "../mongo-client";
import { Quest, QuestType } from "../schemas";
import PageWrapper from "./components/page-wrapper";
import { QuestlineProgress } from "./components/questline-progress";
import QuestLineTemplate from "./components/questline-template";
import { SearchAndTitleWrapper } from "./components/search-and-title-wrapper";
import { SearchQuest } from "./components/search-quest";
import Sidebar from "./components/side-bar";
import UpcomingQuests from "./components/upcoming-quests";

async function getQuests(
  type: QuestType,
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
      createdBy: userId,
      questType: type,
      completed: !!completed,
      questLine: PERSONAL_QUESTLINE,
    });

    return questsCursor.toArray();
  } catch (error) {
    console.error("ERROR RETRIEVING QUESTS::", error);
    return null;
  }
}

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

//TODO could we drag quests to different sections to change their type?
export default async function Page() {
  const session = await auth();

  if (!session || !session?.user?.id) {
    redirect("/sign-in");
  }

  const cachedQuests = unstable_cache(
    async () => {
      const userId = session?.user?.id;
      const mainQuests = await getQuests(QuestType.Main, userId);
      const secondaryQuests = await getQuests(QuestType.Secondary, userId);
      const completedQuests = await getQuests(
        QuestType.Completed,
        userId,
        true
      );
      return [mainQuests, secondaryQuests, completedQuests];
    },
    [session?.user?.id, "quests", "questlines"],
    { tags: ["quests", "questlines"], revalidate: 60 }
  );

  const [mainQuests, secondaryQuests, completedQuests] = await cachedQuests();

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

  return (
    <PageWrapper>
      <Sidebar pageId="questline" />

      <div className="flex flex-col  rounded-md gap-8 px-4 md:px-0">
        <SearchAndTitleWrapper>
          <div className="flex flex-col">
            <p className="text-xs uppercase font-semibold text-orange-100">
              Questline
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-nowrap text-orange-50">
              Personal
            </h2>
          </div>

          <SearchQuest questLine={PERSONAL_QUESTLINE} />
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
          questLine={PERSONAL_QUESTLINE}
        />
      </div>
      <UpcomingComponent
        upcomingMainQuests={upcomingMainQuests as Quest[]}
        upcomingSideQuests={upcomingSideQuests as Quest[]}
        hiddenClass="hidden md:flex"
      />
    </PageWrapper>
  );
}
