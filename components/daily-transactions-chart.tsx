/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  getBills,
  getExpensesAndRefunds,
  getIncome,
  getSavings,
  getSubscriptions,
} from '@/lib/api';
import type { MonthFilter } from '@/lib/types/month-filter';
import type { PaginatedTransactions, Transaction } from '@/lib/types/transaction';

interface DailyTransactionsChartProps {
  monthFilter: MonthFilter;
  refreshKey: number;
}

interface DailyChartPoint {
  day: number;
  amount: number;
}

const PAGE_LIMIT = 100;

type MonthlyTransactionsFetcherParams = {
  page?: number;
  limit?: number;
  year?: number;
  month?: number;
};

type MonthlyTransactionsFetcher = (
  params?: MonthlyTransactionsFetcherParams,
) => Promise<PaginatedTransactions>;

async function fetchAllMonthlyTransactions(
  fetcher: MonthlyTransactionsFetcher,
  monthFilter: MonthFilter,
): Promise<Transaction[]> {
  let currentPage = 1;
  let hasNextPage = true;
  const allTransactions: Transaction[] = [];
  // eslint-disable-next-line no-loops/no-loops
  while (hasNextPage) {
    const result: PaginatedTransactions = await fetcher({
      page: currentPage,
      limit: PAGE_LIMIT,
      year: monthFilter.year,
      month: monthFilter.month,
    });
    allTransactions.push(...result.data);
    hasNextPage = result.hasNextPage;
    currentPage += 1;
  }
  return allTransactions;
}

export function DailyTransactionsChart({ monthFilter, refreshKey }: DailyTransactionsChartProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function executeFetchTransactions() {
      try {
        setIsLoading(true);
        setError(null);
        const [expensesAndRefunds, income, savings, bills, subscriptions] = await Promise.all([
          fetchAllMonthlyTransactions(getExpensesAndRefunds, monthFilter),
          fetchAllMonthlyTransactions(getIncome, monthFilter),
          fetchAllMonthlyTransactions(getSavings, monthFilter),
          fetchAllMonthlyTransactions(getBills, monthFilter),
          fetchAllMonthlyTransactions(getSubscriptions, monthFilter),
        ]);
        setTransactions([...expensesAndRefunds, ...income, ...savings, ...bills, ...subscriptions]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load daily transactions data';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
    void executeFetchTransactions();
  }, [monthFilter.year, monthFilter.month, refreshKey]);

  const chartData = useMemo<DailyChartPoint[]>(() => {
    const daysInMonth = new Date(monthFilter.year, monthFilter.month, 0).getDate();
    const dailyTotals: number[] = Array.from({ length: daysInMonth }, () => 0);
    transactions.forEach((transaction) => {
      let sign = 0;
      if (transaction.type === 'INCOME' || transaction.type === 'REFUND') {
        sign = 1;
      }
      if (
        transaction.type === 'SAVINGS' ||
        transaction.type === 'BILL' ||
        transaction.type === 'SUBSCRIPTION' ||
        transaction.type === 'EXPENSE'
      ) {
        sign = -1;
      }
      if (sign === 0) {
        return;
      }
      const transactionDate = new Date(transaction.date);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth() + 1;
      if (transactionYear !== monthFilter.year || transactionMonth !== monthFilter.month) {
        return;
      }
      const transactionDay = transactionDate.getDate();
      const dayIndex = transactionDay - 1;
      if (!dailyTotals[dayIndex] && dailyTotals[dayIndex] !== 0) {
        return;
      }
      dailyTotals[dayIndex] += sign * transaction.value;
    });
    let runningTotal = 0;
    const cumulativeData: DailyChartPoint[] = dailyTotals.map((dayAmount, index) => {
      runningTotal += dayAmount;
      return {
        day: index + 1,
        amount: runningTotal,
      };
    });
    return cumulativeData;
  }, [transactions, monthFilter.year, monthFilter.month]);

  return (
    <section className="mb-8 w-full rounded-lg border bg-card p-4 shadow-sm">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Daily net cash flow</h2>
          <p className="text-sm text-muted-foreground">
            Income minus savings, bills, subscriptions, expenses, plus refunds for each day.
          </p>
        </div>
      </header>

      {isLoading && (
        <div className="py-8 text-center text-muted-foreground">
          Loading daily transactions chart...
        </div>
      )}

      {error && !isLoading && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-center text-destructive">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="h-72 w-full">
          {chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center rounded-md border text-muted-foreground">
              No transactions found for the selected month.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Day of month', position: 'insideBottomRight', offset: -8 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  width={72}
                  tickFormatter={(value: number) => `${value.toFixed(0)}`}
                />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(2)}`, 'Amount']}
                  labelFormatter={(label) => `Day ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#0f172a"
                  fill="#0f172a"
                  fillOpacity={0.15}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      )}
    </section>
  );
}
