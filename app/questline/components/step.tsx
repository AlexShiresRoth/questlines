'use client';

import { type Step } from '@/app/schemas';
import clsx from 'clsx';
import { Check, LoaderPinwheel } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { completeStep } from '../quest.action';
import { ToastContext } from '../toast-context';

type Props = {
  step: Step;
  questId: string;
  questlineId: string;
  index: number;
};

export const Objective = ({ step, questId, questlineId, index }: Props) => {
  const { setToast } = useContext(ToastContext);
  const [isInfoVisible, toggleInfo] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState<{ status: 'success' | 'error' | null }>({
    status: null,
  });

  const handleCompleteStep = async () => {
    setIsPending(true);
    return setState(
      await completeStep(questId, step._id as string, questlineId)
    );
  };

  useEffect(() => {
    if (state?.status === 'success') {
      setToast({ type: 'success', message: 'Quest Updated' });
      setIsPending(false);
    }
  }, [state, setToast]);

  return (
    <button
      onClick={() => handleCompleteStep()}
      key={step.title}
      onMouseEnter={() => toggleInfo(true)}
      onMouseLeave={() => toggleInfo(false)}
      className={clsx(
        'cursor-pointer flex flex-wrap justify-between items-center rounded-md p-1',
        {
          'text-orange-300': step.completed,
          'text-orange-50 hover:text-orange-300 transition-colors':
            !step.completed,
        }
      )}
    >
      <span className="w-3/4 flex items-center gap-2 text-left text-xs md:text-sm">
        {isPending ? (
          <LoaderPinwheel size={14} className="animate-spin" />
        ) : (
          <>{index + 1}.</>
        )}
        <span>{step.title}</span>
      </span>

      {isInfoVisible && !step.completed && (
        <span className="text-sm justify-end">Set as complete?</span>
      )}
      {step.completed && <Check size={14} />}
    </button>
  );
};
