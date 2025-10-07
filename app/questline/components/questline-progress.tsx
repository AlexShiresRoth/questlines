import { clsx } from 'clsx';
import { ReactNode } from 'react';
import { CircleProgressBar } from './circle-progress-bar';
import { FadedContainer } from './faded-container';

type Props = {
  percentage: number;
  mainQuestNum: number;
  sideQuestNum: number;
  totalQuestsRemaining: number;
};

const ProgContainer = ({
  children,
  direction,
}: {
  children: ReactNode;
  direction: 'flex-col' | 'flex-row';
}) => {
  return (
    <FadedContainer bordered={false}>
      <div
        className={clsx(
          'flex gap-4 rounded items-center h-full justify-center md:justify-between p-4 min-w-52',
          {
            [direction]: direction,
          }
        )}
      >
        {children}
      </div>
    </FadedContainer>
  );
};

export const QuestlineProgress = ({
  percentage,
  totalQuestsRemaining,
  mainQuestNum,
  sideQuestNum,
}: Props) => {
  return (
    <div
      className="flex gap-4 overflow-x-auto w-full md:grid md:grid-cols-3"
      style={{ scrollbarWidth: 'none' }}
    >
      <ProgContainer direction="flex-col">
        <p className="font-semibold text-orange-100 text-center">
          Questline Progress
        </p>
        <CircleProgressBar percentage={percentage} />
      </ProgContainer>
      <ProgContainer direction="flex-col">
        <p className="font-semibold text-orange-100 text-center">
          Total Quests Remaining
        </p>
        <h2 className="font-bold text-7xl md:text-8xl text-center text-orange-50">
          {totalQuestsRemaining > 99 ? '99+' : totalQuestsRemaining}
        </h2>
      </ProgContainer>
      <ProgContainer direction="flex-row">
        <div className="flex flex-col items-center px-4 ">
          <p className="font-semibold text-center text-orange-100">
            Main Quests
          </p>
          <h2 className="font-bold text-7xl mt-4 text-orange-50">
            {mainQuestNum}
          </h2>
        </div>
        <div className="h-full w-[2px] rounded bg-white/20 block" />
        <div className="flex flex-col items-center px-4">
          <p className="font-semibold text-center text-orange-100">
            Side Quests
          </p>
          <h2 className="font-bold text-7xl mt-4 text-orange-50">
            {sideQuestNum}
          </h2>
        </div>
      </ProgContainer>
    </div>
  );
};
