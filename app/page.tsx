'use client';

import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { AuthGuard } from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { createExpense, getCategories, getCurrentMonthTransactions } from '@/lib/api';
import type { Category } from '@/lib/types/category';
import type { PaginatedTransactions, TransactionType } from '@/lib/types/transaction';

interface TransactionsListProps {
  refreshKey: number;
}

function TransactionsList({ refreshKey }: TransactionsListProps) {
  const [transactions, setTransactions] = useState<PaginatedTransactions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCurrentMonthTransactions({
          page: 1,
          limit: 20,
        });
        setTransactions(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load transactions';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTransactions();
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

  return (
    <div className="w-full max-w-4xl">
      <h1 className="mb-8 text-center text-4xl font-bold">Expense Tracker</h1>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Current Month Transactions</h2>
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
              {transactions.data.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-md border bg-card p-4"
                >
                  <div className="flex-1">
                    <div className="font-medium">{transaction.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(transaction.date)}
                    </div>
                  </div>
                  <div
                    className={`text-lg font-semibold ${
                      transaction.type === 'REFUND' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'REFUND' ? '+' : '-'}
                    {formatCurrency(Math.abs(transaction.value))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTransactionType, setSelectedTransactionType] = useState<TransactionType | null>(
    null,
  );
  const [transactionsRefreshKey, setTransactionsRefreshKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [expenseForm, setExpenseForm] = useState<{
    label: string;
    date: string;
    value: string;
    categoryId: string;
  }>({
    label: '',
    date: '',
    value: '',
    categoryId: '',
  });

  const handleDialogOpenChange = (open: boolean): void => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedTransactionType(null);
      setSubmitError(null);
      setExpenseForm({
        label: '',
        date: '',
        value: '',
        categoryId: '',
      });
    }
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsCategoriesLoading(true);
        setCategoriesError(null);
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load categories';
        setCategoriesError(message);
      } finally {
        setIsCategoriesLoading(false);
      }
    }
    if (!isDialogOpen) {
      return;
    }
    if (categories.length > 0 || isCategoriesLoading) {
      return;
    }
    void fetchCategories();
  }, [categories.length, isCategoriesLoading, isDialogOpen]);

  const transactionTypes: Array<{
    value: TransactionType;
    label: string;
  }> = [
    { value: 'EXPENSE', label: 'Expense' },
    { value: 'INCOME', label: 'Income' },
    { value: 'BILL', label: 'Bill' },
    { value: 'SUBSCRIPTION', label: 'Subscription' },
    { value: 'SAVINGS', label: 'Savings' },
    { value: 'REFUND', label: 'Refund' },
  ];

  return (
    <AuthGuard>
      <main className="relative flex min-h-screen flex-col items-center p-8 md:p-24">
        <Button onClick={() => setIsDialogOpen(true)} className="fixed right-8 top-8 z-40">
          <Plus />
          Add Transaction
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogContent className="sm:max-w-[500px]">
            <form
              className="space-y-4"
              onSubmit={async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
                event.preventDefault();
                if (selectedTransactionType !== 'EXPENSE') {
                  return;
                }
                setSubmitError(null);
                setIsSubmitting(true);
                try {
                  await createExpense({
                    label: expenseForm.label,
                    date: expenseForm.date,
                    value: Number(expenseForm.value),
                    categoryId: expenseForm.categoryId || undefined,
                  });
                  setTransactionsRefreshKey((previous) => previous + 1);
                  handleDialogOpenChange(false);
                } catch (error) {
                  const message =
                    error instanceof Error ? error.message : 'Failed to create expense';
                  setSubmitError(message);
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <DialogHeader>
                <DialogTitle>Add Transaction</DialogTitle>
                <DialogDescription>
                  Select the type of transaction you want to create.
                </DialogDescription>
              </DialogHeader>
              <div className="py-2">
                <RadioGroup
                  value={selectedTransactionType ?? ''}
                  onValueChange={(value) => setSelectedTransactionType(value as TransactionType)}
                >
                  <div className="grid grid-cols-2 gap-4">
                    {transactionTypes.map((type) => (
                      <label
                        key={type.value}
                        htmlFor={type.value}
                        className="flex cursor-pointer items-center space-x-2 rounded-md border p-3 hover:bg-accent"
                      >
                        <RadioGroupItem value={type.value} id={type.value} />
                        <span className="flex-1 font-normal">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              {selectedTransactionType === 'EXPENSE' && (
                <section className="space-y-3 rounded-md border bg-muted/50 p-4">
                  <div className="space-y-1">
                    <Label htmlFor="expense-label">Label</Label>
                    <Input
                      id="expense-label"
                      value={expenseForm.label}
                      onChange={(event): void =>
                        setExpenseForm((previous) => ({
                          ...previous,
                          label: event.target.value,
                        }))
                      }
                      placeholder="Coffee"
                      required
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label htmlFor="expense-date">Date</Label>
                      <Input
                        id="expense-date"
                        type="date"
                        value={expenseForm.date}
                        onChange={(event): void =>
                          setExpenseForm((previous) => ({
                            ...previous,
                            date: event.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="expense-value">Amount</Label>
                      <Input
                        id="expense-value"
                        type="number"
                        min="0"
                        step="0.01"
                        value={expenseForm.value}
                        onChange={(event): void =>
                          setExpenseForm((previous) => ({
                            ...previous,
                            value: event.target.value,
                          }))
                        }
                        placeholder="5.50"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="expense-category">Category (optional)</Label>
                    <select
                      id="expense-category"
                      className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={expenseForm.categoryId}
                      onChange={(event): void =>
                        setExpenseForm((previous) => ({
                          ...previous,
                          categoryId: event.target.value,
                        }))
                      }
                      disabled={isCategoriesLoading}
                    >
                      <option value="">No category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                    {categoriesError && (
                      <p className="text-sm text-destructive">{categoriesError}</p>
                    )}
                  </div>
                </section>
              )}
              {submitError && <p className="text-sm text-destructive">{submitError}</p>}
              {selectedTransactionType && selectedTransactionType !== 'EXPENSE' && (
                <div className="rounded-md border bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">
                    Form for {selectedTransactionType.toLowerCase()} transaction will appear here.
                  </p>
                </div>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleDialogOpenChange(false)}
                >
                  Cancel
                </Button>
                {selectedTransactionType === 'EXPENSE' && (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save expense'}
                  </Button>
                )}
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <TransactionsList refreshKey={transactionsRefreshKey} />
      </main>
    </AuthGuard>
  );
}
