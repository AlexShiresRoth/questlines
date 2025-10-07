import { Quest, QuestType } from '@/app/schemas';
import { WithId } from 'mongodb';
import QuestItem from '../components/quest';
import QuestContainer from '../components/quest-container';
import { FadedContainer } from './faded-container';

type Props = {
  mainQuests: WithId<Quest>[] | null;
  secondaryQuests: WithId<Quest>[] | null;
  completedQuests: WithId<Quest>[] | null;
  questLine: string;
};

export default function QuestLineTemplate({
  mainQuests,
  secondaryQuests,
  completedQuests,
  questLine,
}: Props) {
  return (
    <FadedContainer bordered={false}>
      <div className="flex flex-col w-full px-4 rounded p-8">
        <div className="flex flex-col w-full gap-8">
          <div className="w-full flex flex-col">
            <QuestContainer
              title="Main Quests"
              type={QuestType.Main}
              questLineId={questLine}
            >
              {mainQuests && (
                <div className="flex py-2 flex-col gap-4">
                  {mainQuests.map((quest, index) => (
                    <QuestItem
                      quest={{ ...quest, _id: quest._id.toString() }}
                      key={quest._id.toString()}
                      index={index}
                      questlineId={questLine}
                    />
                  ))}
                </div>
              )}
            </QuestContainer>
          </div>
          <div className="w-full flex flex-col">
            <QuestContainer
              title="Side Quests"
              type={QuestType.Secondary}
              questLineId={questLine}
            >
              {secondaryQuests && (
                <div className="flex py-2 flex-col gap-4">
                  {secondaryQuests.map((quest, index) => (
                    <QuestItem
                      quest={{ ...quest, _id: quest._id.toString() }}
                      key={quest._id.toString()}
                      index={index}
                      questlineId={questLine}
                    />
                  ))}
                </div>
              )}
            </QuestContainer>
          </div>
          <div>
            <QuestContainer
              title="Completed Quests"
              type={QuestType.Completed}
              questLineId={questLine}
            >
              {completedQuests && (
                <div className="flex py-2 flex-col gap-4">
                  {completedQuests.map((quest, index) => (
                    <QuestItem
                      quest={{ ...quest, _id: quest._id.toString() }}
                      key={JSON.stringify(quest._id)}
                      index={index}
                      questlineId={questLine}
                    />
                  ))}
                </div>
              )}
            </QuestContainer>
          </div>
        </div>
      </div>
    </FadedContainer>
  );
}
