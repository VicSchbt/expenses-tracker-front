import { Button } from '@/components/ui/button';
import type { SavingsGoal } from '@/lib/types/savings-goal';

import { AddSavingsGoalForm } from './add-savings-goal-form';
import { SavingsGoalsList } from './savings-goals-list';

interface SavingsGoalsSectionProps {
  savingsGoals: SavingsGoal[];
  isLoading: boolean;
  isAddGoalFormOpen: boolean;
  createGoalError: string | null;
  isCreatingGoal: boolean;
  editingGoalId: string | null;
  isDeletingId: string | null;
  isUpdatingId: string | null;
  onToggleAddGoalForm: () => void;
  onCreateGoal: (data: { name: string; targetAmount: number; dueDate?: string }) => Promise<void>;
  onStartEdit: (goal: SavingsGoal) => void;
  onCancelEdit: () => void;
  onSaveEdit: (data: { name: string; targetAmount: number; dueDate?: string }) => Promise<void>;
  onDelete: (goalId: string) => Promise<void>;
  onViewTransactions?: (goal: SavingsGoal) => void;
}

export function SavingsGoalsSection({
  savingsGoals,
  isLoading,
  isAddGoalFormOpen,
  createGoalError,
  isCreatingGoal,
  editingGoalId,
  isDeletingId,
  isUpdatingId,
  onToggleAddGoalForm,
  onCreateGoal,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  onViewTransactions,
}: SavingsGoalsSectionProps): JSX.Element {
  return (
    <section className="space-y-3 rounded-md border bg-muted/40 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Savings goals</h2>
        <Button type="button" onClick={onToggleAddGoalForm}>
          {isAddGoalFormOpen ? 'Cancel' : 'Add a goal'}
        </Button>
      </div>
      {isAddGoalFormOpen && (
        <AddSavingsGoalForm
          error={createGoalError}
          isCreating={isCreatingGoal}
          onSubmit={onCreateGoal}
          onCancel={onToggleAddGoalForm}
        />
      )}
      <div className={isAddGoalFormOpen ? 'mt-4 border-t pt-4' : 'mt-4 pt-4'}>
        <h2 className="mb-3 text-lg font-semibold">Existing savings goals</h2>
        <SavingsGoalsList
          savingsGoals={savingsGoals}
          isLoading={isLoading}
          editingGoalId={editingGoalId}
          isDeletingId={isDeletingId}
          isUpdatingId={isUpdatingId}
          onStartEdit={onStartEdit}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
          onDelete={onDelete}
          onViewTransactions={onViewTransactions}
        />
      </div>
    </section>
  );
}
