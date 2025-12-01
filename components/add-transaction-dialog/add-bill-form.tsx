'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createBill } from '@/lib/api';

interface AddBillFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const RECURRENCE_OPTIONS: Array<{ value: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'; label: string }> = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
];

export function AddBillForm({ onCancel, onSuccess }: AddBillFormProps) {
  const [billForm, setBillForm] = useState<{
    label: string;
    date: string;
    value: string;
    recurrence: string;
    recurrenceEndDate: string;
  }>({
    label: '',
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
      await createBill({
        label: billForm.label.trim(),
        date: billForm.date,
        value: Number(billForm.value),
        recurrence:
          billForm.recurrence && billForm.recurrence !== ''
            ? (billForm.recurrence as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY')
            : undefined,
        recurrenceEndDate:
          billForm.recurrenceEndDate && billForm.recurrenceEndDate !== ''
            ? billForm.recurrenceEndDate
            : undefined,
      });
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create bill';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <section className="space-y-3 rounded-md border bg-muted/50 p-4">
        <div className="space-y-1">
          <Label htmlFor="bill-label">Label</Label>
          <Input
            id="bill-label"
            value={billForm.label}
            onChange={(event): void =>
              setBillForm((previous) => ({
                ...previous,
                label: event.target.value,
              }))
            }
            placeholder="Electricity Bill"
            required
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="bill-date">Date</Label>
            <Input
              id="bill-date"
              type="date"
              value={billForm.date}
              onChange={(event): void =>
                setBillForm((previous) => ({
                  ...previous,
                  date: event.target.value,
                }))
              }
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="bill-value">Amount</Label>
            <Input
              id="bill-value"
              type="number"
              min="0"
              step="0.01"
              value={billForm.value}
              onChange={(event): void =>
                setBillForm((previous) => ({
                  ...previous,
                  value: event.target.value,
                }))
              }
              placeholder="150.00"
              required
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="bill-recurrence">Recurrence (optional)</Label>
          <select
            id="bill-recurrence"
            className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={billForm.recurrence}
            onChange={(event): void =>
              setBillForm((previous) => ({
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
            Select if this bill repeats on a regular basis (e.g., monthly utilities).
          </p>
        </div>
        {billForm.recurrence && billForm.recurrence !== '' && (
          <div className="space-y-1">
            <Label htmlFor="bill-recurrence-end-date">Recurrence End Date (optional)</Label>
            <Input
              id="bill-recurrence-end-date"
              type="date"
              value={billForm.recurrenceEndDate}
              onChange={(event): void =>
                setBillForm((previous) => ({
                  ...previous,
                  recurrenceEndDate: event.target.value,
                }))
              }
              min={billForm.date}
            />
            <p className="text-xs text-muted-foreground">
              Optionally set an end date for this recurring bill. Leave empty for ongoing recurrence.
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
          {isSubmitting ? 'Saving...' : 'Save bill'}
        </Button>
      </div>
    </form>
  );
}

