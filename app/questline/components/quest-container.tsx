'use client';

import { QuestType } from '@/app/schemas';
import clsx from 'clsx';
import { PlusCircle, SquareMinus, SquarePlus } from 'lucide-react';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';

type Props = {
  title: string;
  type: QuestType;
  children: ReactNode;
  questLineId?: string;
};

export default function QuestContainer({
  title,
  type,
  children,
  questLineId,
}: Props) {
  const [isChildrenVisible, toggleChildrenContainer] = useState(false);

  // Render the main quests on load
  useEffect(() => {
    if (type === QuestType.Main) {
      toggleChildrenContainer(true);
    }
  }, [type]);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleChildrenContainer(!isChildrenVisible)}
            className="flex items-center gap-2"
          >
            {isChildrenVisible ? (
              <SquareMinus size={16} className="text-orange-50" />
            ) : (
              <SquarePlus size={16} className="text-orange-50" />
            )}
            {type === QuestType.Main ? (
              <h1 className="text-xl text-orange-50">{title}</h1>
            ) : (
              <h2 className="text-lg text-orange-50">{title}</h2>
            )}
          </button>
        </div>
        {type !== QuestType.Completed && (
          <Link
            href={`/add-quest/${type}?questLine=${questLineId}`}
            passHref
            className="flex items-center gap-2 text-orange-50 p-1 px-2 text-xs rounded-lg md:text-sm md:p-2 dark:bg-orange-600 md:rounded-xl dark:hover:bg-orange-500"
          >
            New Quest
            <PlusCircle className="size-3 md:size-5" />
          </Link>
        )}
      </div>
      <div
        className={clsx('transition-all overflow-y-auto', {
          'max-h-auto': isChildrenVisible,
          'max-h-0': !isChildrenVisible,
        })}
      >
        {children}
      </div>
    </div>
  );
}
