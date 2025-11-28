import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { Category } from '@/lib/types/category';
import type { Transaction } from '@/lib/types/transaction';

interface TransactionItemProps {
  transaction: Transaction;
  category: Category | null;
  isDeleting: boolean;
  formatDate: (dateString: string) => string;
  formatCurrency: (value: number) => string;
  getCategoryBackgroundColor: (color: string | null) => string;
  onEdit: (transactionId: string) => void;
  onDelete: (transactionId: string) => void;
}

export function TransactionItem({
  transaction,
  category,
  isDeleting,
  formatDate,
  formatCurrency,
  getCategoryBackgroundColor,
  onEdit,
  onDelete,
}: TransactionItemProps): JSX.Element {
  const isRefund = transaction.type === 'REFUND';
  return (
    <div
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
          onClick={(): void => onEdit(transaction.id)}
        >
          <Pencil />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Delete transaction"
          disabled={isDeleting}
          onClick={(): void => onDelete(transaction.id)}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}


