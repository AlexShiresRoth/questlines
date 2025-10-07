import { TAILWIND_400_COLORS } from '@/app/constants';
import { Quest } from '@/app/schemas';
import clsx from 'clsx';
import { format } from 'date-fns';

type Props = {
  quests: Quest[];
  type: 'Main' | 'Side';
};

export default function UpcomingQuests({ quests, type }: Props) {
  if (quests.length === 0) {
    return (
      <div className="hidden md:block">
        <h2 className="text-orange-100 font-semibold text-sm uppercase">
          Upcoming {type} Quests
        </h2>
        <p className="dark:text-white/40">No Upcoming quests to complete</p>
      </div>
    );
  }

  return (
    quests.length > 0 && (
      <div className="flex flex-col gap-2 md:gap-4">
        <h2 className="text-orange-100 font-semibold text-sm uppercase">
          Upcoming {type} Quests
        </h2>
        <div
          className="flex flex-row md:flex-col gap-2 md:gap-8 overflow-x-auto w-full"
          style={{ scrollbarWidth: 'none' }}
        >
          {quests.map((quest) => (
            <div
              key={quest._id.toString('hex')}
              className="flex items-center gap-4 min-w-44 bg-white/20 p-2 md:p-0 rounded-xl md:bg-transparent"
            >
              <span
                className={clsx('h-10 w-1 rounded block', {
                  [TAILWIND_400_COLORS.find(
                    (color) => color.value === quest.indicatorColor
                  )?.className ?? '']: quest.indicatorColor,
                })}
              ></span>
              <div className="flex flex-col">
                <p className="text-white/50">{quest.name}</p>
                <p className="italic text-sm text-white/30">
                  {format(quest.endDate as Date, 'PP')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
}
