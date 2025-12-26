import { EllipsisVertical } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { SavingsGoal } from '@/lib/types/savings-goal';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { useSavingsStore } from '@/store/useSavingsStore';

import TransactionLine from '../common/TransactionLine';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Progress } from '../ui/progress';

interface SavingsGoalItemDetailsProps {
  goal: SavingsGoal;
  progress: number;
}

const SavingsGoalItemDetails = ({ goal, progress }: SavingsGoalItemDetailsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { fetchSavingsGoalTransactions, isLoading, error, savingsGoalTransactions } =
    useSavingsStore();

  useEffect(() => {
    void fetchSavingsGoalTransactions(goal.id);
  }, [goal.id, fetchSavingsGoalTransactions]);

  const transactions = useMemo(() => {
    const transactions = savingsGoalTransactions.get(goal.id) || [];
    return transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [savingsGoalTransactions]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer self-start">
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">{goal.name}</DialogTitle>
          <DialogDescription className="flex w-full flex-col gap-2 py-4">
            <div className="col-center w-full">
              <p className="text-3xl font-bold">{formatCurrency(goal.currentAmount)} </p>
              <p>/ {formatCurrency(goal.targetAmount)}</p>
            </div>
            <Progress value={progress} className="h-2" />
          </DialogDescription>
        </DialogHeader>
        <ol className="flex max-h-[40vh] flex-col gap-2 overflow-y-auto">
          {transactions.map((transaction) => (
            <TransactionLine key={transaction.id} transaction={transaction} />
          ))}
        </ol>
      </DialogContent>
    </Dialog>
  );
};

export default SavingsGoalItemDetails;
