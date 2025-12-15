import { useMemo } from 'react';
import type { ChangeEvent } from 'react';

import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { MonthFilter } from '@/lib/types/month-filter';
import { useUserStore } from '@/stores/use-user-store';

interface MonthTabsProps {
  monthFilter: MonthFilter;
  onMonthFilterChange: (monthFilter: MonthFilter) => void;
}

interface MonthOption extends MonthFilter {
  label: string;
  value: string;
}

const PAST_MONTH_COUNT = 3;
const FUTURE_MONTH_COUNT = 3;

function formatMonthValue(year: number, month: number): string {
  const monthString = month.toString().padStart(2, '0');
  return `${year}-${monthString}`;
}

function createMonthOptions(months: MonthFilter[]): MonthOption[] {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth();
  const availableMonthKeys = new Set(months.map((month) => month.year * 12 + (month.month - 1)));
  const windowMonths: MonthFilter[] = [];
  for (let offset = -PAST_MONTH_COUNT; offset <= FUTURE_MONTH_COUNT; offset += 1) {
    const date = new Date(currentYear, currentMonthIndex + offset, 1);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthKey = year * 12 + date.getMonth();
    if (offset < 0 && !availableMonthKeys.has(monthKey)) {
      continue;
    }
    const exists = windowMonths.some((existingMonth) => {
      return existingMonth.year === year && existingMonth.month === month;
    });
    if (!exists) {
      windowMonths.push({ year, month });
    }
  }
  windowMonths.sort((firstMonth, secondMonth) => {
    const firstKey = firstMonth.year * 12 + (firstMonth.month - 1);
    const secondKey = secondMonth.year * 12 + (secondMonth.month - 1);
    return firstKey - secondKey;
  });
  return windowMonths.map((month) => {
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
  const months = useMemo<MonthOption[]>(
    () => createMonthOptions(availableMonths),
    [availableMonths],
  );
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
  const handleMonthInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    if (!value) {
      return;
    }
    const [yearString, monthString] = value.split('-');
    const year = Number.parseInt(yearString, 10);
    const month = Number.parseInt(monthString, 10);
    if (Number.isNaN(year) || Number.isNaN(month)) {
      return;
    }
    onMonthFilterChange({
      year,
      month,
    });
  };
  return (
    <section className="mb-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Tabs value={selectedValue} onValueChange={handleValueChange}>
          <TabsList className="inline-flex justify-start gap-1 overflow-x-auto">
            {months.map((month) => (
              <TabsTrigger key={month.value} value={month.value}>
                {month.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <label htmlFor="month-picker" className="text-sm text-muted-foreground">
            Select month
          </label>
          <Input
            id="month-picker"
            type="month"
            value={selectedValue}
            onChange={handleMonthInputChange}
            className="max-w-[180px]"
          />
        </div>
      </div>
    </section>
  );
}
