'use client';

import { useEffect, useState } from 'react';

import { AddTransactionDialog } from '@/components/add-transaction-dialog/index';
import { AuthGuard } from '@/components/auth-guard';
import { BillList } from '@/components/bill-list';
import MonthTabs from '@/components/common/MonthPicker';
import { MonthlyBalanceSummary } from '@/components/monthly-balance-summary';
import AppNavbar from '@/components/navigation/AppNavbar';
import RecentTransactions from '@/components/transactions/recent/RecentTransactions';
import { getAvailableMonths } from '@/lib/api';
import type { MonthFilter } from '@/lib/types/month-filter';
import { useUserStore } from '@/store/use-user-store';

export default function Home() {
  const [transactionsRefreshKey, setTransactionsRefreshKey] = useState(0);
  const [incomeRefreshKey, setIncomeRefreshKey] = useState(0);
  const [billsRefreshKey, setBillsRefreshKey] = useState(0);
  const [subscriptionsRefreshKey, setSubscriptionsRefreshKey] = useState(0);
  const [savingsRefreshKey, setSavingsRefreshKey] = useState(0);
  const [monthFilter, setMonthFilter] = useState<MonthFilter>(() => {
    const currentDate = new Date();
    return {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
    };
  });
  const isAvailableMonthsInitialized = useUserStore((state) => state.isAvailableMonthsInitialized);
  const setAvailableMonths = useUserStore((state) => state.setAvailableMonths);
  const setIsAvailableMonthsInitialized = useUserStore(
    (state) => state.setIsAvailableMonthsInitialized,
  );

  useEffect(() => {
    if (isAvailableMonthsInitialized) {
      return;
    }
    const executeFetchAvailableMonths = async () => {
      try {
        const months = await getAvailableMonths();
        setAvailableMonths(months);
        setIsAvailableMonthsInitialized(true);
      } catch {
        // Intentionally ignore error here, auth guard will handle auth issues.
      }
    };
    void executeFetchAvailableMonths();
  }, [isAvailableMonthsInitialized, setAvailableMonths, setIsAvailableMonthsInitialized]);

  const handleTransactionCreated = (): void => {
    setTransactionsRefreshKey((previousRefreshKey) => previousRefreshKey + 1);
    setIncomeRefreshKey((previousRefreshKey) => previousRefreshKey + 1);
    setBillsRefreshKey((previousRefreshKey) => previousRefreshKey + 1);
    setSubscriptionsRefreshKey((previousRefreshKey) => previousRefreshKey + 1);
    setSavingsRefreshKey((previousRefreshKey) => previousRefreshKey + 1);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <AppNavbar />
        <main className="relative mx-auto px-4 py-8 md:px-8 md:py-12">
          <div className="mb-8 flex w-full justify-between">
            <h1 className="text-center text-4xl font-bold">Expense Tracker</h1>
            <AddTransactionDialog onExpenseCreated={handleTransactionCreated} />
          </div>
          {/* <MonthTabs monthFilter={monthFilter} onMonthFilterChange={setMonthFilter} /> */}
          <MonthlyBalanceSummary monthFilter={monthFilter} />
          <RecentTransactions />
          {/* <DailyTransactionsChart monthFilter={monthFilter} refreshKey={transactionsRefreshKey} />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_2fr]">
            <div className="flex flex-col gap-12">
              <IncomeList
                refreshKey={incomeRefreshKey}
                monthFilter={monthFilter}
                onTransactionCreated={handleTransactionCreated}
              />
              <SavingsList
                refreshKey={savingsRefreshKey}
                monthFilter={monthFilter}
                onTransactionCreated={handleTransactionCreated}
              />
              <BillList
                refreshKey={billsRefreshKey}
                monthFilter={monthFilter}
                onTransactionCreated={handleTransactionCreated}
              />
              <SubscriptionList
                refreshKey={subscriptionsRefreshKey}
                monthFilter={monthFilter}
                onTransactionCreated={handleTransactionCreated}
              />
            </div>
            <div>
              <TransactionsList
                refreshKey={transactionsRefreshKey}
                monthFilter={monthFilter}
                onTransactionCreated={handleTransactionCreated}
              />
            </div>
          </div> */}
        </main>
      </div>
    </AuthGuard>
  );
}
