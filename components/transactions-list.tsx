'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  deleteTransaction,
  getCategories,
  getCurrentMonthTransactions,
  updateTransaction,
  type UpdateTransactionRequest,
} from '@/lib/api';
import type { Category } from '@/lib/types/category';
import type { PaginatedTransactions } from '@/lib/types/transaction';

interface TransactionsListProps {
  refreshKey: number;
}

interface EditTransactionFormState {
  label: string;
  date: string;
  value: string;
  categoryId: string;
}

export function TransactionsList({ refreshKey }: TransactionsListProps) {
  const [transactions, setTransactions] = useState<PaginatedTransactions | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditTransactionFormState | null>(null);
  const [isUpdatingTransaction, setIsUpdatingTransaction] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchTransactionsAndCategories() {
      try {
        setIsLoading(true);
        setError(null);
        const [transactionsData, categoriesData] = await Promise.all([
          getCurrentMonthTransactions({
            page: 1,
            limit: 20,
          }),
          getCategories(),
        ]);
        setTransactions(transactionsData);
        setCategories(categoriesData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load transactions and categories';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchTransactionsAndCategories();
  }, [refreshKey]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const findCategoryById = (
    categoryId: string | null,
    categoriesList: Category[],
  ): Category | null => {
    if (!categoryId) {
      return null;
    }
    const category = categoriesList.find((categoryItem) => categoryItem.id === categoryId);
    if (!category) {
      return null;
    }
    return category;
  };

  const getCategoryBackgroundColor = (color: string | null): string => {
    if (!color) {
      return 'rgba(229, 231, 235, 0.25)';
    }
    if (!color.startsWith('#')) {
      return color;
    }
    const hex = color.slice(1);
    if (hex.length !== 3 && hex.length !== 6) {
      return color;
    }
    const normalizedHex =
      hex.length === 3
        ? hex
            .split('')
            .map((value) => value + value)
            .join('')
        : hex;
    const red = Number.parseInt(normalizedHex.slice(0, 2), 16);
    const green = Number.parseInt(normalizedHex.slice(2, 4), 16);
    const blue = Number.parseInt(normalizedHex.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, 0.25)`;
  };

  const handleEditClick = (transactionId: string): void => {
    if (!transactions) {
      return;
    }
    const transactionToEdit = transactions.data.find(
      (transaction) => transaction.id === transactionId,
    );
    if (!transactionToEdit) {
      return;
    }
    const formattedDate = new Date(transactionToEdit.date).toISOString().slice(0, 10);
    setEditingTransactionId(transactionId);
    setEditForm({
      label: transactionToEdit.label,
      date: formattedDate,
      value: transactionToEdit.value.toString(),
      categoryId: transactionToEdit.categoryId ?? '',
    });
  };

  const handleEditFieldChange = (
    fieldName: keyof EditTransactionFormState,
    value: string,
  ): void => {
    setEditForm((previous) => {
      if (!previous) {
        return previous;
      }
      return {
        ...previous,
        [fieldName]: value,
      };
    });
  };

  const handleCancelEdit = (): void => {
    setEditingTransactionId(null);
    setEditForm(null);
  };

  const handleSubmitEdit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!editingTransactionId || !editForm) {
      return;
    }
    try {
      setIsUpdatingTransaction(true);
      const updatePayload: UpdateTransactionRequest = {
        label: editForm.label.trim(),
        date: editForm.date,
        value: Number(editForm.value),
        categoryId: editForm.categoryId || undefined,
      };
      const updatedTransaction = await updateTransaction(editingTransactionId, updatePayload);
      setTransactions((currentTransactions) => {
        if (!currentTransactions) {
          return currentTransactions;
        }
        const updatedData = currentTransactions.data.map((transaction) =>
          transaction.id === editingTransactionId ? updatedTransaction : transaction,
        );
        return {
          ...currentTransactions,
          data: updatedData,
        };
      });
      toast({
        title: 'Transaction updated',
        description: `Transaction "${updatedTransaction.label}" has been updated successfully.`,
      });
      handleCancelEdit();
    } catch (updateError) {
      const errorMessage =
        updateError instanceof Error ? updateError.message : 'Failed to update transaction';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingTransaction(false);
    }
  };

  const handleDeleteClick = async (transactionId: string): Promise<void> => {
    try {
      setDeletingTransactionId(transactionId);
      const deleteResponse = await deleteTransaction(transactionId);
      setTransactions((currentTransactions) => {
        if (!currentTransactions) {
          return currentTransactions;
        }
        const filteredData = currentTransactions.data.filter(
          (transaction) => transaction.id !== transactionId,
        );
        return {
          ...currentTransactions,
          data: filteredData,
        };
      });
      toast({
        title: 'Transaction deleted',
        description: deleteResponse.message || 'The transaction has been deleted successfully.',
      });
    } catch (deleteError) {
      const errorMessage =
        deleteError instanceof Error ? deleteError.message : 'Failed to delete transaction';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setDeletingTransactionId(null);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">
          {new Date().toLocaleString('en-US', { month: 'long' })} Transactions
        </h2>
      </div>

      {isLoading && (
        <div className="text-center text-muted-foreground">Loading transactions...</div>
      )}

      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-center text-destructive">
          {error}
        </div>
      )}

      {!isLoading && !error && transactions && (
        <>
          {transactions.data.length === 0 ? (
            <div className="rounded-md border p-4 text-center text-muted-foreground">
              No transactions found for the current month.
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.data.map((transaction) => {
                const category = findCategoryById(transaction.categoryId, categories);
                const isRefund = transaction.type === 'REFUND';
                return (
                  <div
                    key={transaction.id}
                    className="grid w-full grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] items-center gap-2 rounded-md border bg-card p-4 sm:gap-4"
                    style={{
                      gridTemplateAreas: '"label date category positive negative actions"',
                    }}
                  >
                    <div className="truncate font-medium" style={{ gridArea: 'label' }}>
                      {transaction.label}
                    </div>
                    <div className="text-sm text-muted-foreground" style={{ gridArea: 'date' }}>
                      {formatDate(transaction.date)}
                    </div>
                    <div className="flex items-center" style={{ gridArea: 'category' }}>
                      {category && (
                        <span
                          className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{ backgroundColor: getCategoryBackgroundColor(category.color) }}
                        >
                          {category.icon && (
                            <span className="mr-1" aria-hidden="true">
                              {category.icon}
                            </span>
                          )}
                          {category.label}
                        </span>
                      )}
                    </div>
                    <div
                      className="text-right text-lg font-semibold text-green-600"
                      style={{ gridArea: 'positive' }}
                    >
                      {isRefund && `+${formatCurrency(Math.abs(transaction.value))}`}
                    </div>
                    <div
                      className="text-right text-lg font-semibold text-red-600"
                      style={{ gridArea: 'negative' }}
                    >
                      {!isRefund && `-${formatCurrency(Math.abs(transaction.value))}`}
                    </div>
                    <div
                      className="ml-4 flex justify-end gap-2 sm:ml-6"
                      style={{ gridArea: 'actions' }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit transaction"
                        onClick={() => handleEditClick(transaction.id)}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete transaction"
                        disabled={deletingTransactionId === transaction.id}
                        onClick={() => handleDeleteClick(transaction.id)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
      <Dialog
        open={Boolean(editingTransactionId && editForm)}
        onOpenChange={(isOpen): void => {
          if (!isOpen) {
            handleCancelEdit();
          }
        }}
      >
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Edit transaction</DialogTitle>
            <DialogDescription>Update the details of your transaction.</DialogDescription>
          </DialogHeader>
          {editForm && (
            <form className="space-y-4" onSubmit={handleSubmitEdit}>
              <section className="space-y-3 rounded-md border bg-muted/50 p-4">
                <div className="space-y-1">
                  <Label htmlFor="edit-transaction-label">Label</Label>
                  <Input
                    id="edit-transaction-label"
                    value={editForm.label}
                    onChange={(event): void => handleEditFieldChange('label', event.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="edit-transaction-date">Date</Label>
                    <Input
                      id="edit-transaction-date"
                      type="date"
                      value={editForm.date}
                      onChange={(event): void => handleEditFieldChange('date', event.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="edit-transaction-value">Amount</Label>
                    <Input
                      id="edit-transaction-value"
                      type="number"
                      min="0"
                      step="0.01"
                      value={editForm.value}
                      onChange={(event): void => handleEditFieldChange('value', event.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="edit-transaction-category">Category (optional)</Label>
                  <select
                    id="edit-transaction-category"
                    className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={editForm.categoryId}
                    onChange={(event): void =>
                      handleEditFieldChange('categoryId', event.target.value)
                    }
                  >
                    <option value="">No category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon ? `${category.icon} ${category.label}` : category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </section>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdatingTransaction}>
                  {isUpdatingTransaction ? 'Saving...' : 'Save changes'}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
