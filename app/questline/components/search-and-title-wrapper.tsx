import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const SearchAndTitleWrapper = ({ children }: Props) => {
  return (
    <div className="rounded flex flex-col gap-4 md:flex-row md:items-end md:gap-2 md:w-full justify-between">
      {children}
    </div>
  );
};
