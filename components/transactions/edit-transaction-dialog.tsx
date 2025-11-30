import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { Category } from '@/lib/types/category';

export interface EditTransactionFormState {
  label: string;
  date: string;
  value: string;
  categoryId: string;
  recurrenceScope?: 'CURRENT_ONLY' | 'CURRENT_AND_FUTURE' | 'ALL';
}

interface EditTransactionDialogProps {
  isOpen: boolean;
  editForm: EditTransactionFormState | null;
  categories: Category[];
  isUpdating: boolean;
  hasRecurrence?: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onFieldChange: (fieldName: keyof EditTransactionFormState, value: string) => void;
}

const RECURRENCE_SCOPE_OPTIONS: Array<{
  value: 'CURRENT_ONLY' | 'CURRENT_AND_FUTURE' | 'ALL';
  label: string;
  description: string;
}> = [
  {
    value: 'CURRENT_ONLY',
    label: 'This instance only',
    description: 'Update only this transaction',
  },
  {
    value: 'CURRENT_AND_FUTURE',
    label: 'This and future instances',
    description: 'Update this transaction and all future recurring instances',
  },
  {
    value: 'ALL',
    label: 'All instances',
    description: 'Update all instances in this recurring series',
  },
];

export function EditTransactionDialog({
  isOpen,
  editForm,
  categories,
  isUpdating,
  hasRecurrence = false,
  onClose,
  onSubmit,
  onFieldChange,
}: EditTransactionDialogProps): JSX.Element {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isDialogOpen): void => {
        if (!isDialogOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit transaction</DialogTitle>
          <DialogDescription>Update the details of your transaction.</DialogDescription>
        </DialogHeader>
        {editForm && (
          <form className="space-y-4" onSubmit={onSubmit}>
            <section className="space-y-3 rounded-md border bg-muted/50 p-4">
              <div className="space-y-1">
                <Label htmlFor="edit-transaction-label">Label</Label>
                <Input
                  id="edit-transaction-label"
                  value={editForm.label}
                  onChange={(event): void => onFieldChange('label', event.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label htmlFor="edit-transaction-date">Date</Label>
                  <Input
                    id="edit-transaction-date"
                    type="date"
                    value={editForm.date}
                    onChange={(event): void => onFieldChange('date', event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="edit-transaction-value">Amount</Label>
                  <Input
                    id="edit-transaction-value"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.value}
                    onChange={(event): void => onFieldChange('value', event.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="edit-transaction-category">Category (optional)</Label>
                <select
                  id="edit-transaction-category"
                  className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={editForm.categoryId}
                  onChange={(event): void => onFieldChange('categoryId', event.target.value)}
                >
                  <option value="">No category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon ? `${category.icon} ${category.label}` : category.label}
                    </option>
                  ))}
                </select>
              </div>
            </section>
            {hasRecurrence && (
              <section className="space-y-3 rounded-md border bg-muted/50 p-4">
                <div className="space-y-1">
                  <Label htmlFor="edit-transaction-recurrence-scope">
                    Update scope (for recurring transactions)
                  </Label>
                  <select
                    id="edit-transaction-recurrence-scope"
                    className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={editForm.recurrenceScope || 'CURRENT_ONLY'}
                    onChange={(event): void =>
                      onFieldChange(
                        'recurrenceScope',
                        event.target.value as 'CURRENT_ONLY' | 'CURRENT_AND_FUTURE' | 'ALL',
                      )
                    }
                  >
                    {RECURRENCE_SCOPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    {
                      RECURRENCE_SCOPE_OPTIONS.find(
                        (opt) => opt.value === (editForm.recurrenceScope || 'CURRENT_ONLY'),
                      )?.description
                    }
                  </p>
                </div>
              </section>
            )}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}


