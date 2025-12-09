'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { Transaction } from '@/lib/types/transaction';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ColumnsProps {
  onEdit: (transactionId: string) => void;
  onDelete: (transactionId: string) => void;
  deletingTransactionId: string | null;
}

export function createSubscriptionColumns({
  onEdit,
  onDelete,
  deletingTransactionId,
}: ColumnsProps): ColumnDef<Transaction>[] {
  return [
    {
      accessorKey: 'label',
      header: 'Label',
      cell: ({ row }) => {
        return <div className="font-medium">{row.original.label}</div>;
      },
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => {
        return <div className="text-muted-foreground">{formatDate(row.original.date)}</div>;
      },
    },
    {
      accessorKey: 'isPaid',
      header: 'Status',
      cell: ({ row }) => {
        const isPaid = row.original.isPaid;
        if (isPaid === null) {
          return <div className="text-muted-foreground">-</div>;
        }
        return (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              isPaid
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {isPaid ? 'Paid' : 'Unpaid'}
          </span>
        );
      },
    },
    {
      accessorKey: 'value',
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = Math.abs(row.original.value);
        return (
          <div className="text-right text-lg font-semibold text-red-600">
            -{formatCurrency(amount)}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const transaction = row.original;
        const isDeleting = deletingTransactionId === transaction.id;
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Edit transaction"
              onClick={(): void => onEdit(transaction.id)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Delete transaction"
              disabled={isDeleting}
              onClick={(): void => onDelete(transaction.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
}
