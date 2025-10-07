'use client';

import { PERSONAL_QUESTLINE, TAILWIND_400_COLORS } from '@/app/constants';
import { Quest } from '@/app/schemas';
import clsx from 'clsx';
import { format } from 'date-fns';
import { Calendar, Edit } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { CompleteQuest } from './complete-quest';
import { DeleteQuest } from './delete-quest';
import LinearProgressBar from './linear-progress-bar';
import { Objective } from './step';

type Props = {
  quest: Quest & { _id: string };
  index: number;
  questlineId: string;
};

export default function QuestItem({ quest, questlineId }: Props) {
  const [isDetailsVisibile, toggleDetails] = useState(false);

  const questProgress =
    Math.round(
      ((quest.steps.filter((step) => step.completed).length || 0) /
        (quest.steps.length || 0)) *
        100
    ) || 0;

  const questIndicatorValue = TAILWIND_400_COLORS.find(
    (color) => color.value === quest.indicatorColor
  );

  const editQuestPath = `/questline${
    questlineId !== PERSONAL_QUESTLINE ? `/${questlineId}` : ''
  }/edit-quest/${quest._id}`;

  return (
    <div
      className={clsx(
        'flex flex-col justify-center w-full h-full gap-2 transition-all dark:bg-white/20 rounded-xl px-4 pl-6 relative',
        {
          'my-2': isDetailsVisibile,
          'p-0 border-transparent': !isDetailsVisibile,
          'hover:bg-orange-100/20': !isDetailsVisibile,
        }
      )}
    >
      <div
        className={clsx(
          'h-[90%] w-1 rounded flex absolute left-1 self-center',
          {
            [questIndicatorValue?.className ?? '']: quest.indicatorColor,
          }
        )}
      />
      <button
        className="flex flex-col gap-3 md:grid md:grid-cols-4 md:items-center md:gap-2 w-full py-4 md:justify-between"
        onClick={() => toggleDetails(!isDetailsVisibile)}
      >
        <div className="flex items-center md:order-2">
          <p
            className={clsx('text-xs', {
              [questIndicatorValue?.textClassName ?? '']: quest.indicatorColor,
            })}
          >
            {quest.category}
          </p>
        </div>
        <div className="flex items-center gap-2 order-1">
          {/* <Sparkle size={14} className="text-orange-600" /> */}
          <h4 className="text-sm md:text-md font-semibold text-left text-orange-100">
            {quest.name}
          </h4>
        </div>
        <div className="flex w-full md:justify-center order-1 md:order-3">
          <LinearProgressBar percentage={questProgress} />
        </div>
        {!quest.completed && (
          <div className="flex w-full md:justify-end order-3">
            <p className="text-xs md:text-sm italic text-orange-200/60 flex items-center gap-1">
              {quest.endDate ? (
                <>
                  <Calendar className="size-3" />
                  {format(new Date(quest.endDate), 'PP')}
                </>
              ) : (
                ''
              )}
            </p>
          </div>
        )}
        {quest.completed && (
          <div className="flex w-full md:justify-end order-2">
            <p className="text-xs md:text-sm italic text-orange-200/60 flex items-center gap-1">
              {quest.completionDate ? (
                <>
                  <Calendar className="size-3" />{' '}
                  {format(new Date(quest.completionDate), 'PP')}
                </>
              ) : (
                ''
              )}
            </p>
          </div>
        )}
      </button>
      {isDetailsVisibile && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-orange-100">
                <span className="italic font-semibold">Description</span>-{' '}
                {quest.description}
              </p>
            </div>
            <p className="font-semibold text-sm text-orange-100">Objectives</p>
            {quest.steps?.length > 0 && (
              <ul className="py-1 flex flex-col gap-2">
                {quest.steps.map((step, index) => (
                  <Objective
                    step={step}
                    key={step._id}
                    questId={quest._id}
                    questlineId={questlineId}
                    index={index}
                  />
                ))}
              </ul>
            )}
          </div>

          <div className="flex w-full items-center justify-between py-4 border-t border-t-white/20">
            <>
              <div className="flex items-center gap-8 text-orange-50">
                <CompleteQuest quest={quest} questlineId={questlineId} />
                {!quest.completed && (
                  <Link
                    href={editQuestPath}
                    className="flex items-center gap-2 text-sm hover:text-orange-500 transition-colors"
                  >
                    <Edit size={14} />
                    Edit
                  </Link>
                )}
              </div>
              <DeleteQuest quest={quest} questlineId={questlineId} />
            </>
          </div>
        </div>
      )}
    </div>
  );
}
