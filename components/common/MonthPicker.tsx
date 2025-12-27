import type { ChangeEvent } from 'react';

import { Input } from '@/components/ui/input';
import type { MonthFilter } from '@/lib/types/month-filter';

interface MonthPickerProps {
  monthFilter: MonthFilter;
  onMonthFilterChange: (monthFilter: MonthFilter) => void;
}

function formatMonthValue(year: number, month: number): string {
  const monthString = month.toString().padStart(2, '0');
  return `${year}-${monthString}`;
}

const MonthPicker = ({ monthFilter, onMonthFilterChange }: MonthPickerProps) => {
  const selectedValue = formatMonthValue(monthFilter.year, monthFilter.month);
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
  );
};

export default MonthPicker;
