'use client';

import { LeaveQuestlineSchema } from '@/app/schemas';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { DoorOpen, LoaderPinwheel } from 'lucide-react';
import { useActionState, useContext, useEffect } from 'react';
import { FadedContainer } from '../../components/faded-container';
import { leaveQuestline } from '../../questline.action';
import { ToastContext } from '../../toast-context';

type Props = {
  questlineName: string;
  questlineId: string;
};

export default function LeaveQuestline({ questlineId, questlineName }: Props) {
  const { setToast } = useContext(ToastContext);
  const [state, action, isPending] = useActionState(leaveQuestline, null);

  const [form, fields] = useForm({
    defaultValue: {
      _id: questlineId,
    },
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: LeaveQuestlineSchema,
      });
    },
    shouldRevalidate: 'onBlur',
  });

  // Can't have a success message because the redirect happens before the client
  // page handles the redirect if no questline is found
  useEffect(() => {
    if (state?.status === 'error') {
      setToast({
        type: 'error',
        message: 'Could not leave questline',
      });
    }
    if (state?.status === 'success') {
      setToast({
        type: 'success',
        message: 'You have left the quest',
      });
    }
  }, [state, setToast]);

  return (
    <FadedContainer bordered={false}>
      <div className="gap-2 flex flex-col p-8">
        <h1 className="text-2xl font-bold text-red-500">Danger zone!</h1>
        <h2 className="font-semibold text-lg text-orange-100">
          Leave {questlineName}?
        </h2>
        <p className="text-orange-100">
          Once you leave, your access will be revoked and will need to be
          re-invited.
        </p>

        <form
          className="flex gap-4 items-start mt-2"
          id={form.id}
          onSubmit={form.onSubmit}
          action={action}
        >
          <input
            type="text"
            readOnly
            className="hidden"
            name={fields._id.name}
            defaultValue={fields._id.initialValue}
          />
          <button className="flex items-center gap-2 rounded-md bg-red-500 text-white px-4 py-2">
            {!isPending && (
              <>
                <DoorOpen className="size-4" /> Leave
              </>
            )}
            {isPending && (
              <>
                <LoaderPinwheel size={16} className="animate-spin" /> Leaving...
              </>
            )}
          </button>
        </form>
      </div>
    </FadedContainer>
  );
}
