import { create } from 'zustand';

import { getIncome } from '@/lib/api';
import { MonthFilter } from '@/lib/types/month-filter';
import { Transaction } from '@/lib/types/transaction';

interface TransactionsStore {
  incomes: Transaction[];
  fetchIncomes: (monthFilter: MonthFilter | undefined) => Promise<void>;
  totalIncomes: number;
  isLoading: boolean;
  error: string | null;
}

export const useTransactionsStore = create<TransactionsStore>((set) => ({
  incomes: [],
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
  totalIncomes: 0,
  isLoading: false,
  error: null,
}));
