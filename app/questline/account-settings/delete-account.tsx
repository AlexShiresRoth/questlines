'use client';

import { DeleteAccountSchema } from '@/app/schemas';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useActionState, useContext, useEffect } from 'react';
import { InputContainer, TextInput, UIError } from '../components/inputs';
import { ToastContext } from '../toast-context';
import { deleteAccount } from './account.action';

export const DeleteAccount = () => {
  const router = useRouter();
  const { setToast } = useContext(ToastContext);
  const [state, action, isPending] = useActionState(deleteAccount, null);

  useEffect(() => {
    if (state?.status === 'success') {
      setToast({ type: 'success', message: 'Account Deleted, goodbye :(' });

      router.push('/');
    }
  }, [state, router, setToast]);

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: DeleteAccountSchema,
      });
    },
    shouldRevalidate: 'onBlur',
  });

  return (
    <div className="flex flex-col gap-4">
      <p className="font-bold text-xl text-orange-100">
        Delete Sidequest account?
      </p>
      <p className="text-orange-100">
        Please type <b className="text-red-500">Delete My Account</b> to
        confirm.
      </p>
      <form
        className="flex flex-col md:flex-row justify-between gap-2"
        id={form.id}
        onSubmit={form.onSubmit}
        action={action}
      >
        <InputContainer>
          <TextInput
            name={fields.phrase.name}
            placeholder="Delete my account"
          />
          <UIError messages={fields.phrase.errors} />
        </InputContainer>
        <button
          type="submit"
          disabled={isPending}
          className="flex w-full md:w-1/3 self-end md:self-auto items-center gap-2 text-sm text-white transition-colors px-4 py-2 rounded-xl bg-red-500 hover:bg-red-400"
        >
          <Trash size={14} /> Delete account
        </button>
      </form>
    </div>
  );
};
