import { create } from 'zustand';

import { getIncome, getRecentTransactions } from '@/lib/api';
import { MonthFilter } from '@/lib/types/month-filter';
import { Transaction } from '@/lib/types/transaction';

interface TransactionsStore {
  incomes: Transaction[];
  recentTransactions: Transaction[];
  fetchIncomes: (monthFilter: MonthFilter | undefined) => Promise<void>;
  fetchRecentTransactions: () => Promise<void>;
  totalIncomes: number;
  isLoading: boolean;
  error: string | null;
}

export const useTransactionsStore = create<TransactionsStore>((set, get) => ({
  incomes: [],
  recentTransactions: [],
  fetchIncomes: async (monthFilter: MonthFilter | undefined) => {
    const incomes = await getIncome({
      page: 1,
      limit: 100,
      year: monthFilter?.year,
      month: monthFilter?.month,
    });
    set({ incomes: incomes.data });
    set({ totalIncomes: incomes.data.reduce((acc, income) => acc + income.value, 0) });
  },
  fetchRecentTransactions: async () => {
    try {
      set({ isLoading: true });
      const recentTransactionsResp = await getRecentTransactions();
      set({ recentTransactions: recentTransactionsResp.data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },
  totalIncomes: 0,
  isLoading: false,
  error: null,
}));
