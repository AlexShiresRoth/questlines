"use client";
import clsx from "clsx";
import { Inbox, Plus, Settings, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useContext } from "react";
import { NavgiationContext } from "../navigation-context";
import { SignoutButton } from "./sign-out-button";

type Props = {
  userImage: string;
  userName: string;
  children: ReactNode;
  pendingInvites: number;
};

export default function SidebarContent({
  userImage,
  userName,
  children,
  pendingInvites,
}: Props) {
  const { showSidebar, toggleSidebar } = useContext(NavgiationContext);

  return (
    <>
      <div id="bolster" className="hidden md:block md:min-w-[350px]"></div>

      <div
        className={clsx(
          "transition-transform fixed z-10 left-0 top-0 min-w-full md:min-w-[350px]",
          {
            "translate-x-0": showSidebar,
            "-translate-x-full md:translate-x-0": !showSidebar,
          }
        )}
      >
        <div className="w-full border-r border-orange-300/10 h-screen bg-orange-400 dark:bg-emerald-950 md:bg-transparent flex flex-col items-center justify-between py-8">
          <div className="w-full md:w-11/12 flex flex-col h-full justify-between gap-8 px-4">
            <div className="flex flex-col gap-8">
              <div className="w-full flex items-center justify-between">
                <button
                  onClick={() => toggleSidebar(false)}
                  className="md:hidden"
                >
                  <X className="text-orange-50" />
                </button>
                <Link href="/questline">
                  <h1 className="font-bold text-lg text-orange-100">
                    Questlines
                  </h1>
                </Link>
              </div>
              <div
                data-testid="account-info"
                className="flex items-center gap-2 p-4 rounded-xl bg-white/20"
              >
                {userImage && (
                  <div>
                    <Image
                      src={userImage}
                      alt="avatar"
                      height={40}
                      width={40}
                      className="rounded-full"
                      unoptimized
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  <h4 className="font-semibold text-orange-50">{userName}</h4>
                  <Link
                    href="/questline/account-settings"
                    className="text-sm text-orange-100 flex items-center gap-1 hover:text-orange-200 transition-colors"
                  >
                    <Settings size={14} />
                    Account Settings
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <p className="font-semibold uppercase text-sm text-orange-50">
                  General
                </p>
                <div className="pl-4 text-sm gap-4 flex flex-col">
                  <Link
                    href="/questline/invites/received"
                    className="flex items-center gap-2 text-orange-100 hover:text-orange-200"
                  >
                    <Inbox size={14} />
                    Invites
                    <span className="flex items-center justify-center w-4 h-4 bg-orange-50 text-orange-500 text-xs rounded-full">
                      {pendingInvites || 0}
                    </span>
                  </Link>
                  <Link
                    href="/questline/new-line"
                    className="flex items-center gap-2 text-orange-100 hover:text-orange-200"
                  >
                    <Plus size={14} /> New Questline
                  </Link>
                </div>
              </div>

              {children}
            </div>
            <div className="w-full p-4">
              <SignoutButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
