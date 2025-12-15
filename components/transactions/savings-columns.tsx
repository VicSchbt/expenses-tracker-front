'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { Transaction } from '@/lib/types/transaction';
import { formatCurrency, formatDate } from '@/lib/utils';

interface SavingsColumnsProps {
  onEdit: (transactionId: string) => void;
  onDelete: (transactionId: string) => void;
  deletingTransactionId: string | null;
}

export function createSavingsColumns({
  onEdit,
  onDelete,
  deletingTransactionId,
}: SavingsColumnsProps): ColumnDef<Transaction>[] {
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
      accessorKey: 'value',
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = Math.abs(row.original.value);
        return (
          <div className="text-right text-lg font-semibold text-green-600">
            +{formatCurrency(amount)}
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
