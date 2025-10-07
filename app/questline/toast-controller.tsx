'use client';

import { useContext, useEffect } from 'react';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { ToastContext } from './toast-context';

export default function ToastController() {
  const context = useContext(ToastContext);

  useEffect(() => {
    if (context.toast.type === 'success') {
      toast.success(context.toast.message, {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      });
      context.setToast({ message: '', type: undefined });
    }
    if (context.toast.type === 'error') {
      toast.error(context.toast.message, {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      });
      context.setToast({ message: '', type: undefined });
    }
  }, [context]);

  return (
    <ToastContainer
      position="bottom-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
    />
  );
}
