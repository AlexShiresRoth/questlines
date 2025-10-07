'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useContext } from 'react';
import { NavgiationContext } from '../navigation-context';

export default function MobileNav() {
  const { toggleSidebar, showSidebar } = useContext(NavgiationContext);

  return (
    <nav className="flex px-4 items-center w-full justify-between md:hidden">
      <button onClick={() => toggleSidebar(!showSidebar)}>
        <Menu size={24} className="text-orange-50" />
      </button>
      <Link href="/questline" className="text-lg font-semibold text-orange-50">
        Sidequest
      </Link>
    </nav>
  );
}
