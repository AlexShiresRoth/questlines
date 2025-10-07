'use client';

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';

type Toast = {
  message: string;
  type: 'success' | 'error' | undefined;
};

type ToastType = {
  toast: Toast;
  setToast: Dispatch<SetStateAction<Toast>>;
};

export const ToastContext = createContext<ToastType>({
  toast: { message: '', type: undefined },
  setToast: () => undefined,
});

type Props = {
  children: ReactNode;
};

export const ToastContextProvider = ({ children }: Props) => {
  const [toast, setToast] = useState<Toast>({
    type: undefined,
    message: '',
  });

  return (
    <ToastContext.Provider value={{ toast, setToast }}>
      {children}
    </ToastContext.Provider>
  );
};
