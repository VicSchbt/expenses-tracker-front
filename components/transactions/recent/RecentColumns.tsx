import { ColumnDef } from '@tanstack/react-table';

import { Category } from '@/lib/types/category';
import { Transaction } from '@/lib/types/transaction';
import { formatCurrency, formatDate, formatTransactionLabel } from '@/lib/utils';

const createRecentTransactionsColumns = (): ColumnDef<Transaction>[] => {
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
