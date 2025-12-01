'use client';

import { useState } from 'react';

import { AddTransactionDialog } from '@/components/add-transaction-dialog/index';
import { AppNavbar } from '@/components/app-navbar';
import { AuthGuard } from '@/components/auth-guard';
import { BillList } from '@/components/bill-list';
import { IncomeList } from '@/components/income-list';
import { SubscriptionList } from '@/components/subscription-list';
import { TransactionsList } from '@/components/transactions-list';

export default function Home() {
  const [transactionsRefreshKey, setTransactionsRefreshKey] = useState(0);
  const [incomeRefreshKey, setIncomeRefreshKey] = useState(0);
  const [billsRefreshKey, setBillsRefreshKey] = useState(0);
  const [subscriptionsRefreshKey, setSubscriptionsRefreshKey] = useState(0);

  const handleTransactionCreated = (): void => {
    setTransactionsRefreshKey((previousRefreshKey) => previousRefreshKey + 1);
    setIncomeRefreshKey((previousRefreshKey) => previousRefreshKey + 1);
    setBillsRefreshKey((previousRefreshKey) => previousRefreshKey + 1);
    setSubscriptionsRefreshKey((previousRefreshKey) => previousRefreshKey + 1);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <main className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-8 md:px-8 md:py-12">
          <div className="flex w-full justify-between">
            <h1 className="mb-8 text-center text-4xl font-bold">Expense Tracker</h1>
            <AddTransactionDialog onExpenseCreated={handleTransactionCreated} />
          </div>
          <TransactionsList refreshKey={transactionsRefreshKey} />
          <div className="mt-12">
            <IncomeList refreshKey={incomeRefreshKey} />
          </div>
          <div className="mt-12">
            <BillList refreshKey={billsRefreshKey} />
          </div>
          <div className="mt-12">
            <SubscriptionList refreshKey={subscriptionsRefreshKey} />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
