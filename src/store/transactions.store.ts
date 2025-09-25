import { TransactionDTO, getTransactions } from '@/features/expenses/api';
import { Bill, Expense, Income, Savings, Transaction } from '@/types';
import { create } from 'zustand';

type TransactionsState = {
  transactions: Transaction[];
  expenses: Expense[];
  incomes: Income[];
  bills: Bill[];
  savings: Savings[];
  isLoading: boolean;
  error?: string;

  fetchAll: (opts?: { token?: string }) => Promise<void>;
  total: () => number;
};

const BASE = process.env.NEXT_PUBLIC_API_URL;

export const useTransactionsStore = create<TransactionsState>((set, get) => ({
  transactions: [],
  expenses: [],
  incomes: [],
  bills: [],
  savings: [],
  isLoading: false,
  error: undefined,

  fetchAll: async () => {
    set({ isLoading: true, error: undefined });

    try {
      const transactions = await getTransactions();

      // If you keep a flat "transactions" list, you can merge later.
      set({
        transactions,
        // For now, leave others empty:
        expenses: [],
        incomes: [],
        bills: [],
        savings: [],
        isLoading: false,
      });
    } catch (e: any) {
      set({ isLoading: false, error: e?.message ?? 'Unknown error' });
    }
  },

  total: () => get().expenses.reduce((sum, e) => sum + e.value, 0),
}));
