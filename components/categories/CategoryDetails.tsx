import { MoreVertical } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

import { Category } from '@/lib/types/category';
import { formatCurrency } from '@/lib/utils';
import { useCategoriesStore } from '@/store/useCategoriesStore';

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

interface CategoryDetailsProps {
  category: Category;
  progress: number;
}

const CategoryDetails = ({ category, progress }: CategoryDetailsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoading, error, categoryTransactions } = useCategoriesStore();

  const transactions = useMemo(() => {
    const transactions = categoryTransactions.get(category.id) || [];
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [categoryTransactions]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-left text-2xl font-bold">
            <span className="mr-2 text-2xl font-bold">{category.icon}</span>
            {category.label}
            <span className="block text-sm text-muted-foreground">
              {category.isBudgetOverloaded
                ? formatCurrency(category.budgetOverloadAmount ?? 0)
                : category.budget != null
                  ? formatCurrency(category.budget ?? 0)
                  : 'No budget'}
            </span>
          </DialogTitle>
          <DialogDescription className="sr-only">blablabla</DialogDescription>
          <div className="flex w-full flex-col gap-2 py-4">
            {category.budget != null && (
              <div className="flex items-center gap-2">
                <Progress value={progress} className="h-2" />
                <span className="text-sm text-muted-foreground">{progress.toFixed(0)}%</span>
              </div>
            )}
          </div>
        </DialogHeader>
        {category.budget != null && (
          <ol className="flex max-h-[40vh] flex-col gap-2 overflow-y-auto">
            {transactions.map((transaction) => (
              <TransactionLine key={transaction.id} transaction={transaction} />
            ))}
          </ol>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDetails;
