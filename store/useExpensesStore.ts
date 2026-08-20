import { createExpense, getExpenses } from "@/lib/api";
import { Transaction } from "@/lib/types";
import { create } from "zustand";

interface ExpensesStore {
  expenses: Transaction[];
  getExpenses: () => Promise<void>;
  createExpense: (
    transaction: Omit<Transaction, "id" | "type">,
  ) => Promise<Transaction>;
  //   removeTransaction: (id: string) => void;
  //   updateTransaction: (id: string, Transaction: Partial<Transaction>) => void;
}

export const useExpenseStore = create<ExpensesStore>((set) => ({
  expenses: [],
  getExpenses: async () => {
    const transactions = await getExpenses();
    set({ expenses: transactions });
  },
  createExpense: async (transaction: Omit<Transaction, "id" | "type">) => {
    const newExpense = await createExpense(transaction);
    const transactions = await getExpenses();
    set({ expenses: transactions });
    return newExpense;
  },
}));
