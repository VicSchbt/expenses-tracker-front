'use client';

import { useEffect, useState } from 'react';

import { AddSavingsGoalForm } from '@/components/savings-goals/add-savings-goal-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createSaving, createSavingsGoal, getSavingsGoals } from '@/lib/api';
import type { SavingsGoal } from '@/lib/types/savings-goal';

interface AddSavingsFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

const ADD_GOAL_VALUE = '__add_savings_goal__' as const;

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
    isAuto: boolean;
  }>({
    goalId: '',
    date: '',
    value: '',
    recurrence: '',
    recurrenceEndDate: '',
    isAuto: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [isSavingsGoalsLoading, setIsSavingsGoalsLoading] = useState(false);
  const [savingsGoalsError, setSavingsGoalsError] = useState<string | null>(null);
  const [isAddGoalDialogOpen, setIsAddGoalDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchSavingsGoals(): Promise<void> {
      try {
        setIsSavingsGoalsLoading(true);
        setSavingsGoalsError(null);
        const data = await getSavingsGoals();
        setSavingsGoals(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load savings goals';
        setSavingsGoalsError(message);
      } finally {
        setIsSavingsGoalsLoading(false);
      }
    }
    if (savingsGoals.length > 0 || isSavingsGoalsLoading) {
      return;
    }
    void fetchSavingsGoals();
  }, [savingsGoals.length, isSavingsGoalsLoading]);

  const handleGoalChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target;
    if (value === ADD_GOAL_VALUE) {
      setIsAddGoalDialogOpen(true);
      return;
    }
    setSavingsForm((previous) => ({
      ...previous,
      goalId: value,
    }));
  };

  const handleAddGoalSubmit = async (data: {
    name: string;
    targetAmount: number;
    dueDate?: string;
  }): Promise<void> => {
    try {
      const createdGoal = await createSavingsGoal({
        name: data.name,
        targetAmount: data.targetAmount,
        dueDate: data.dueDate,
      });
      setSavingsGoals((previous) => [...previous, createdGoal]);
      setSavingsForm((previous) => ({
        ...previous,
        goalId: createdGoal.id,
      }));
      setIsAddGoalDialogOpen(false);
    } catch (error) {
      // The inner form already displays errors from the submit handler in AddSavingsGoalForm.
      throw error;
    }
  };

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
        isAuto: savingsForm.isAuto || undefined,
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
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <section className="space-y-3 rounded-md border bg-muted/50 p-4">
          <div className="space-y-1">
            <Label htmlFor="savings-goal">Savings goal</Label>
            <select
              id="savings-goal"
              className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={savingsForm.goalId}
              onChange={handleGoalChange}
              disabled={isSavingsGoalsLoading}
              required
            >
              <option value="">Select a savings goal</option>
              {savingsGoals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.name}
                </option>
              ))}
              <option value={ADD_GOAL_VALUE}>+ Add new savings goal</option>
            </select>
            {savingsGoalsError && <p className="text-sm text-destructive">{savingsGoalsError}</p>}
            <p className="text-xs text-muted-foreground">
              Choose an existing savings goal or create a new one. You can also manage your goals
              from the dedicated page in the app navigation.
            </p>
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
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <input
                id="savings-is-auto"
                type="checkbox"
                checked={savingsForm.isAuto}
                onChange={(event): void =>
                  setSavingsForm((previous) => ({
                    ...previous,
                    isAuto: event.target.checked,
                  }))
                }
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
              <Label htmlFor="savings-is-auto" className="cursor-pointer text-sm font-normal">
                Auto-save
              </Label>
            </div>
            <p className="pl-6 text-xs text-muted-foreground">
              Mark if this saving is automatically transferred.
            </p>
          </div>
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

      <Dialog open={isAddGoalDialogOpen} onOpenChange={setIsAddGoalDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Add savings goal</DialogTitle>
            <DialogDescription>
              Create a savings goal to connect this saving and track your progress.
            </DialogDescription>
          </DialogHeader>
          <AddSavingsGoalForm
            isCreating={false}
            error={null}
            onSubmit={handleAddGoalSubmit}
            onCancel={(): void => setIsAddGoalDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
