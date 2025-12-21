'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createBill } from '@/lib/api';

import { RecurrenceEndControls } from './recurrence-end-controls';

interface AddBillFormProps {
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

export function AddBillForm({ onCancel, onSuccess }: AddBillFormProps) {
  const [billForm, setBillForm] = useState<{
    label: string;
    date: string;
    value: string;
    recurrence: string;
    recurrenceEndMode: 'none' | 'endDate' | 'endCount';
    recurrenceEndDate: string;
    recurrenceCount: string;
    isAuto: boolean;
  }>({
    label: '',
    date: '',
    value: '',
    recurrence: '',
    recurrenceEndMode: 'none',
    recurrenceEndDate: '',
    recurrenceCount: '',
    isAuto: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const shouldUseEndDate =
        billForm.recurrence !== '' && billForm.recurrenceEndMode === 'endDate';
      const shouldUseEndCount =
        billForm.recurrence !== '' &&
        billForm.recurrenceEndMode === 'endCount' &&
        billForm.recurrenceCount !== '';
      await createBill({
        label: billForm.label.trim(),
        date: billForm.date,
        value: Number(billForm.value),
        recurrence:
          billForm.recurrence && billForm.recurrence !== ''
            ? (billForm.recurrence as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY')
            : undefined,
        recurrenceEndDate:
          shouldUseEndDate && billForm.recurrenceEndDate !== ''
            ? billForm.recurrenceEndDate
            : undefined,
        recurrenceCount: shouldUseEndCount ? Number(billForm.recurrenceCount) : undefined,
        isAuto: billForm.isAuto || undefined,
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
                ...(event.target.value === '' && {
                  recurrenceEndMode: 'none' as const,
                  recurrenceEndDate: '',
                  recurrenceCount: '',
                }),
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
          <RecurrenceEndControls
            state={{
              recurrenceEndMode: billForm.recurrenceEndMode,
              recurrenceEndDate: billForm.recurrenceEndDate,
              recurrenceCount: billForm.recurrenceCount,
            }}
            minDate={billForm.date}
            noEndDescription="Keep this bill recurring indefinitely."
            idPrefix="bill"
            onChange={(nextState): void =>
              setBillForm((previous) => ({
                ...previous,
                ...nextState,
              }))
            }
          />
        )}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <input
              id="bill-is-auto"
              type="checkbox"
              checked={billForm.isAuto}
              onChange={(event): void =>
                setBillForm((previous) => ({
                  ...previous,
                  isAuto: event.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <Label htmlFor="bill-is-auto" className="cursor-pointer text-sm font-normal">
              Auto-pay
            </Label>
          </div>
          <p className="pl-6 text-xs text-muted-foreground">
            Mark if this bill is automatically paid.
          </p>
        </div>
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
