'use client';

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';

type ServiceWorkerContextType = {
  subscription: PushSubscription | null;
  setSubscription: Dispatch<SetStateAction<PushSubscription | null>>;
  isSupported: boolean;
  setIsSupported: Dispatch<SetStateAction<boolean>>;
};

export const ServiceWorkerContext = createContext<ServiceWorkerContextType>({
  subscription: null,
  setSubscription: () => null,
  isSupported: false,
  setIsSupported: () => false,
});

type Props = {
  children: ReactNode;
};

export const ServiceWorkerContextProvider = ({ children }: Props) => {
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [isSupported, setIsSupported] = useState(false);

  return (
    <ServiceWorkerContext.Provider
      value={{ setSubscription, subscription, setIsSupported, isSupported }}
    >
      {children}
    </ServiceWorkerContext.Provider>
  );
};
