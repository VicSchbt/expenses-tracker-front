'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const RECURRENCE_SCOPE_OPTIONS: Array<{
  value: 'CURRENT_ONLY' | 'CURRENT_AND_FUTURE' | 'ALL';
  label: string;
  description: string;
}> = [
  {
    value: 'CURRENT_ONLY',
    label: 'This instance only',
    description: 'Delete only this transaction',
  },
  {
    value: 'CURRENT_AND_FUTURE',
    label: 'This and future instances',
    description: 'Delete this transaction and all future recurring instances',
  },
  {
    value: 'ALL',
    label: 'All instances',
    description: 'Delete all instances in this recurring series',
  },
];

interface DeleteTransactionDialogProps {
  isOpen: boolean;
  transactionLabel: string;
  hasRecurrence: boolean;
  recurrenceScope: 'CURRENT_ONLY' | 'CURRENT_AND_FUTURE' | 'ALL';
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onRecurrenceScopeChange: (scope: 'CURRENT_ONLY' | 'CURRENT_AND_FUTURE' | 'ALL') => void;
}

export function DeleteTransactionDialog({
  isOpen,
  transactionLabel,
  hasRecurrence,
  recurrenceScope,
  isDeleting,
  onClose,
  onConfirm,
  onRecurrenceScopeChange,
}: DeleteTransactionDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Delete transaction</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{transactionLabel}"?
            {hasRecurrence && ' This is a recurring transaction.'}
          </DialogDescription>
        </DialogHeader>
        {hasRecurrence && (
          <div className="space-y-3 rounded-md border bg-muted/50 p-4">
            <div className="space-y-1">
              <Label htmlFor="delete-recurrence-scope">Delete scope</Label>
              <select
                id="delete-recurrence-scope"
                className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={recurrenceScope}
                onChange={(event) =>
                  onRecurrenceScopeChange(
                    event.target.value as 'CURRENT_ONLY' | 'CURRENT_AND_FUTURE' | 'ALL',
                  )
                }
                disabled={isDeleting}
              >
                {RECURRENCE_SCOPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                {
                  RECURRENCE_SCOPE_OPTIONS.find((opt) => opt.value === recurrenceScope)
                    ?.description
                }
              </p>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

