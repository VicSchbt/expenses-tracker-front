'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import type { TransactionType } from '@/lib/types/transaction';

import { AddTransactionDialog } from './index';

interface AddTransactionButtonProps {
  transactionType: TransactionType;
  label: string;
  onTransactionCreated: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function AddTransactionButton({
  transactionType,
  label,
  onTransactionCreated,
  variant = 'outline',
  size = 'default',
  className,
}: AddTransactionButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTransactionCreated = (): void => {
    onTransactionCreated();
    setIsDialogOpen(false);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => setIsDialogOpen(true)}
      >
        <Plus className="h-4 w-4" />
        {label}
      </Button>
      <AddTransactionDialog
        initialTransactionType={transactionType}
        onExpenseCreated={handleTransactionCreated}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}

