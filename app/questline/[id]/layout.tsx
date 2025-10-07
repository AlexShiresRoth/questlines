import { auth } from "@/app/auth";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import PageWrapper from "../components/page-wrapper";
import Sidebar from "../components/side-bar";

type Props = {
  children: ReactNode;
  params: Promise<{ id: string }>;
};

export default async function QuestlineLayout({ children, params }: Props) {
  const session = await auth();

  if (!session) {
    notFound();
  }
  const { id } = await params;
  return (
    <PageWrapper>
      <Sidebar pageId={id} />
      {children}
    </PageWrapper>
  );
}
