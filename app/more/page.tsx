import React from 'react';
import Link from 'next/link';

import { AuthGuard } from '@/components/auth-guard';
import AppNavbar from '@/components/navigation/AppNavbar';
import { Button } from '@/components/ui/button';

const moreItems = [
  {
    label: 'Incomes',
    href: '/incomes',
  },
  {
    label: 'Expenses',
    href: '/expenses',
  },
  {
    label: 'Bills',
    href: '/bills',
  },
  {
    label: 'Subscriptions',
    href: '/subscriptions',
  },
];

const MorePage = () => {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <AppNavbar />
        <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 md:px-8">
          <nav>
            <ul className="flex flex-col gap-2">
              {moreItems.map((item) => (
                <li key={item.href}>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={item.href}>{item.label}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        </main>
      </div>
    </AuthGuard>
  );
};

export default MorePage;
