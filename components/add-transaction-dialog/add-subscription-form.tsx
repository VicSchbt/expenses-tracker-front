'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createSubscription } from '@/lib/api';

interface AddSubscriptionFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const RECURRENCE_OPTIONS: Array<{ value: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'; label: string }> = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
];

export function AddSubscriptionForm({ onCancel, onSuccess }: AddSubscriptionFormProps) {
  const [subscriptionForm, setSubscriptionForm] = useState<{
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
      await createSubscription({
        label: subscriptionForm.label.trim(),
        date: subscriptionForm.date,
        value: Number(subscriptionForm.value),
        recurrence:
          subscriptionForm.recurrence && subscriptionForm.recurrence !== ''
            ? (subscriptionForm.recurrence as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY')
            : undefined,
        recurrenceEndDate:
          subscriptionForm.recurrenceEndDate && subscriptionForm.recurrenceEndDate !== ''
            ? subscriptionForm.recurrenceEndDate
            : undefined,
      });
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create subscription';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <section className="space-y-3 rounded-md border bg-muted/50 p-4">
        <div className="space-y-1">
          <Label htmlFor="subscription-label">Label</Label>
          <Input
            id="subscription-label"
            value={subscriptionForm.label}
            onChange={(event): void =>
              setSubscriptionForm((previous) => ({
                ...previous,
                label: event.target.value,
              }))
            }
            placeholder="Netflix"
            required
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="subscription-date">Date</Label>
            <Input
              id="subscription-date"
              type="date"
              value={subscriptionForm.date}
              onChange={(event): void =>
                setSubscriptionForm((previous) => ({
                  ...previous,
                  date: event.target.value,
                }))
              }
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="subscription-value">Amount</Label>
            <Input
              id="subscription-value"
              type="number"
              min="0"
              step="0.01"
              value={subscriptionForm.value}
              onChange={(event): void =>
                setSubscriptionForm((previous) => ({
                  ...previous,
                  value: event.target.value,
                }))
              }
              placeholder="15.99"
              required
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="subscription-recurrence">Recurrence (optional)</Label>
          <select
            id="subscription-recurrence"
            className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={subscriptionForm.recurrence}
            onChange={(event): void =>
              setSubscriptionForm((previous) => ({
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
            Select if this subscription repeats on a regular basis (typically monthly or yearly).
          </p>
        </div>
        {subscriptionForm.recurrence && subscriptionForm.recurrence !== '' && (
          <div className="space-y-1">
            <Label htmlFor="subscription-recurrence-end-date">Recurrence End Date (optional)</Label>
            <Input
              id="subscription-recurrence-end-date"
              type="date"
              value={subscriptionForm.recurrenceEndDate}
              onChange={(event): void =>
                setSubscriptionForm((previous) => ({
                  ...previous,
                  recurrenceEndDate: event.target.value,
                }))
              }
              min={subscriptionForm.date}
            />
            <p className="text-xs text-muted-foreground">
              Optionally set an end date for this recurring subscription. Leave empty for ongoing recurrence.
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
          {isSubmitting ? 'Saving...' : 'Save subscription'}
        </Button>
        </div>
    </form>
  );
}

