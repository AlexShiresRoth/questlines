'use client';

import { AcceptOrDeclineInviteSchema } from '@/app/schemas';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { CircleCheckBig, Loader } from 'lucide-react';
import { useActionState, useContext, useEffect } from 'react';
import { ToastContext } from '../../toast-context';
import { acceptInvite } from './invite.action';

type Props = {
  inviteId: string;
};

export const AcceptForm = ({ inviteId }: Props) => {
  const { setToast } = useContext(ToastContext);
  const [state, action, isPending] = useActionState(acceptInvite, null);

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
      setToast({ type: 'success', message: 'New Questline Accepted' });
    }
  }, [state, isPending, setToast]);

  return (
    <form
      className="flex items-center gap-2 justify-start"
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
      <button className="text-green-600 rounded-full" disabled={isPending}>
        {!isPending ? (
          <CircleCheckBig className="size-5" />
        ) : (
          <Loader className="animate-spin size-5" />
        )}
      </button>
    </form>
  );
};
