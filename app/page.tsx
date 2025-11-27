'use client';

import { useState } from 'react';

import { AddTransactionDialog } from '@/components/add-transaction-dialog/index';
import { AppNavbar } from '@/components/app-navbar';
import { AuthGuard } from '@/components/auth-guard';
import { TransactionsList } from '@/components/transactions-list';

export default function Home() {
  const [transactionsRefreshKey, setTransactionsRefreshKey] = useState(0);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <main className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-8 md:px-8 md:py-12">
          <AddTransactionDialog
            onExpenseCreated={(): void =>
              setTransactionsRefreshKey((previousRefreshKey) => previousRefreshKey + 1)
            }
          />
          <TransactionsList refreshKey={transactionsRefreshKey} />
        </main>
      </div>
    </AuthGuard>
  );
}
