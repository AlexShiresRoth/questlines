'use client';

import { TEXT_AREA_LENGTH, TEXT_INPUT_LENGTH } from '@/app/constants';
import {
  ClientValidationEditQuestSchema,
  ClientValidationQuestSchema,
  Quest,
  QuestType,
} from '@/app/schemas';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { LoaderPinwheel, MinusSquareIcon, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useActionState, useContext, useEffect } from 'react';
import { createQuest, editQuest } from '../quest.action';
import { ToastContext } from '../toast-context';
import {
  ColorPicker,
  DateInput,
  InputContainer,
  Label,
  TextArea,
  TextInput,
  UIError,
} from './inputs';

type Props = {
  type: QuestType;
  questLineId: string;
  quest?: Quest;
  partnerAccess?: string;
};

export const QuestForm = ({
  type,
  quest,
  questLineId,
  partnerAccess,
}: Props) => {
  const router = useRouter();
  const { setToast } = useContext(ToastContext);
  const [state, formAction, isPending] = useActionState(
    quest ? editQuest : createQuest,
    null
  );

  const currentDate = new Date();

  const today = currentDate.toISOString().split('T')[0];
  currentDate.setMonth(currentDate.getMonth() + 1);

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');

  const monthFromNow = `${year}-${month}-${day}`;

  const questStartDate = quest?.startDate?.toISOString?.().split('T')[0];
  const questEndDate = quest?.endDate?.toISOString?.().split('T')[0];
  const [form, fields] = useForm({
    defaultValue: {
      _id: quest?._id ?? '',
      name: quest?.name ?? '',
      category: quest?.category ?? '',
      startDate: questStartDate ?? '',
      endDate: questEndDate ?? '',
      description: quest?.description ?? '',
      questLine: questLineId ?? '',
      partnerAccess: partnerAccess ?? '',
      questType: type,
      indicatorColor: quest?.indicatorColor ?? '',
      steps:
        quest?.steps?.map((step) => ({
          ...step,
          completed: step.completed ? 'true' : 'false',
        })) ?? [],
    },
    onValidate({ formData }) {
      const res = parseWithZod(formData, {
        schema: quest
          ? ClientValidationEditQuestSchema
          : ClientValidationQuestSchema,
      });

      return res;
    },
    shouldValidate: 'onBlur',
  });

  const stepsFields = fields.steps.getFieldList();

  useEffect(() => {
    if (state?.status === 'success') {
      setToast({
        type: 'success',
        message: quest ? 'Quest updated' : `Quest created`,
      });
      router.back();
    }
  }, [state, router, quest, setToast]);

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={formAction}>
      <input
        defaultValue={type}
        className="hidden"
        readOnly
        name={fields.questType.name}
      />
      <input
        defaultValue={questLineId}
        className="hidden"
        readOnly
        name={fields.questLine.name}
      />
      {quest && (
        <input
          defaultValue={fields._id.initialValue as string}
          className="hidden"
          readOnly
          name={fields._id.name}
        />
      )}
      {partnerAccess && (
        <input
          defaultValue={fields.partnerAccess.initialValue}
          className="hidden"
          readOnly
          name={fields.partnerAccess.name}
        />
      )}
      <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
        <InputContainer>
          <Label name={fields.name.name}>Quest Name</Label>
          <TextInput
            name={fields.name.name}
            defaultValue={fields.name.initialValue}
            maxLength={50}
            placeholder="Acquire 2500 Gold"
          />
          <UIError messages={fields.name.errors} />
        </InputContainer>
        <InputContainer>
          <Label name={fields.category.name}>Quest Category</Label>
          <TextInput
            name={fields.category.name}
            maxLength={30}
            defaultValue={fields.category.initialValue}
            placeholder="Coinmastery"
          />
          <UIError messages={fields.category.errors} />
        </InputContainer>
        <InputContainer colspan={2}>
          <Label name={fields.indicatorColor.name}>
            Quest Category Color Marker
          </Label>
          <ColorPicker
            name={fields.indicatorColor.name}
            defaultValue={fields.indicatorColor.initialValue ?? ''}
          />
          <UIError messages={fields.indicatorColor.errors} />
        </InputContainer>
        <InputContainer colspan={2}>
          <Label name={fields.description.name}>Quest Description</Label>
          <TextArea
            name={fields.description.name}
            defaultValue={fields.description.initialValue}
            maxLength={TEXT_AREA_LENGTH}
            placeholder="Vanquish the bank and save thine gold"
          />
          <UIError messages={fields.description.errors} />
        </InputContainer>
        <InputContainer>
          <Label name={fields.startDate.name}>Quest Start Date</Label>
          <DateInput
            name={fields.startDate.name}
            defaultValue={fields.startDate.initialValue ?? today}
          />
          <UIError messages={fields.startDate.errors} />
        </InputContainer>
        <InputContainer>
          <Label name={fields.endDate.name}>Quest End Date</Label>
          <DateInput
            name={fields.endDate.name}
            defaultValue={fields.endDate.initialValue ?? monthFromNow}
          />
          <UIError messages={fields.endDate.errors} />
        </InputContainer>

        <div className="flex md:items-center flex-col gap-2 md:flex-row w-full justify-between col-span-2">
          <p className="text-orange-100">
            Add sub tasks to complete main goal?
          </p>
          <button
            {...form.insert.getButtonProps({
              name: fields.steps.name,
            })}
            className="flex items-center gap-2 text-orange-100 p-2  hover:bg-orange-500 rounded-xl transition-colors"
          >
            <PlusCircle size={16} />
            Add Task
          </button>
        </div>

        {/* Should we addd ability to toggle orderability and maybe be able to move */}
        {stepsFields.length > 0 && (
          <div className="rounded-md grid grid-cols-2 gap-4 w-full col-span-2">
            {stepsFields.map((step, index) => {
              const fieldset = step.getFieldset();
              return (
                <InputContainer key={step.key} colspan={2}>
                  <Label name={step.name}>Task {index + 1}</Label>
                  <div className="flex items-center justify-stretch w-full gap-4">
                    <TextInput
                      name={fieldset.title.name}
                      defaultValue={fieldset.title.initialValue}
                      placeholder="Retrieve the orders"
                      maxLength={TEXT_INPUT_LENGTH}
                    />
                    <input
                      defaultValue={fieldset.completed.initialValue ?? 'false'}
                      name={fieldset.completed.name}
                      readOnly
                      className="hidden"
                    />
                    {!!fieldset._id.initialValue && (
                      <input
                        defaultValue={fieldset._id.initialValue}
                        name={fieldset._id.name}
                        readOnly
                        className="hidden"
                      />
                    )}
                    <button
                      {...form.remove.getButtonProps({
                        name: fields.steps.name,
                        index,
                      })}
                      className="h-full px-4 text-white bg-orange-600 rounded-md hover:bg-orange-500 transition-colors"
                    >
                      <MinusSquareIcon size={20} />
                    </button>
                  </div>
                </InputContainer>
              );
            })}
          </div>
        )}
        {stepsFields.length > 0 && (
          <div className="flex w-full items-center justify-end col-start-2">
            <button
              {...form.insert.getButtonProps({
                name: fields.steps.name,
              })}
              className="flex items-center gap-2 text-orange-100 p-2  hover:bg-orange-500 rounded-xl transition-colors"
            >
              <PlusCircle size={16} />
              Add Task
            </button>
          </div>
        )}

        <div className="col-span-2 flex items-center justify-end border-t border-t-white/20 mt-4 pt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-orange-600 text-white rounded-xl flex items-center gap-2 hover:bg-orange-500 transition-colors"
            disabled={isPending}
          >
            {quest ? (isPending ? 'Saving' : 'Edit Quest') : ''}

            {!quest ? (isPending ? 'Creating...' : 'Create Quest') : ''}

            {isPending && <LoaderPinwheel className="animate-spin" size={16} />}
          </button>
        </div>
      </div>
    </form>
  );
};
