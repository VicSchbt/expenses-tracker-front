'use client';

import { useState } from 'react';
import Link from 'next/link';

import { AppNavbar } from '@/components/app-navbar';
import { AuthGuard } from '@/components/auth-guard';
import { SavingsGoalsSection, SavingsGoalTransactionsDialog } from '@/components/savings-goals';
import { Button } from '@/components/ui/button';
import { useSavingsGoals } from '@/hooks/use-savings-goals';
import type { SavingsGoal } from '@/lib/types/savings-goal';

export default function SavingsGoalsPage() {
  const [selectedGoalForTransactions, setSelectedGoalForTransactions] =
    useState<SavingsGoal | null>(null);
  const {
    savingsGoals,
    isLoading,
    error,
    isDeletingId,
    editingGoalId,
    isUpdatingId,
    isCreatingGoal,
    createGoalError,
    isAddGoalFormOpen,
    handleDeleteGoal,
    handleStartEditGoal,
    handleCancelEditGoal,
    handleSaveEditGoal,
    handleCreateGoal,
    handleToggleAddGoalForm,
  } = useSavingsGoals();

  const handleViewTransactions = (goal: SavingsGoal): void => {
    setSelectedGoalForTransactions(goal);
  };

  const handleCloseTransactionsDialog = (): void => {
    setSelectedGoalForTransactions(null);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 md:px-8">
          <header className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Manage savings goals</h1>
              <p className="text-sm text-muted-foreground">
                Create and track savings goals, and see how your savings transactions contribute
                towards them.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/">Back to dashboard</Link>
            </Button>
          </header>

          {error && (
            <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <SavingsGoalsSection
            savingsGoals={savingsGoals}
            isLoading={isLoading}
            isAddGoalFormOpen={isAddGoalFormOpen}
            createGoalError={createGoalError}
            isCreatingGoal={isCreatingGoal}
            editingGoalId={editingGoalId}
            isDeletingId={isDeletingId}
            isUpdatingId={isUpdatingId}
            onToggleAddGoalForm={handleToggleAddGoalForm}
            onCreateGoal={handleCreateGoal}
            onStartEdit={handleStartEditGoal}
            onCancelEdit={handleCancelEditGoal}
            onSaveEdit={handleSaveEditGoal}
            onDelete={handleDeleteGoal}
            onViewTransactions={handleViewTransactions}
          />
        </main>
        <SavingsGoalTransactionsDialog
          goal={selectedGoalForTransactions}
          isOpen={selectedGoalForTransactions !== null}
          onClose={handleCloseTransactionsDialog}
        />
      </div>
    </AuthGuard>
  );
}
