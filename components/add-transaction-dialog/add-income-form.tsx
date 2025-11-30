'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createIncome } from '@/lib/api';

interface AddIncomeFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const RECURRENCE_OPTIONS: Array<{ value: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'; label: string }> = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
];

export function AddIncomeForm({ onCancel, onSuccess }: AddIncomeFormProps) {
  const [incomeForm, setIncomeForm] = useState<{
    label: string;
    date: string;
    value: string;
    recurrence: string;
  }>({
    label: '',
    date: '',
    value: '',
    recurrence: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await createIncome({
        label: incomeForm.label.trim(),
        date: incomeForm.date,
        value: Number(incomeForm.value),
        recurrence:
          incomeForm.recurrence && incomeForm.recurrence !== ''
            ? (incomeForm.recurrence as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY')
            : undefined,
      });
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create income';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <section className="space-y-3 rounded-md border bg-muted/50 p-4">
        <div className="space-y-1">
          <Label htmlFor="income-label">Label</Label>
          <Input
            id="income-label"
            value={incomeForm.label}
            onChange={(event): void =>
              setIncomeForm((previous) => ({
                ...previous,
                label: event.target.value,
              }))
            }
            placeholder="Salary"
            required
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="income-date">Date</Label>
            <Input
              id="income-date"
              type="date"
              value={incomeForm.date}
              onChange={(event): void =>
                setIncomeForm((previous) => ({
                  ...previous,
                  date: event.target.value,
                }))
              }
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="income-value">Amount</Label>
            <Input
              id="income-value"
              type="number"
              min="0"
              step="0.01"
              value={incomeForm.value}
              onChange={(event): void =>
                setIncomeForm((previous) => ({
                  ...previous,
                  value: event.target.value,
                }))
              }
              placeholder="3000.50"
              required
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="income-recurrence">Recurrence (optional)</Label>
          <select
            id="income-recurrence"
            className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={incomeForm.recurrence}
            onChange={(event): void =>
              setIncomeForm((previous) => ({
                ...previous,
                recurrence: event.target.value,
              }))
            }
          >
            <option value="">No recurrence</option>
            {RECURRENCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Select if this income repeats on a regular basis (e.g., monthly salary).
          </p>
        </div>
      </section>
      {submitError && <p className="text-sm text-destructive">{submitError}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save income'}
        </Button>
      </div>
    </form>
  );
}

