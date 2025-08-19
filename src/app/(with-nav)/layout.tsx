'use client';

import NavBar from '@/components/NavBar/NavBar';
import NavItems from '@/components/NavBar/navBar.config';
import { NavKey } from '@/components/NavBar/navBar.types';
import { usePathname } from 'next/navigation';

export default function WithNavLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const routeToKey: Record<string, NavKey> = {
    '/transactions': 'transactions',
    '/budgets': 'budgets',
    '/settings': 'settings',
    '/': 'home',
  };

  // Pick the first matching key
  const current =
    (Object.keys(routeToKey).find((route) => pathname.startsWith(route)) &&
      routeToKey[Object.keys(routeToKey).find((route) => pathname.startsWith(route))!]) ||
    'home';

  return (
    <div className="relative min-h-screen pb-24">
      {children}
      <NavBar items={NavItems} current={current} />
    </div>
  );
}
