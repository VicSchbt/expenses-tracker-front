'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { TransactionType } from '@/lib/types/transaction';

import { AddExpenseForm } from './add-expense-form';

interface AddTransactionDialogProps {
  onExpenseCreated: () => void;
}

export function AddTransactionDialog({ onExpenseCreated }: AddTransactionDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTransactionType, setSelectedTransactionType] = useState<TransactionType | null>(
    null,
  );

  const handleDialogOpenChange = (open: boolean): void => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedTransactionType(null);
    }
  };

  const transactionTypes: Array<{
    value: TransactionType;
    label: string;
  }> = [
    { value: 'EXPENSE', label: 'Expense' },
    { value: 'INCOME', label: 'Income' },
    { value: 'BILL', label: 'Bill' },
    { value: 'SUBSCRIPTION', label: 'Subscription' },
    { value: 'SAVINGS', label: 'Savings' },
    { value: 'REFUND', label: 'Refund' },
  ];

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)} className="fixed right-8 top-8 z-40">
        <Plus />
        Add Transaction
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <section className="space-y-4">
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
              <DialogDescription>
                Select the type of transaction you want to create.
              </DialogDescription>
            </DialogHeader>
            <div className="py-2">
              <RadioGroup
                value={selectedTransactionType ?? ''}
                onValueChange={(value) => setSelectedTransactionType(value as TransactionType)}
              >
                <div className="grid grid-cols-2 gap-4">
                  {transactionTypes.map((type) => (
                    <label
                      key={type.value}
                      htmlFor={type.value}
                      className="flex cursor-pointer items-center space-x-2 rounded-md border p-3 hover:bg-accent"
                    >
                      <RadioGroupItem value={type.value} id={type.value} />
                      <span className="flex-1 font-normal">{type.label}</span>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            </div>
            {selectedTransactionType === 'EXPENSE' && (
              <AddExpenseForm
                onCancel={(): void => handleDialogOpenChange(false)}
                onSuccess={(): void => {
                  onExpenseCreated();
                  handleDialogOpenChange(false);
                }}
              />
            )}
            {selectedTransactionType && selectedTransactionType !== 'EXPENSE' && (
              <div className="rounded-md border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  Form for {selectedTransactionType.toLowerCase()} transaction will appear here.
                </p>
              </div>
            )}
          </section>
        </DialogContent>
      </Dialog>
    </>
  );
}
