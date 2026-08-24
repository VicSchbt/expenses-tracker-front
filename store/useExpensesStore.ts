import { createExpense, getExpenses } from "@/lib/api";
import { Transaction } from "@/lib/types";
import { create } from "zustand";

interface ExpensesStore {
  expenses: Transaction[];
  error: string | null;
  isLoading: boolean;
  getExpenses: () => Promise<void>;
  createExpense: (
    transaction: Omit<Transaction, "id" | "type">,
  ) => Promise<Transaction | null>;
  //   removeTransaction: (id: string) => void;
  //   updateTransaction: (id: string, Transaction: Partial<Transaction>) => void;
}

export const useExpenseStore = create<ExpensesStore>((set) => ({
  expenses: [],
  error: null,
  isLoading: false,
  getExpenses: async () => {
    set({ isLoading: true, error: null });
    try {
      const transactions = await getExpenses();
      set({ expenses: transactions });
      console.log(transactions);
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to load expenses",
      });
    } finally {
      set({ isLoading: false });
    }
  },
  createExpense: async (transaction: Omit<Transaction, "id" | "type">) => {
    set({ error: null });
    try {
      const newExpense = await createExpense(transaction);
      set((state) => ({ expenses: [...state.expenses, newExpense] }));
      return newExpense;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to create expense",
      });
      return null;
    }
  },
}));
