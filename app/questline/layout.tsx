import { ReactNode } from 'react';
import PushNotificationManager from '../native-features/push-notification-manager';
import { ToastContextProvider } from './toast-context';
import ToastController from './toast-controller';
export default async function Layout({
  children,
  addquest,
}: {
  children: ReactNode;
  addquest: ReactNode;
}) {
  return (
    <ToastContextProvider>
      <main className="w-full">{children}</main>
      {addquest}
      <PushNotificationManager isBannerType />
      <ToastController />
    </ToastContextProvider>
  );
}
