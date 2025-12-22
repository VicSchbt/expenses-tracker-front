import { create } from 'zustand';

import { getSavingsGoals } from '@/lib/api';
import { SavingsGoal } from '@/lib/types/savings-goal';

interface SavingsStore {
  savingsGoals: SavingsGoal[];
  fetchSavingsGoals: () => Promise<void>;
}

export const useSavingsStore = create<SavingsStore>((set) => ({
  savingsGoals: [],
  fetchSavingsGoals: async () => {
    const savingsGoals = await getSavingsGoals();
    set({ savingsGoals });
  },
}));
