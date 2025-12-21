'use client';

import { useEffect, useState } from 'react';

import { getMonthlyBalance } from '@/lib/api';
import type { MonthFilter } from '@/lib/types/month-filter';
import type { MonthlyBalance } from '@/lib/types/monthly-balance';

interface MonthlyBalanceSummaryProps {
  monthFilter: MonthFilter;
}

export function MonthlyBalanceSummary({ monthFilter }: MonthlyBalanceSummaryProps): JSX.Element {
  const [balance, setBalance] = useState<MonthlyBalance | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBalance(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMonthlyBalance({
          year: monthFilter.year,
          month: monthFilter.month,
        });
        setBalance(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load monthly balance';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchBalance();
  }, [monthFilter.year, monthFilter.month]);

  const formattedMonthLabel = new Date(
    monthFilter.year,
    monthFilter.month - 1,
    1,
  ).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const rawNetBalance = balance?.closingBalance ?? balance?.balance ?? balance?.netBalance ?? null;

  const formattedNetBalance =
    rawNetBalance != null
      ? rawNetBalance.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
      : null;

  return (
    <section className="mb-6 w-full rounded-lg border bg-card p-4 shadow-sm">
      <header className="mb-2 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Monthly balance</h2>
          <p className="text-xs text-muted-foreground">Net result for {formattedMonthLabel}.</p>
        </div>
      </header>

      {isLoading && <p className="text-sm text-muted-foreground">Loading monthly balance...</p>}

      {error && !isLoading && <p className="text-sm text-destructive">{error}</p>}

      {!isLoading && !error && (
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-semibold">
            {formattedNetBalance != null ? `€${formattedNetBalance}` : '—'}
          </span>
          <span className="text-xs text-muted-foreground">Balance</span>
        </div>
      )}
    </section>
  );
}


