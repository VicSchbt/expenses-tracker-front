import { create } from 'zustand';

import type { MonthFilter } from '@/lib/types/month-filter';

interface UserStoreState {
  availableMonths: MonthFilter[];
  isAvailableMonthsInitialized: boolean;
  setAvailableMonths: (months: MonthFilter[]) => void;
  addAvailableMonth: (month: MonthFilter) => void;
  hasAvailableMonth: (month: MonthFilter) => boolean;
  clearAvailableMonths: () => void;
  setIsAvailableMonthsInitialized: (value: boolean) => void;
}

export const useUserStore = create<UserStoreState>((set, get) => ({
  availableMonths: [],
  isAvailableMonthsInitialized: false,
  setAvailableMonths: (months) => {
    set({ availableMonths: months });
  },
  addAvailableMonth: (month) => {
    const hasMonth: boolean = get().hasAvailableMonth(month);
    if (hasMonth) {
      return;
    }
    const currentMonths: MonthFilter[] = get().availableMonths;
    set({
      availableMonths: [...currentMonths, month],
    });
  },
  hasAvailableMonth: (month) => {
    const { year, month: monthValue } = month;
    return get().availableMonths.some((storedMonth) => {
      return storedMonth.year === year && storedMonth.month === monthValue;
    });
  },
  clearAvailableMonths: () => {
    set({ availableMonths: [] });
  },
  setIsAvailableMonthsInitialized: (value) => {
    set({ isAvailableMonthsInitialized: value });
  },
}));
