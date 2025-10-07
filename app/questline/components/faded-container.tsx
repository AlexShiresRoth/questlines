import clsx from 'clsx';
import { ReactNode } from 'react';

export const FadedContainer = ({
  children,
  bordered = true,
}: {
  children: ReactNode;
  bordered?: boolean;
}) => {
  return (
    <div
      className={clsx('bg-white/20 rounded-xl', {
        'border-2 border-white/30': bordered,
      })}
    >
      {children}
    </div>
  );
};
