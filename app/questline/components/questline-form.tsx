'use client';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { LoaderPinwheel } from 'lucide-react';
import { useActionState, useContext, useEffect } from 'react';
import { CreateQuestlineClientSchema, Questline } from '../../schemas/index';
import { createOrEditQuestline } from '../questline.action';
import { ToastContext } from '../toast-context';
import { FadedContainer } from './faded-container';
import { InputContainer, Label, TextInput, UIError } from './inputs';

type Props = {
  questLine?: Questline;
};

export default function CreateQuestlineForm({ questLine }: Props) {
  const { setToast } = useContext(ToastContext);
  const [state, action, isPending] = useActionState(
    createOrEditQuestline,
    null
  );
  const [form, fields] = useForm({
    lastResult: state,
    defaultValue: {
      name: questLine?.name ?? '',
      partnerAccess: questLine?.partnerAccess ?? '',
    },
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: CreateQuestlineClientSchema,
      });
    },
    shouldRevalidate: 'onBlur',
  });

  useEffect(() => {
    if (state?.status === 'success') {
      setToast({
        type: 'success',
        message: questLine ? 'Questline updated' : 'Questline created',
      });
    }
    if (state?.status === 'error') {
      setToast({
        type: 'error',
        message: form.errors?.[0] ?? 'Plan Error',
      });
    }
  }, [state, questLine, setToast, form.errors]);

  return (
    <FadedContainer bordered={false}>
      <form
        onSubmit={form.onSubmit}
        id={form.id}
        action={action}
        className="flex flex-col gap-6 p-8"
      >
        {questLine && (
          <input
            type="text"
            className="hidden"
            readOnly
            name={fields._id.name}
            defaultValue={questLine?._id as string}
          />
        )}
        <InputContainer>
          <Label name={fields.name.name}>Questline Name</Label>
          <TextInput
            name={fields.name.name}
            defaultValue={fields.name.initialValue}
            placeholder="Name the line"
            maxLength={30}
          />
          <UIError messages={fields.name.errors} />
        </InputContainer>
        <InputContainer>
          <Label name={fields.partnerAccess.name}>Invite partner</Label>
          <TextInput
            name={fields.partnerAccess.name}
            defaultValue={fields.partnerAccess.initialValue}
            placeholder="howdy@partner.com"
          />
          <UIError messages={fields.partnerAccess.errors} />
        </InputContainer>
        <div className="w-full flex items-center justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded-xl flex items-center gap-2 hover:bg-orange-400 transition-colors"
            disabled={isPending}
          >
            {questLine ? (isPending ? 'Saving' : 'Edit Questline') : ''}

            {!questLine ? (isPending ? 'Creating...' : 'Create Questline') : ''}
            {isPending && <LoaderPinwheel className="animate-spin" size={16} />}
          </button>
        </div>
      </form>
    </FadedContainer>
  );
}
