import { EllipsisVertical, PiggyBank } from 'lucide-react';
import React from 'react';

import { SavingsGoal } from '@/lib/types/savings-goal';
import { formatCurrency } from '@/lib/utils';

import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

interface SavingsGoalItemProps {
  goal: SavingsGoal;
}

const SavingsGoalItem = ({ goal }: SavingsGoalItemProps) => {
  const progress =
    goal.targetAmount > 0
      ? Math.min(Number(((goal.currentAmount / goal.targetAmount) * 100).toFixed(2)), 100)
      : 0;
  goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0;
  const isBreakable = goal.currentAmount >= goal.targetAmount;

  return (
    <li className="flex w-full flex-col gap-4 rounded-md border bg-card p-4 text-sm">
      <div className="flex w-full flex-row items-center gap-6">
        <PiggyBank className="size-12" />
        <div className="flex w-full flex-row items-center justify-between gap-2">
          <div className="flex flex-1 flex-col gap-2">
            <h2 className="text-lg font-bold">{goal.name}</h2>
            <p>{goal.dueDate ? `Due ${goal.dueDate.slice(0, 10)}` : 'No due date'}</p>
            <p className="text-xs text-muted-foreground">
              <span className="text-lg font-bold">{formatCurrency(goal.currentAmount)}</span> /{' '}
              {formatCurrency(goal.targetAmount)} ({progress}%)
            </p>
            <Progress value={progress} className="h-2" />
          </div>
          <Button variant="ghost" size="icon" className="cursor-pointer self-start">
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex w-full flex-row items-center gap-2">
        <Button className="w-full cursor-pointer">Add Money</Button>
        {/* TODO: add tooltip to break piggy */}
        <Button variant="ghost" className="w-full cursor-pointer" disabled={!isBreakable}>
          Break Piggy
        </Button>
      </div>
    </li>
  );
};

export default SavingsGoalItem;
