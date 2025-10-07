import InstallPrompt from "@/app/native-features/install-app";
import PushNotificationManager from "@/app/native-features/push-notification-manager";

import { auth } from "@/app/auth";
import Image from "next/image";
import { FadedContainer } from "../components/faded-container";
import PageWrapper from "../components/page-wrapper";
import Sidebar from "../components/side-bar";
import { DeleteAccount } from "./delete-account";

export default async function Page() {
  const session = await auth();

  return (
    <PageWrapper>
      <Sidebar />
      <div className="flex flex-col px-4 gap-8 md:pt-0">
        <FadedContainer bordered={false}>
          <div className="rounded-xl p-4 md:p-8 gap-8 flex flex-col">
            <div className="border-b border-white/20 w-full flex flex-col gap-2 pb-4">
              <h1 className="text-4xl font-bold text-orange-50">
                Account Settings
              </h1>
              <p className="text-sm text-orange-100">
                Accounts are currently managed via 3rd party providers, ie:
                Google, Facebook.
              </p>
            </div>
            <div className="flex md:items-center flex-col md:flex-row gap-4 md:gap-10 border-b border-b-white/20 pb-4">
              {session?.user?.image && (
                <div>
                  <Image
                    src={session?.user?.image}
                    alt="avatar"
                    width={60}
                    height={60}
                    className="rounded-full border border-orange-200"
                    unoptimized
                  />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-orange-500">
                  Email
                </span>
                <p className="text-xl font-semibold text-orange-100">
                  {session?.user?.email}
                </p>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-orange-500">
                  Name
                </span>
                <p className="text-xl font-semibold text-orange-100">
                  {session?.user?.name}
                </p>
              </div>
            </div>
            <PushNotificationManager isBannerType={false} />
            <InstallPrompt />
            <DeleteAccount />
          </div>
        </FadedContainer>
      </div>
    </PageWrapper>
  );
}
