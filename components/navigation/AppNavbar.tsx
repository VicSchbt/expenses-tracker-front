'use client';

import { HomeIcon, LogOut, MoreHorizontal, PieChart, PiggyBank, Settings } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { useAuthStore } from '@/store/useAuthStore';

import { Button } from '../ui/button';

const navigationItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: HomeIcon,
  },
  {
    label: 'Categories',
    href: '/categories',
    icon: PieChart,
  },
  {
    label: 'Savings',
    href: '/savings',
    icon: PiggyBank,
  },
  {
    label: 'More',
    href: '/more',
    icon: MoreHorizontal,
  },
];

const AppNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogoutClick = (): void => {
    logout();
    router.push('/login');
  };

  const isCurrentPath = (path: string): boolean => {
    return pathname === path;
  };
  return (
    <>
      {/* Desktop Navigation - Top Bar */}
      <header className="hidden border-b bg-background/80 backdrop-blur md:block">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md text-sm font-bold text-primary-foreground">
              💰
            </span>
            <Link href="/" className="text-sm font-semibold">
              Expense Tracker
            </Link>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-1.5 ${
                  isCurrentPath(item.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Button variant="outline" size="icon" type="button" asChild>
              <Link href="/settings">
                <Settings className="size-5" />
              </Link>
            </Button>
            <Button variant="outline" size="icon" type="button" onClick={handleLogoutClick}>
              <LogOut className="size-5" />
            </Button>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation - Top Bar (App Title and Logout) */}
      <header className="border-b bg-background/80 backdrop-blur md:hidden">
        <nav className="flex items-center justify-between px-4 py-3">
          <div className="text-sm font-medium">Hi User!</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" type="button" asChild>
              <Link href="/settings">
                <Settings className="size-5" />
              </Link>
            </Button>
            <Button variant="outline" size="icon" type="button" onClick={handleLogoutClick}>
              <LogOut className="size-5" />
            </Button>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation - Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-4 px-2 py-3">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`col-center gap-1 rounded-lg px-4 py-2 ${
                isCurrentPath(item.href) ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="size-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default AppNavbar;
