import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default async function PageWrapper({ children }: Props) {
  return (
    <div className="flex flex-col md:grid grid-cols-[1fr_3fr_1fr] w-full py-8 gap-8 min-h-screen">
      {children}
    </div>
  );
}
