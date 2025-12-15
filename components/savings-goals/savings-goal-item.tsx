import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { SavingsGoal } from '@/lib/types/savings-goal';
import { formatCurrency } from '@/lib/utils';

interface SavingsGoalEditFormData {
  name: string;
  targetAmount: string;
  dueDate: string;
}

interface SavingsGoalItemProps {
  goal: SavingsGoal;
  isEditing: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
  onStartEdit: (goal: SavingsGoal) => void;
  onCancelEdit: () => void;
  onSaveEdit: (data: { name: string; targetAmount: number; dueDate?: string }) => Promise<void>;
  onDelete: (goalId: string) => Promise<void>;
}

export function SavingsGoalItem({
  goal,
  isEditing,
  isDeleting,
  isUpdating,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}: SavingsGoalItemProps): JSX.Element {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SavingsGoalEditFormData>({
    defaultValues: {
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      dueDate: goal.dueDate ? goal.dueDate.slice(0, 10) : '',
    },
  });

  useEffect(() => {
    if (isEditing) {
      reset({
        name: goal.name,
        targetAmount: goal.targetAmount.toString(),
        dueDate: goal.dueDate ? goal.dueDate.slice(0, 10) : '',
      });
    }
  }, [isEditing, goal, reset]);

  const handleSubmitEdit = async (data: SavingsGoalEditFormData): Promise<void> => {
    await onSaveEdit({
      name: data.name.trim(),
      targetAmount: Number(data.targetAmount),
      dueDate: data.dueDate || undefined,
    });
  };

  const progress =
    goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0;

  if (isEditing) {
    return (
      <li className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
        <form onSubmit={handleSubmit(handleSubmitEdit)} className="flex flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              {...register('name', {
                required: 'Goal name is required',
                validate: (value) => {
                  if (!value.trim()) {
                    return 'Goal name cannot be empty';
                  }
                  return true;
                },
              })}
              className="h-8 max-w-xs"
            />
            <Input
              {...register('targetAmount', {
                required: 'Target amount is required',
                validate: (value) => {
                  const numericValue = Number(value);
                  if (Number.isNaN(numericValue) || numericValue <= 0) {
                    return 'Target amount must be a positive number';
                  }
                  return true;
                },
              })}
              type="number"
              min="0"
              step="0.01"
              className="h-8 w-28"
            />
            <Input {...register('dueDate')} type="date" className="h-8 w-40" />
          </div>
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          {errors.targetAmount && (
            <p className="text-xs text-destructive">{errors.targetAmount.message}</p>
          )}
          <div className="flex items-center gap-2">
            <Button type="submit" size="sm" disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save'}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={(): void => {
                reset();
                onCancelEdit();
              }}
              disabled={isUpdating}
            >
              Cancel
            </Button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium">{goal.name}</p>
          <p className="text-xs text-muted-foreground">
            {goal.dueDate ? `Due ${goal.dueDate.slice(0, 10)}` : 'No due date'}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
          </p>
          <p className="text-xs text-muted-foreground">{progress.toFixed(0)}% funded</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={(): void => onStartEdit(goal)}>
          Edit
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(): Promise<void> => onDelete(goal.id)}
          disabled={isDeleting || isUpdating}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </li>
  );
}
