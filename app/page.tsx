'use client';

import { useState } from 'react';

import { AddTransactionDialog } from '@/components/add-transaction-dialog/index';
import { AuthGuard } from '@/components/auth-guard';
import { TransactionsList } from '@/components/transactions-list';

export default function Home() {
  const [transactionsRefreshKey, setTransactionsRefreshKey] = useState(0);

  return (
    <AuthGuard>
      <main className="relative flex min-h-screen flex-col items-center p-8 md:p-24">
        <AddTransactionDialog
          onExpenseCreated={(): void =>
            setTransactionsRefreshKey((previousRefreshKey) => previousRefreshKey + 1)
          }
        />
        <TransactionsList refreshKey={transactionsRefreshKey} />
      </main>
    </AuthGuard>
  );
}
