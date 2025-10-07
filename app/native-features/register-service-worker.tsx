'use client';

import { useCallback, useContext, useEffect } from 'react';
import { ServiceWorkerContext } from './service-worker-context';

export default function RegisterServiceWorker() {
  const { setSubscription, setIsSupported } = useContext(ServiceWorkerContext);

  const registerServiceWorker = useCallback(async () => {
    {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    }
  }, [setSubscription]);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, [registerServiceWorker, setIsSupported]);

  return <></>;
}
