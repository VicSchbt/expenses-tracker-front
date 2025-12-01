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
        <main className="relative mx-auto px-4 py-8 md:px-8 md:py-12">
          <div className="mb-8 flex w-full justify-between">
            <h1 className="text-center text-4xl font-bold">Expense Tracker</h1>
            <AddTransactionDialog onExpenseCreated={handleTransactionCreated} />
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_2fr]">
            <div className="flex flex-col gap-12">
              <IncomeList refreshKey={incomeRefreshKey} />
              <BillList refreshKey={billsRefreshKey} />
              <SubscriptionList refreshKey={subscriptionsRefreshKey} />
            </div>
            <div>
              <TransactionsList refreshKey={transactionsRefreshKey} />
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
