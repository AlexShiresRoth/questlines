'use client';

import { Quest } from '@/app/schemas';
import { LoaderPinwheel, Trash } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { deleteQuest } from '../quest.action';
import { ToastContext } from '../toast-context';
import { SearchContext } from './search-context';

type Props = {
  quest: Quest & { _id: string };
  questlineId: string;
};

export const DeleteQuest = ({ quest, questlineId }: Props) => {
  const { updateQuest } = useContext(SearchContext);
  const { setToast } = useContext(ToastContext);
  const [isPending, setIsPending] = useState(false);
  const [state, setState] = useState<{ status: 'success' | 'error' | null }>({
    status: null,
  });

  const deleteQuestAction = async (id: string) => {
    setIsPending(true);
    const res = await deleteQuest(id, questlineId);
    setState({ status: res.status });
    updateQuest(res.updateId);
  };

  useEffect(() => {
    if (state?.status === 'success') {
      setToast({ type: 'success', message: 'Quest Deleted' });
    }
  }, [state, setToast]);

  return (
    <div className="hover:text-red-500 text-orange-50 transition-colors">
      {!isPending && (
        <button
          type="button"
          onClick={() => deleteQuestAction(quest._id)}
          className="flex items-center gap-2 text-sm"
        >
          <Trash size={14} /> Delete
        </button>
      )}
      {isPending && (
        <div className="flex items-center gap-2 text-sm">
          <LoaderPinwheel size={14} className="animate-spin" />
          <span>Deleting...</span>
        </div>
      )}
    </div>
  );
};
