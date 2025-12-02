import { useMemo } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { MonthFilter } from '@/lib/types/month-filter';

interface MonthTabsProps {
  monthFilter: MonthFilter;
  onMonthFilterChange: (monthFilter: MonthFilter) => void;
}

interface MonthOption extends MonthFilter {
  label: string;
  value: string;
}

const MONTH_COUNT = 6;

function formatMonthValue(year: number, month: number): string {
  const monthString = month.toString().padStart(2, '0');
  return `${year}-${monthString}`;
}

function createLastMonths(count: number): MonthOption[] {
  const currentDate = new Date();
  const months: MonthOption[] = [];
  for (let index = 0; index < count; index += 1) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - index, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const label = date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
    const value = formatMonthValue(year, month);
    months.push({ year, month, label, value });
  }
  return months;
}

export function MonthTabs({ monthFilter, onMonthFilterChange }: MonthTabsProps) {
  const months = useMemo<MonthOption[]>(() => createLastMonths(MONTH_COUNT), []);
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
        <TabsList className="flex gap-1 overflow-x-auto">
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
