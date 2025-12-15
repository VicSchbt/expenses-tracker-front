import { useEffect, useState } from 'react';

import { getCategoryTransactions } from '@/lib/api';

interface UseCategoryBudgetProgressResult {
  spentAmount: number;
  budgetConsumptionPercentage: number;
  isLoading: boolean;
  error: string | null;
}

export function useCategoryBudgetProgress(
  categoryId: string,
  budget: number | null,
): UseCategoryBudgetProgressResult {
  const [spentAmount, setSpentAmount] = useState<number>(0);
  const [budgetConsumptionPercentage, setBudgetConsumptionPercentage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (budget == null || budget <= 0) {
      setSpentAmount(0);
      setBudgetConsumptionPercentage(0);
      return;
    }

    async function fetchBudgetConsumption(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;
        const transactions = await getCategoryTransactions(categoryId, {
          year: currentYear,
          month: currentMonth,
        });
        const totalSpent = transactions.reduce<number>(
          (sum, transaction) => sum + transaction.value,
          0,
        );
        setSpentAmount(totalSpent);
        const rawPercentage = (totalSpent / budget) * 100;
        const clampedPercentage = Math.max(0, Math.min(100, rawPercentage));
        setBudgetConsumptionPercentage(clampedPercentage);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load category spending';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchBudgetConsumption();
  }, [categoryId, budget]);

  return {
    spentAmount,
    budgetConsumptionPercentage,
    isLoading,
    error,
  };
}
