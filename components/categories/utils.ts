import { Category } from '@/lib/types/category';
import { Transaction } from '@/lib/types/transaction';
import { getCategoryProgressBarColor } from '@/lib/utils';

export interface CategoryItemInfo {
  totalSpent: number;
  totalRefunds: number;
  progress: number;
  bgColor: string;
  isBudgetOverloaded: boolean;
  budgetOverloadAmount: number | null;
}

export const getCategoryItemInfo = (
  category: Category,
  transactions: Transaction[],
): CategoryItemInfo => {
  const totalSpent = transactions.reduce((acc, transaction) => {
    return acc + (transaction.type === 'EXPENSE' ? transaction.value : 0);
  }, 0);
  const totalRefunds = transactions.reduce((acc, transaction) => {
    return acc + (transaction.type === 'REFUND' ? transaction.value : 0);
  }, 0);

  let progress = 0;
  let budgetOverloadAmount = null;
  let isBudgetOverloaded = false;

  if (category.budget != null) {
    if (totalRefunds > 0) {
      isBudgetOverloaded = true;
      budgetOverloadAmount = category.budget + totalRefunds;
      progress = Math.min(Number(((totalSpent / budgetOverloadAmount) * 100).toFixed(2)), 100);
    } else {
      progress = Math.min(Number(((totalSpent / category.budget) * 100).toFixed(2)), 100);
    }
  }
  const bgColor = getCategoryProgressBarColor(progress);

  return { totalSpent, totalRefunds, progress, bgColor, isBudgetOverloaded, budgetOverloadAmount };
};

export const getTotalBudget = (categories: Category[]) => {
  return categories.reduce((acc, category) => {
    return acc + (category.budget ?? 0);
  }, 0);
};
