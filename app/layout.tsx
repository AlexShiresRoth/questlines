import clsx from "clsx";
import { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./global.css";
import RegisterServiceWorker from "./native-features/register-service-worker";
import { ServiceWorkerContextProvider } from "./native-features/service-worker-context";

export const metadata: Metadata = {
  title: "Welcome to Questlines",
  description: "A cozy and collaborative goal planning app",
};

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={clsx([
          "min-h-screen bg-gradient-to-t from-red-500 via-orange-400 to-yellow-300",
          "dark:from-emerald-950 dark:via-emerald-950 dark:to-emerald-950",
          manrope.className,
        ])}
      >
        <ServiceWorkerContextProvider>
          {children}
          <RegisterServiceWorker />
        </ServiceWorkerContextProvider>
      </body>
    </html>
  );
}
