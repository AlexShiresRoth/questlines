'use client';

import { Quest } from '@/app/schemas';
import { Check, LoaderPinwheel } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { completeQuest } from '../quest.action';
import { ToastContext } from '../toast-context';
import { SearchContext } from './search-context';

type Props = {
  quest: Quest & { _id: string };
  questlineId: string;
};

export const CompleteQuest = ({ quest, questlineId }: Props) => {
  const { updateQuest } = useContext(SearchContext);
  const { setToast } = useContext(ToastContext);
  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState<{ status: 'success' | 'error' | null }>({
    status: null,
  });

  const completeQuestAction = async (id: string) => {
    setIsPending(true);

    const res = await completeQuest(id, questlineId);

    setState({ status: res.status });

    // signal the search modal to update results
    updateQuest(res.updateId);
  };

  useEffect(() => {
    if (state?.status === 'success') {
      setToast({ type: 'success', message: 'Quest completed!' });
      setIsPending(false);
    }
  }, [state, setToast]);

  return (
    <div>
      {!quest.completed && !isPending && (
        <button
          type="button"
          onClick={() => completeQuestAction(quest._id)}
          className="flex items-center gap-2 text-sm hover:text-orange-500 transition-colors"
        >
          <Check size={14} />
          Complete
        </button>
      )}
      {isPending && (
        <div className="flex items-center gap-2 text-sm">
          <LoaderPinwheel size={14} className="animate-spin" />
          <span>Completing...</span>
        </div>
      )}
      {quest.completed && (
        <span className="flex items-center gap-2 text-sm text-orange-500">
          <Check size={14} />
          Complete
        </span>
      )}
    </div>
  );
};
