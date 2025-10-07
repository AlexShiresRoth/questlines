"use server";

import webpush from "web-push";
import { auth } from "../auth";
import { DB_NAME, SUBSCRIPTION_COLLECTION } from "../constants";
import client from "../mongo-client";
import { Subscription } from "../schemas";

webpush.setVapidDetails(
  "mailto:alexroth96@gmail.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string,
  process.env.VAPID_PRIVATE_KEY as string
);

type PushWithKeys = PushSubscription & {
  keys: { p256dh: string; auth: string };
};

let subscription: PushWithKeys | null = null;

export async function subscribeUser(sub: PushWithKeys) {
  try {
    subscription = sub;
    const session = await auth();

    if (!session || !session.user?.id) {
      throw new Error("Not authorized");
    }

    const db = client.db(DB_NAME);
    const collection = db.collection<Subscription>(SUBSCRIPTION_COLLECTION);

    const foundSub = await collection.findOne({
      subscribedUser: session.user.id,
    });

    // if a subscription already exists just short out
    if (foundSub) {
      return { success: true };
    }

    const newSub = await collection.insertOne({
      subscribedUser: session.user?.id as string,
      endpoint: subscription.endpoint,
      expirationTime: subscription.expirationTime,
      keys: subscription.keys,
    });

    if (!newSub) {
      throw new Error("Could not subscribe to push notifications");
    }
    return { success: true };
  } catch (error) {
    console.error("Error in push notification sub", error);
    return { success: false };
  }
}

// TODO this should also occur when a user deletes their account
export async function unsubscribeUser() {
  subscription = null;
  const session = await auth();

  if (!session || !session.user?.id) {
    throw new Error("Not authorized");
  }

  const db = client.db(DB_NAME);
  const collection = db.collection<Subscription>(SUBSCRIPTION_COLLECTION);

  await collection.findOneAndDelete({
    subscribedUser: session.user.id,
  });

  console.log("deleting push notification subscription");

  return { success: true };
}

export async function sendNotification(message: string, title: string) {
  if (!subscription) {
    throw new Error("No subscription available");
  }
  console.log("message", message);
  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title,
        body: message,
        icon: "/icon.png",
      })
    );
    return { success: true };
  } catch (error) {
    console.error("Error sending push notification:", error);
    return { success: false, error: "Failed to send notification" };
  }
}
