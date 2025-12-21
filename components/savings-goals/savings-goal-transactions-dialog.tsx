'use client';

import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getSavingsGoalTransactions } from '@/lib/api';
import type { SavingsGoal } from '@/lib/types/savings-goal';
import type { Transaction } from '@/lib/types/transaction';
import { formatCurrency, formatDate } from '@/lib/utils';

interface SavingsGoalTransactionsDialogProps {
  goal: SavingsGoal | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SavingsGoalTransactionsDialog({
  goal,
  isOpen,
  onClose,
}: SavingsGoalTransactionsDialogProps): JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !goal) {
      return;
    }
    async function fetchTransactions(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getSavingsGoalTransactions(goal.id);
        setTransactions(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load transactions';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
    void fetchTransactions();
  }, [isOpen, goal]);

  const columns = useMemo(() => {
    return [
      {
        accessorKey: 'label',
        header: 'Label',
        cell: ({ row }: { row: { original: Transaction } }) => {
          return <div className="font-medium">{row.original.label}</div>;
        },
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }: { row: { original: Transaction } }) => {
          return <div className="text-muted-foreground">{formatDate(row.original.date)}</div>;
        },
      },
      {
        accessorKey: 'value',
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }: { row: { original: Transaction } }) => {
          const amount = Math.abs(row.original.value);
          return (
            <div className="text-right text-lg font-semibold text-green-600">
              +{formatCurrency(amount)}
            </div>
          );
        },
      },
    ];
  }, []);

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {goal ? `Transactions for "${goal.name}"` : 'Savings Goal Transactions'}
          </DialogTitle>
          <DialogDescription>All transactions related to this savings goal.</DialogDescription>
        </DialogHeader>
        {isLoading && <p className="text-sm text-muted-foreground">Loading transactions...</p>}
        {error && (
          <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        {!isLoading && !error && transactions.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No transactions found for this savings goal.
          </p>
        )}
        {!isLoading && !error && transactions.length > 0 && (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
