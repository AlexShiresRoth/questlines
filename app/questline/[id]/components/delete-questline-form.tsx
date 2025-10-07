'use client';

import { DeleteQuestlineSchema } from '@/app/schemas';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { LoaderPinwheel, Trash2 } from 'lucide-react';
import { useActionState, useContext, useEffect } from 'react';
import { FadedContainer } from '../../components/faded-container';
import { InputContainer, TextInput, UIError } from '../../components/inputs';
import { deleteQuestline } from '../../questline.action';
import { ToastContext } from '../../toast-context';

type Props = {
  questlineName: string;
  questlineId: string;
};

export default function DeleteQuestline({ questlineId, questlineName }: Props) {
  const { setToast } = useContext(ToastContext);
  const [state, action, isPending] = useActionState(deleteQuestline, null);

  const [form, fields] = useForm({
    defaultValue: {
      _id: questlineId,
      deletePhrase: '',
    },
    onValidate({ formData }) {
      return parseWithZod(formData, {
        schema: DeleteQuestlineSchema,
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
        message: 'Could not delete questline',
      });
    }
    if (state?.status === 'success') {
      setToast({
        type: 'success',
        message: 'Questline deleted',
      });
    }
  }, [state, setToast]);

  return (
    <FadedContainer bordered={false}>
      <div className="gap-2 flex flex-col p-8">
        <h1 className="text-2xl font-bold text-red-500">Danger zone!</h1>
        <h2 className="font-semibold text-lg text-orange-100">
          Delete {questlineName}?
        </h2>
        <p className="text-orange-100">
          Deleting this questline will remove all quests linked to it, and
          remove it for anyone with granted access.
        </p>
        <p className="text-orange-100">
          Please enter{' '}
          <b className="text-red-600">delete questline {questlineName}</b>{' '}
          below.
        </p>
        <form
          className="flex gap-4 items-start"
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
          <InputContainer>
            <TextInput
              name={fields.deletePhrase.name}
              placeholder={`delete questline...`}
            />
            <UIError
              messages={state?.error?.[fields.deletePhrase.name] as string[]}
            />
          </InputContainer>
          <button className="flex items-center gap-2 rounded-md bg-red-500 text-white px-4 py-2">
            {!isPending && (
              <>
                <Trash2 size={16} /> Delete
              </>
            )}
            {isPending && (
              <>
                <LoaderPinwheel size={16} className="animate-spin" />{' '}
                Deleting...
              </>
            )}
          </button>
        </form>
      </div>
    </FadedContainer>
  );
}
