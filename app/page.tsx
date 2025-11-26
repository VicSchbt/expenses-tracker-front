'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
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
import { getCurrentMonthTransactions } from '@/lib/api';
import type { PaginatedTransactions } from '@/lib/types/transaction';

function TransactionsList() {
  const [transactions, setTransactions] =
    useState<PaginatedTransactions | null>(null);
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
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load transactions';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="w-full max-w-4xl">
      <h1 className="mb-8 text-center text-4xl font-bold">Expense Tracker</h1>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Current Month Transactions</h2>
      </div>

      {isLoading && (
        <div className="text-center text-muted-foreground">
          Loading transactions...
        </div>
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
                      transaction.type === 'REFUND'
                        ? 'text-green-600'
                        : 'text-red-600'
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

  return (
    <AuthGuard>
      <main className="relative flex min-h-screen flex-col items-center p-8 md:p-24">
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="fixed right-8 top-8 z-40"
        >
          <Plus />
          Add Transaction
        </Button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
              <DialogDescription>
                This is where you will be able to add a new transaction. The form
                will be implemented soon.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <TransactionsList />
      </main>
    </AuthGuard>
  );
}
