import { z } from 'zod';

export const CreateQuestlineClientSchema = z.object({
  _id: z.string().optional(),
  name: z.string().max(30),
  partnerAccess: z.string().email().optional(),
  access: z.array(z.string()).optional(),
});

export const QuestlineSchema = z.object({
  name: z.string().max(30),
  createdBy: z.custom(),
  partnerAccess: z.string().email().optional(),
  _id: z.custom().optional(),
  access: z.array(z.string()).optional(),
});

export const DeleteQuestlineSchema = z.object({
  _id: z.string(),
  deletePhrase: z.string().includes('delete questline'),
});

export const LeaveQuestlineSchema = z.object({
  _id: z.string(),
});

export type CreateQuestlineClientType = z.infer<
  typeof CreateQuestlineClientSchema
>;

export type Questline = z.infer<typeof QuestlineSchema>;
