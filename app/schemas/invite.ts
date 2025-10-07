import { z } from 'zod';

export const InviteSchema = z.object({
  _id: z.custom(),
  invitee: z.string().email(),
  createdBy: z.custom(),
  accepted: z.boolean(),
  pending: z.boolean(),
  questlineId: z.custom(),
  sendDate: z.date(),
});

export type QuestlineInvite = z.infer<typeof InviteSchema>;

export const AcceptOrDeclineInviteSchema = z.object({
  _id: z.custom(),
});

export type AcceptOrDeclineInvite = z.infer<typeof AcceptOrDeclineInviteSchema>;
