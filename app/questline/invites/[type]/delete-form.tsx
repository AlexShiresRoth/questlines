'use client';

import { AcceptOrDeclineInviteSchema } from '@/app/schemas';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { Loader, Trash } from 'lucide-react';
import { useActionState, useContext, useEffect } from 'react';
import { ToastContext } from '../../toast-context';
import { deleteInvite } from './invite.action';

type Props = {
  inviteId: string;
};

export const DeleteForm = ({ inviteId }: Props) => {
  const { setToast } = useContext(ToastContext);
  const [state, action, isPending] = useActionState(deleteInvite, null);

  const [form, fields] = useForm({
    defaultValue: {
      _id: inviteId,
    },
    lastResult: state,
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: AcceptOrDeclineInviteSchema,
      });
    },
    shouldRevalidate: 'onBlur',
  });

  useEffect(() => {
    if (state?.status === 'success') {
      setToast({
        type: 'success',
        message: 'Questline invite deleted',
      });
    }
  }, [state, isPending, setToast]);

  return (
    <form
      className="flex items-center gap-2"
      id={form.id}
      onSubmit={form.onSubmit}
      action={action}
    >
      <input
        className="hidden"
        value={fields._id.initialValue as string}
        name={fields._id.name}
        readOnly
      />
      <button
        className="text-white bg-red-600 p-2 rounded-full"
        disabled={isPending}
      >
        {!isPending ? (
          <Trash className="size-4 md:size-5" />
        ) : (
          <Loader className="animate-spin size-5" />
        )}
      </button>
    </form>
  );
};
