import { getTransactions } from "@/lib/api";
import { Transaction } from "@/lib/types";
import { create } from "zustand";

interface TransactionsStore {
  transactions: Transaction[];
  getTransactions: () => void;
  // addTransaction: (Transaction: Omit<Transaction, "id">) => void;
  //   removeTransaction: (id: string) => void;
  //   updateTransaction: (id: string, Transaction: Partial<Transaction>) => void;
}

export const useTransactionsStore = create<TransactionsStore>((set) => ({
  transactions: [],
  getTransactions: async () => {
    const transactions = await getTransactions();
    set({ transactions: transactions });
  },
}));
