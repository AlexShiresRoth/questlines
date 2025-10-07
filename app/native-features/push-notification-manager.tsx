'use client';

import clsx from 'clsx';
import { X } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { sendNotification, subscribeUser, unsubscribeUser } from './actions';
import { ServiceWorkerContext } from './service-worker-context';
import { urlBase64ToUint8Array } from './web-push';

// TODO we should also add notifications settings into account settings page

type Props = {
  isBannerType: boolean;
};

export default function PushNotificationManager({
  isBannerType = true,
}: Props) {
  const { setSubscription, subscription, isSupported } =
    useContext(ServiceWorkerContext);

  const [showBanner, toggleBanner] = useState(true);

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;

    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string
      ),
    });

    setSubscription(sub);
    const serializedSub = JSON.parse(JSON.stringify(sub));
    await subscribeUser(serializedSub);
    await sendTestNotification(
      'Thanks for signing up to Questlines!',
      'Questlines Signup'
    );
    toggleBanner(false);
    handleBannerInStorage(false);
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    await unsubscribeUser();
    toggleBanner(true);
    handleBannerInStorage(true);
  }

  async function sendTestNotification(message: string, title: string) {
    if (subscription) {
      await sendNotification(message, title);
    }
  }

  function handleBannerInStorage(value: boolean) {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('notifications-banner', `${value}`);
    }
  }

  // handle whether or not to show notifications banner on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      toggleBanner(
        localStorage.getItem('notifications-banner') === 'false' ? false : true
      );
    }
  }, []);

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>;
  }

  if (!showBanner && isBannerType) {
    return <></>;
  }

  return (
    <div
      className={clsx('w-full flex justify-center items-center p-3', {
        'fixed top-0 left-0 dark:bg-black z-50': isBannerType,
        'dark:bg-white/20 rounded-md px-0': !isBannerType,
      })}
    >
      <div className="flex justify-between items-center w-full px-4 gap-10">
        {subscription ? (
          <div className="flex items-center gap-4">
            <p className="text-orange-50">
              You are subscribed to push notifications.
            </p>
            <button
              onClick={unsubscribeFromPush}
              className="text-orange-50 underline text-sm"
            >
              Unsubscribe
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <p className="text-orange-50">
              Would it be alright if we send you push notifications?
            </p>
            <button
              onClick={subscribeToPush}
              className="text-orange-50 underline text-sm"
            >
              Subscribe
            </button>
          </div>
        )}
        {isBannerType && (
          <button
            className="text-orange-50 p-1 rounded-md bg-white/20"
            onClick={() => {
              toggleBanner(false);
              handleBannerInStorage(false);
            }}
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
