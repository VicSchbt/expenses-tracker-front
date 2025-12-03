'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createSaving } from '@/lib/api';

interface AddSavingsFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const RECURRENCE_OPTIONS: Array<{
  value: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  label: string;
}> = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
];

export function AddSavingsForm({ onCancel, onSuccess }: AddSavingsFormProps) {
  const [savingsForm, setSavingsForm] = useState<{
    goalId: string;
    date: string;
    value: string;
    recurrence: string;
    recurrenceEndDate: string;
  }>({
    goalId: '',
    date: '',
    value: '',
    recurrence: '',
    recurrenceEndDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await createSaving({
        goalId: savingsForm.goalId,
        date: savingsForm.date,
        value: Number(savingsForm.value),
        recurrence:
          savingsForm.recurrence && savingsForm.recurrence !== ''
            ? (savingsForm.recurrence as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY')
            : undefined,
        recurrenceEndDate:
          savingsForm.recurrenceEndDate && savingsForm.recurrenceEndDate !== ''
            ? savingsForm.recurrenceEndDate
            : undefined,
      });
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create saving';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <section className="space-y-3 rounded-md border bg-muted/50 p-4">
        <div className="space-y-1">
          <Label htmlFor="savings-goal-id">Savings Goal ID</Label>
          <Input
            id="savings-goal-id"
            value={savingsForm.goalId}
            onChange={(event): void =>
              setSavingsForm((previous) => ({
                ...previous,
                goalId: event.target.value,
              }))
            }
            placeholder="Goal ID"
            required
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="savings-date">Date</Label>
            <Input
              id="savings-date"
              type="date"
              value={savingsForm.date}
              onChange={(event): void =>
                setSavingsForm((previous) => ({
                  ...previous,
                  date: event.target.value,
                }))
              }
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="savings-value">Amount</Label>
            <Input
              id="savings-value"
              type="number"
              min="0"
              step="0.01"
              value={savingsForm.value}
              onChange={(event): void =>
                setSavingsForm((previous) => ({
                  ...previous,
                  value: event.target.value,
                }))
              }
              placeholder="100.00"
              required
            />
          </div>
        </div>
      </section>
      <section className="space-y-3 rounded-md border bg-muted/50 p-4">
        <div className="space-y-1">
          <Label htmlFor="savings-recurrence">Recurrence (optional)</Label>
          <select
            id="savings-recurrence"
            className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={savingsForm.recurrence}
            onChange={(event): void =>
              setSavingsForm((previous) => ({
                ...previous,
                recurrence: event.target.value,
                ...(event.target.value === '' && { recurrenceEndDate: '' }),
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
            Select if this saving repeats on a regular basis (e.g., monthly savings contribution).
          </p>
        </div>
        {savingsForm.recurrence && savingsForm.recurrence !== '' && (
          <div className="space-y-1">
            <Label htmlFor="savings-recurrence-end-date">Recurrence End Date (optional)</Label>
            <Input
              id="savings-recurrence-end-date"
              type="date"
              value={savingsForm.recurrenceEndDate}
              onChange={(event): void =>
                setSavingsForm((previous) => ({
                  ...previous,
                  recurrenceEndDate: event.target.value,
                }))
              }
              min={savingsForm.date}
            />
            <p className="text-xs text-muted-foreground">
              Optionally set an end date for this recurring saving. Leave empty for ongoing
              recurrence.
            </p>
          </div>
        )}
      </section>
      {submitError && <p className="text-sm text-destructive">{submitError}</p>}
      <div className="flex justify-end gap-2">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save saving'}
        </Button>
      </div>
    </form>
  );
}


