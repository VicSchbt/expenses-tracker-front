import { createTransaction, getTransactions } from "@/lib/api";
import { Transaction } from "@/lib/types";
import { create } from "zustand";

interface TransactionsStore {
  transactions: Transaction[];
  getTransactions: () => void;
  createTransaction: (transaction: Omit<Transaction, "id">) => void;
  //   removeTransaction: (id: string) => void;
  //   updateTransaction: (id: string, Transaction: Partial<Transaction>) => void;
}

export const useTransactionsStore = create<TransactionsStore>((set) => ({
  transactions: [],
  getTransactions: async () => {
    const transactions = await getTransactions();
    set({ transactions });
  },
  createTransaction: async (transaction: Omit<Transaction, "id">) => {
    await createTransaction(transaction);
    getTransactions();
  },
}));
