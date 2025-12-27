import { MoreVertical } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

import { Category } from '@/lib/types/category';
import { formatCurrency } from '@/lib/utils';
import { useCategoriesStore } from '@/store/useCategoriesStore';

import AlertDialog from '../common/AlertDialog';
import TransactionLine from '../common/TransactionLine';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Progress } from '../ui/progress';
import EditCategoryForm from './EditCategoryForm';

interface CategoryDetailsProps {
  category: Category;
  progress: number;
}

type ViewMode = 'details' | 'edit';

const CategoryDetails = ({ category, progress }: CategoryDetailsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('details');
  const {
    isLoading,
    error,
    categoryTransactions,
    deleteExistingCategory,
    isUpdatingId,
    updateExistingCategory,
  } = useCategoriesStore();

  const transactions = useMemo(() => {
    const transactions = categoryTransactions.get(category.id) || [];
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [categoryTransactions]);

  const isUpdating = isUpdatingId === category.id;

  useEffect(() => {
    if (isOpen) {
      setViewMode('details');
    }
  }, [isOpen]);

  const handleDeleteCategory = () => {
    deleteExistingCategory(category.id);
    setIsOpen(false);
  };

  const handleEditCategory = async (data: {
    label?: string;
    color?: string | null;
    icon?: string | null;
    budget?: number | null;
  }) => {
    try {
      await updateExistingCategory(category.id, data);
      setViewMode('details');
    } catch (err) {
      // Error is handled by the store
      console.error('Failed to update category:', err);
    }
  };

  const handleCancelEdit = () => {
    setViewMode('details');
  };

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
            {viewMode === 'details' && (
              <span className="block text-sm text-muted-foreground">
                {category.isBudgetOverloaded
                  ? formatCurrency(category.budgetOverloadAmount ?? 0)
                  : category.budget != null
                    ? formatCurrency(category.budget ?? 0)
                    : 'No budget'}
              </span>
            )}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {viewMode === 'details' ? 'Category details and transactions' : 'Edit category'}
          </DialogDescription>
          {viewMode === 'details' && (
            <div className="flex w-full flex-col gap-2 py-4">
              {category.budget != null && (
                <div className="flex items-center gap-2">
                  <Progress value={progress} className="h-2" />
                  <span className="text-sm text-muted-foreground">{progress.toFixed(0)}%</span>
                </div>
              )}
            </div>
          )}
        </DialogHeader>

        {viewMode === 'details' ? (
          <>
            {transactions.length > 0 ? (
              <ol className="flex max-h-[40vh] flex-col gap-2 overflow-y-auto">
                {transactions.map((transaction) => (
                  <TransactionLine key={transaction.id} transaction={transaction} />
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted-foreground">No transactions found</p>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewMode('edit')}>
                Edit Category
              </Button>
              <AlertDialog
                trigger="Delete Category"
                title="Delete Category"
                description="Are you sure you want to delete this category? This action cannot be undone. Existing transactions will keep their amounts but lose this category."
                variant="destructive"
                onConfirm={handleDeleteCategory}
                onCancel={() => setIsOpen(false)}
              />
            </DialogFooter>
          </>
        ) : (
          <EditCategoryForm
            category={category}
            isUpdating={isUpdating}
            error={error}
            onSubmit={handleEditCategory}
            onCancel={handleCancelEdit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDetails;
