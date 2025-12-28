import { ColumnDef } from '@tanstack/react-table';

import { Category } from '@/lib/types/category';
import { Transaction } from '@/lib/types/transaction';
import {
  formatCurrency,
  formatDate,
  formatTransactionLabel,
  getCategoryBackgroundColor,
} from '@/lib/utils';

interface TransactionWithCategory extends Transaction {
  category: Category | null;
}

const createRecentTransactionsColumns = (): ColumnDef<TransactionWithCategory>[] => {
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
        return <div className="text-sm text-muted-foreground">{formatDate(row.original.date)}</div>;
      },
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => {
        const category = row.original.category;
        if (!category) {
          return <span className="text-xs text-muted-foreground">No category</span>;
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
        const isIncome = transaction.type === 'INCOME';
        const isRefund = transaction.type === 'REFUND';
        const amount = Math.abs(transaction.value);
        const isPositive = isIncome || isRefund;
        return (
          <div
            className={`text-right text-base font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}
          >
            {isPositive ? `+${formatCurrency(amount)}` : `-${formatCurrency(amount)}`}
          </div>
        );
      },
    },
  ];
};

export default createRecentTransactionsColumns;
