import { create } from 'zustand';

import { getSavingsGoals } from '@/lib/api';
import { SavingsGoal } from '@/lib/types/savings-goal';

interface SavingsStore {
  savingsGoals: SavingsGoal[];
  fetchSavingsGoals: () => Promise<void>;
  getTotalSavings: () => number;
}

export const useSavingsStore = create<SavingsStore>((set, get) => ({
  savingsGoals: [],
  fetchSavingsGoals: async () => {
    const savingsGoals = await getSavingsGoals();
    set({ savingsGoals });
  },
  getTotalSavings: () => {
    return get().savingsGoals.reduce((acc, goal) => acc + goal.currentAmount, 0);
  },
}));
