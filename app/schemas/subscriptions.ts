import { z } from 'zod';

export const SubscriptionSchema = z.object({
  subscribedUser: z.string(),
  endpoint: z.string(),
  expirationTime: z.number().nullable(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});

export type Subscription = z.infer<typeof SubscriptionSchema>;
