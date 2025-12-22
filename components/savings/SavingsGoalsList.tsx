import React from 'react';

import { SavingsGoal } from '@/lib/types/savings-goal';

import SavingsGoalItem from './SavingsGoalItem';

interface SavingsGoalsListProps {
  savingsGoals: SavingsGoal[];
}

const SavingsGoalsList = ({ savingsGoals }: SavingsGoalsListProps) => {
  return (
    <ul className="space-y-4">
      {savingsGoals.map((goal) => (
        <SavingsGoalItem key={goal.id} goal={goal} />
      ))}
    </ul>
  );
};

export default SavingsGoalsList;
