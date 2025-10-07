'use client';

import { createContext, ReactNode, useState } from 'react';

export type NavigationContext = {
  showSidebar: boolean;
  toggleSidebar: (val: boolean) => void;
};

export const NavgiationContext = createContext<NavigationContext>({
  showSidebar: false,
  toggleSidebar: (_val: boolean) => null,
});

type Props = {
  children: ReactNode;
};

export default function NavigationContextProvider({ children }: Props) {
  const [showSidebar, toggleSidebar] = useState<boolean>(false);

  return (
    <NavgiationContext.Provider value={{ showSidebar, toggleSidebar }}>
      {children}
    </NavgiationContext.Provider>
  );
}
