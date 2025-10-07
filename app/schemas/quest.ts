import { z } from 'zod';
import { TEXT_AREA_LENGTH, TEXT_INPUT_LENGTH } from '../constants';

// TODO create variables for max nums
const CreateQuestStepSchema = z.object({
  title: z.string().max(TEXT_INPUT_LENGTH),
  completed: z.enum(['true', 'false']),
});

const QuestResponseStepSchema = z.object({
  title: z.string(),
  completed: z.boolean().or(z.enum(['true', 'false'])),
  _id: z.string().optional(),
});

export enum QuestType {
  Main = 'main',
  Secondary = 'secondary',
  Completed = 'completed',
}

const QuestTypeEnum = z.nativeEnum(QuestType);

const BaseQuestClientValidation = z.object({
  _id: z.string().optional(),
  name: z.string().max(TEXT_INPUT_LENGTH),
  category: z.string().max(30),
  startDate: z.date(),
  endDate: z.date().nullable(),
  description: z.string().max(TEXT_AREA_LENGTH).optional(),
  questType: QuestTypeEnum,
  questLine: z.string(),
  partnerAccess: z.string().optional(),
  access: z.array(z.string()).optional(),
  indicatorColor: z.string(),
});

export const ClientValidationQuestSchema = BaseQuestClientValidation.and(
  z.object({
    steps: z.array(CreateQuestStepSchema),
  })
);

export const ClientValidationEditQuestSchema = BaseQuestClientValidation.and(
  z.object({
    steps: z.array(QuestResponseStepSchema),
  })
);

export const CompleteQuestSchema = z.object({
  _id: z.string(),
});

export const QuestSchema = z.object({
  questLine: z.string(),
  name: z.string().max(TEXT_INPUT_LENGTH),
  category: z.string().max(30),
  startDate: z.date(),
  endDate: z.date().nullable(),
  description: z.string().max(TEXT_AREA_LENGTH).optional(),
  createdBy: z.string().uuid(),
  completed: z.boolean(),
  questType: QuestTypeEnum,
  completionDate: z.date().optional(),
  partnerAccess: z.string().optional(),
  access: z.array(z.string()).optional(),
  indicatorColor: z.string(),
});

export const QuestResponseSchema = QuestSchema.and(
  z.object({
    _id: z.custom(),
    steps: z.array(QuestResponseStepSchema),
  })
);

export const CreateQuestSchema = QuestSchema.and(
  z.object({
    steps: z.array(CreateQuestStepSchema),
  })
);

export type Quest = z.infer<typeof QuestResponseSchema>;
export type CreateQuest = z.infer<typeof CreateQuestSchema>;
export type Step = z.infer<typeof QuestResponseStepSchema>;
