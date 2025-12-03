import { useEffect, useMemo } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserStore } from '@/stores/use-user-store';
import type { MonthFilter } from '@/lib/types/month-filter';

interface MonthTabsProps {
  monthFilter: MonthFilter;
  onMonthFilterChange: (monthFilter: MonthFilter) => void;
}

interface MonthOption extends MonthFilter {
  label: string;
  value: string;
}

const MAX_MONTH_COUNT = 6;

function formatMonthValue(year: number, month: number): string {
  const monthString = month.toString().padStart(2, '0');
  return `${year}-${monthString}`;
}

function createMonthOptions(months: MonthFilter[]): MonthOption[] {
  const currentDate = new Date();
  const currentKey = currentDate.getFullYear() * 12 + currentDate.getMonth();
  const minKey = currentKey - (MAX_MONTH_COUNT - 1);
  const filteredMonths = months
    .filter((month) => {
      const monthKey = month.year * 12 + (month.month - 1);
      return monthKey <= currentKey && monthKey >= minKey;
    })
    .sort((firstMonth, secondMonth) => {
      const firstKey = firstMonth.year * 12 + (firstMonth.month - 1);
      const secondKey = secondMonth.year * 12 + (secondMonth.month - 1);
      return secondKey - firstKey;
    });
  return filteredMonths.map((month) => {
    const date = new Date(month.year, month.month - 1, 1);
    const label = date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
    const value = formatMonthValue(month.year, month.month);
    return {
      year: month.year,
      month: month.month,
      label,
      value,
    };
  });
}

export function MonthTabs({ monthFilter, onMonthFilterChange }: MonthTabsProps) {
  const availableMonths = useUserStore((state) => state.availableMonths);
  const months = useMemo<MonthOption[]>(() => createMonthOptions(availableMonths), [availableMonths]);
  useEffect(() => {
    if (months.length === 0) {
      return;
    }
    const hasSelectedMonth = months.some((month) => {
      return month.year === monthFilter.year && month.month === monthFilter.month;
    });
    if (!hasSelectedMonth) {
      const firstMonth = months[0];
      onMonthFilterChange({
        year: firstMonth.year,
        month: firstMonth.month,
      });
    }
  }, [monthFilter, months, onMonthFilterChange]);
  if (months.length === 0) {
    return null;
  }
  const selectedValue = formatMonthValue(monthFilter.year, monthFilter.month);
  const handleValueChange = (value: string): void => {
    const selectedMonth = months.find((month) => month.value === value);
    if (!selectedMonth) {
      return;
    }
    onMonthFilterChange({
      year: selectedMonth.year,
      month: selectedMonth.month,
    });
  };
  return (
    <section className="mb-6">
      <Tabs value={selectedValue} onValueChange={handleValueChange}>
        <TabsList className="inline-flex gap-1 overflow-x-auto justify-start">
          {months.map((month) => (
            <TabsTrigger key={month.value} value={month.value}>
              {month.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </section>
  );
}
