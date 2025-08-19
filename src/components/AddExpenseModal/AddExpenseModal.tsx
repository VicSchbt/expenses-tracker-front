// AddExpenseModal.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import AddExpenseForm from './AddExpenseForm';

interface AddExpenseModalProps {
  triggerLabel?: string;
  defaultOpen?: boolean;
}

export default function AddExpenseModal({
  triggerLabel = 'Add expense',
  defaultOpen = false,
}: AddExpenseModalProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button aria-haspopup="dialog" aria-expanded={open}>
          {triggerLabel}
        </Button>
      </DialogTrigger>

      <DialogContent
        aria-labelledby="add-expense-title"
        aria-describedby="add-expense-desc"
        className="sm:max-w-[520px]"
      >
        <DialogHeader>
          <DialogTitle id="add-expense-title">Add a new expense</DialogTitle>
          <DialogDescription id="add-expense-desc">
            Fill in the details below to record your expense.
          </DialogDescription>
        </DialogHeader>

        <AddExpenseForm onSubmitted={() => setOpen(false)} />

        <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          {/* The primary action lives inside the form (Submit). */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
