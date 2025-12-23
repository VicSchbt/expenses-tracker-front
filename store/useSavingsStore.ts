import { create } from 'zustand';

import { createSaving, createSavingsGoal, getSavingsGoals } from '@/lib/api';
import { SavingsGoal } from '@/lib/types/savings-goal';

interface SavingsStore {
  savingsGoals: SavingsGoal[];
  fetchSavingsGoals: () => Promise<void>;
  getTotalSavings: () => number;
  isLoading: boolean;
  error: string | null;
  createSavingsGoal: (data: {
    name: string;
    targetAmount: number;
    dueDate?: string;
  }) => Promise<void>;
  createSavingTransaction: (data: {
    goalId: string;
    date: string;
    value: number;
    recurrence?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    recurrenceEndDate?: string;
    isAuto?: boolean;
  }) => Promise<void>;
}

export const useSavingsStore = create<SavingsStore>((set, get) => ({
  savingsGoals: [],
  isLoading: false,
  error: null,

  fetchSavingsGoals: async () => {
    try {
      set({ isLoading: true, error: null });
      const savingsGoals = await getSavingsGoals();
      set({ savingsGoals, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch savings goals',
        isLoading: false,
      });
    }
  },

  getTotalSavings: () => {
    return get().savingsGoals.reduce((acc, goal) => acc + goal.currentAmount, 0);
  },

  createSavingsGoal: async (data: { name: string; targetAmount: number; dueDate?: string }) => {
    try {
      set({ isLoading: true, error: null });
      const newGoal = await createSavingsGoal({
        name: data.name,
        targetAmount: data.targetAmount,
        dueDate: data.dueDate ?? undefined,
      });
      set({ savingsGoals: [...get().savingsGoals, newGoal], isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create savings goal',
        isLoading: false,
      });
      throw error;
    }
  },

  createSavingTransaction: async (data) => {
    try {
      set({ isLoading: true, error: null });
      await createSaving(data);
      await get().fetchSavingsGoals();
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create saving transaction',
        isLoading: false,
      });
      throw error;
    }
  },
}));
