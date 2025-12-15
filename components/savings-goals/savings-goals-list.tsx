import type { SavingsGoal } from '@/lib/types/savings-goal';

import { SavingsGoalItem } from './savings-goal-item';

interface SavingsGoalsListProps {
  savingsGoals: SavingsGoal[];
  isLoading: boolean;
  editingGoalId: string | null;
  isDeletingId: string | null;
  isUpdatingId: string | null;
  onStartEdit: (goal: SavingsGoal) => void;
  onCancelEdit: () => void;
  onSaveEdit: (data: { name: string; targetAmount: number; dueDate?: string }) => Promise<void>;
  onDelete: (goalId: string) => Promise<void>;
}

export function SavingsGoalsList({
  savingsGoals,
  isLoading,
  editingGoalId,
  isDeletingId,
  isUpdatingId,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}: SavingsGoalsListProps): JSX.Element {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading savings goals...</p>;
  }

  if (savingsGoals.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        You have no savings goals yet. Create one to start tracking your progress.
      </p>
    );
  }

  return (
    <ul className="divide-y rounded-md border bg-background">
      {savingsGoals.map((goal) => (
        <SavingsGoalItem
          key={goal.id}
          goal={goal}
          isEditing={editingGoalId === goal.id}
          isDeleting={isDeletingId === goal.id}
          isUpdating={isUpdatingId === goal.id}
          onStartEdit={onStartEdit}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
