import { z } from 'zod';

export const DeleteAccountSchema = z.object({
  phrase: z.string().superRefine((data, ctx) => {
    if (data !== 'Delete My Account') {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please enter "Delete My Account" to confirm.',
      });
    }
  }),
});

export type DeleteAccountType = z.infer<typeof DeleteAccountSchema>;

export const AccountSchema = z.object({
  _id: z.custom(),
  access_token: z.string(),
  scope: z.string(),
  token_type: z.string(),
  providerAccountId: z.string(),
  provider: z.string(),
  type: z.string(),
  userId: z.custom(),
});

export type Account = z.infer<typeof AccountSchema>;

export const UserSchema = z.object({
  _id: z.custom(),
  email: z.string(),
  image: z.string().optional(),
  name: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const SessionSchema = z.object({
  _id: z.custom(),
  sessionToken: z.string(),
  userId: z.custom(),
  expires: z.date(),
});

export type Session = z.infer<typeof SessionSchema>;
