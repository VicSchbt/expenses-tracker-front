import React from 'react';

import { Transaction } from '@/lib/types/transaction';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

interface TransactionLineProps {
  transaction: Transaction;
}

const TransactionLine = ({ transaction }: TransactionLineProps) => {
  const colorMap = {
    SAVINGS: transaction.isPaid ? 'text-green-600' : 'text-muted-foreground',
    REFUND: 'text-green-600',
    EXPENSE: 'text-red-600',
  };
  const colorClass = colorMap[transaction.type as keyof typeof colorMap] || 'text-foreground';

  return (
    <li
      key={transaction.id}
      className="flex flex-row items-center justify-between rounded-md border border-border p-2"
    >
      <div className="flex flex-col">
        <p className="font-medium">{transaction.label}</p>
        <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
      </div>
      <p className={cn('text-lg font-semibold', colorClass)}>{formatCurrency(transaction.value)}</p>
    </li>
  );
};

export default TransactionLine;
