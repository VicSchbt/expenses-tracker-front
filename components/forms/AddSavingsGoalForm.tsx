import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { useSavingsStore } from '@/store/useSavingsStore';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface AddSavingsGoalFormProps {
  onSuccess?: () => void;
}

interface AddSavingsGoalFormData {
  name: string;
  targetAmount: string;
  dueDate?: string;
}

const AddSavingsGoalForm = ({ onSuccess }: AddSavingsGoalFormProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { createSavingsGoal, isLoading, error } = useSavingsStore();

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

  const onSubmit = async (data: AddSavingsGoalFormData) => {
    try {
      await createSavingsGoal({
        name: data.name.trim(),
        targetAmount: Number(data.targetAmount),
        dueDate: data.dueDate || undefined,
      });
      reset();
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create savings goal:', error);
    }
  };

  const handleCancel = () => {
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Savings Goal</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Savings Goal</DialogTitle>
          <DialogDescription>Create a new savings goal to track your progress.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Goal name</Label>
            <Input
              id="name"
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
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target amount</Label>
            <Input
              id="targetAmount"
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
            />
            {errors.targetAmount && (
              <p className="text-sm text-destructive">{errors.targetAmount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due date (optional)</Label>
            <Input id="dueDate" type="date" {...register('dueDate')} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSavingsGoalForm;
