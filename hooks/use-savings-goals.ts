import { useEffect, useState } from 'react';

import {
  createSavingsGoal,
  deleteSavingsGoal,
  getSavingsGoals,
  updateSavingsGoal,
} from '@/lib/api';
import type { SavingsGoal } from '@/lib/types/savings-goal';

interface SavingsGoalFormData {
  name: string;
  targetAmount: number;
  dueDate?: string;
}

export function useSavingsGoals() {
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);
  const [isCreatingGoal, setIsCreatingGoal] = useState(false);
  const [createGoalError, setCreateGoalError] = useState<string | null>(null);
  const [isAddGoalFormOpen, setIsAddGoalFormOpen] = useState(false);

  useEffect(() => {
    async function fetchSavingsGoals(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getSavingsGoals();
        setSavingsGoals(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load savings goals';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchSavingsGoals();
  }, []);

  const handleDeleteGoal = async (goalId: string): Promise<void> => {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this savings goal? Linked savings transactions will remain but will lose this goal association.',
    );
    if (!isConfirmed) {
      return;
    }
    setIsDeletingId(goalId);
    try {
      await deleteSavingsGoal(goalId);
      setSavingsGoals((previous) => previous.filter((goal) => goal.id !== goalId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete savings goal';
      setError(message);
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleStartEditGoal = (goal: SavingsGoal): void => {
    setEditingGoalId(goal.id);
  };

  const handleCancelEditGoal = (): void => {
    setEditingGoalId(null);
  };

  const handleSaveEditGoal = async (data: SavingsGoalFormData): Promise<void> => {
    if (!editingGoalId) {
      return;
    }
    setIsUpdatingId(editingGoalId);
    try {
      const updatedGoal = await updateSavingsGoal(editingGoalId, {
        name: data.name,
        targetAmount: data.targetAmount,
        dueDate: data.dueDate ?? null,
      });
      setSavingsGoals((previous) =>
        previous.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal)),
      );
      setEditingGoalId(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update savings goal';
      setError(message);
      throw err;
    } finally {
      setIsUpdatingId(null);
    }
  };

  const handleCreateGoal = async (data: SavingsGoalFormData): Promise<void> => {
    setCreateGoalError(null);
    setIsCreatingGoal(true);
    try {
      const createdGoal = await createSavingsGoal({
        name: data.name,
        targetAmount: data.targetAmount,
        dueDate: data.dueDate,
      });
      setSavingsGoals((previous) => [...previous, createdGoal]);
      setIsAddGoalFormOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create savings goal';
      setCreateGoalError(message);
      throw err;
    } finally {
      setIsCreatingGoal(false);
    }
  };

  const handleToggleAddGoalForm = (): void => {
    setIsAddGoalFormOpen((previous) => !previous);
    if (isAddGoalFormOpen) {
      setCreateGoalError(null);
    }
  };

  return {
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
  };
}
