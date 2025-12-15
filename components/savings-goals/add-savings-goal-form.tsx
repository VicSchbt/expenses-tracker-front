import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddSavingsGoalFormData {
  name: string;
  targetAmount: string;
  dueDate: string;
}

interface AddSavingsGoalFormProps {
  isCreating: boolean;
  error: string | null;
  onSubmit: (data: { name: string; targetAmount: number; dueDate?: string }) => Promise<void>;
  onCancel: () => void;
}

export function AddSavingsGoalForm({
  isCreating,
  error,
  onSubmit,
  onCancel,
}: AddSavingsGoalFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddSavingsGoalFormData>({
    defaultValues: {
      name: '',
      targetAmount: '',
      dueDate: '',
    },
  });

  const handleSubmitForm = async (data: AddSavingsGoalFormData): Promise<void> => {
    await onSubmit({
      name: data.name.trim(),
      targetAmount: Number(data.targetAmount),
      dueDate: data.dueDate || undefined,
    });
    reset();
  };

  return (
    <form className="space-y-4 border-t pt-4" onSubmit={handleSubmit(handleSubmitForm)}>
      <div className="space-y-1">
        <label htmlFor="new-savings-goal-name" className="text-sm font-medium">
          Goal name
        </label>
        <Input
          id="new-savings-goal-name"
          {...register('name', {
            required: 'Goal name is required',
            validate: (value) => {
              if (!value.trim()) {
                return 'Goal name cannot be empty';
              }
              return true;
            },
          })}
          placeholder="Vacation fund"
          className="h-8"
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-1">
        <label htmlFor="new-savings-goal-target" className="text-sm font-medium">
          Target amount
        </label>
        <Input
          id="new-savings-goal-target"
          type="number"
          min="0"
          step="0.01"
          {...register('targetAmount', {
            required: 'Target amount is required',
            validate: (value) => {
              const numericValue = Number(value);
              if (Number.isNaN(numericValue) || numericValue <= 0) {
                return 'Target amount must be a positive number';
              }
              return true;
            },
          })}
          placeholder="1000"
          className="h-8"
        />
        {errors.targetAmount && (
          <p className="text-sm text-destructive">{errors.targetAmount.message}</p>
        )}
      </div>
      <div className="space-y-1">
        <label htmlFor="new-savings-goal-due-date" className="text-sm font-medium">
          Due date (optional)
        </label>
        <Input
          id="new-savings-goal-due-date"
          type="date"
          {...register('dueDate')}
          className="h-8"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={(): void => {
            reset();
            onCancel();
          }}
          disabled={isCreating}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Create goal'}
        </Button>
      </div>
    </form>
  );
}
