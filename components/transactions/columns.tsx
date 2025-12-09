'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { Category } from '@/lib/types/category';
import type { Transaction } from '@/lib/types/transaction';
import {
  formatCurrency,
  formatDate,
  formatTransactionLabel,
  getCategoryBackgroundColor,
} from '@/lib/utils';

interface TransactionWithCategory extends Transaction {
  category: Category | null;
}

interface ColumnsProps {
  onEdit: (transactionId: string) => void;
  onDelete: (transactionId: string) => void;
  deletingTransactionId: string | null;
}

export function createColumns({
  onEdit,
  onDelete,
  deletingTransactionId,
}: ColumnsProps): ColumnDef<TransactionWithCategory>[] {
  return [
    {
      accessorKey: 'label',
      header: 'Label',
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div className="font-medium">
            {formatTransactionLabel(transaction.label, transaction.occurrenceNumber)}
          </div>
        );
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
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => {
        const category = row.original.category;
        if (!category) {
          return null;
        }
        return (
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
        );
      },
    },
    {
      accessorKey: 'value',
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const transaction = row.original;
        const isRefund = transaction.type === 'REFUND';
        const amount = Math.abs(transaction.value);
        return (
          <div
            className={`text-right text-lg font-semibold ${isRefund ? 'text-green-600' : 'text-red-600'}`}
          >
            {isRefund ? `+${formatCurrency(amount)}` : `-${formatCurrency(amount)}`}
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
