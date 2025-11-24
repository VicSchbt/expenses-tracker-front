import { create } from 'zustand';

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

interface ExpenseStore {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  removeExpense: (id: string) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
}

export const useExpenseStore = create<ExpenseStore>((set) => ({
  expenses: [],
  addExpense: (expense) =>
    set((state) => ({
      expenses: [
        ...state.expenses,
        {
          ...expense,
          id: crypto.randomUUID(),
        },
      ],
    })),
  removeExpense: (id) =>
    set((state) => ({
      expenses: state.expenses.filter((expense) => expense.id !== id),
    })),
  updateExpense: (id, updatedExpense) =>
    set((state) => ({
      expenses: state.expenses.map((expense) =>
        expense.id === id ? { ...expense, ...updatedExpense } : expense,
      ),
    })),
}));
