import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CATEGORY_PRESET_COLORS, CATEGORY_PRESET_ICONS } from '@/lib/constants/category';

interface AddCategoryFormData {
  label: string;
  color: string;
  icon: string;
  budget: string;
}

interface AddCategoryFormProps {
  isCreating: boolean;
  error: string | null;
  onSubmit: (data: {
    label: string;
    color?: string;
    icon?: string;
    budget?: number;
  }) => Promise<void>;
  onCancel: () => void;
}

export function AddCategoryForm({
  isCreating,
  error,
  onSubmit,
  onCancel,
}: AddCategoryFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<AddCategoryFormData>({
    defaultValues: {
      label: '',
      color: '',
      icon: '',
      budget: '',
    },
  });

  const watchedColor = watch('color');
  const watchedIcon = watch('icon');

  const onSubmitForm = async (data: AddCategoryFormData): Promise<void> => {
    const trimmedBudget = data.budget.trim();
    const hasBudgetValue = trimmedBudget !== '';
    const parsedBudget = hasBudgetValue ? Number(trimmedBudget) : undefined;
    if (hasBudgetValue && Number.isNaN(parsedBudget)) {
      return;
    }
    await onSubmit({
      label: data.label.trim(),
      color: data.color.trim() || undefined,
      icon: data.icon.trim() || undefined,
      budget: parsedBudget,
    });
    reset();
  };

  return (
    <form className="space-y-4 border-t pt-4" onSubmit={handleSubmit(onSubmitForm)}>
      <div className="space-y-1">
        <label htmlFor="new-category-label" className="text-sm font-medium">
          Category name
        </label>
        <Input
          id="new-category-label"
          {...register('label', {
            required: 'Category label is required',
            validate: (value) => {
              if (!value.trim()) {
                return 'Category label cannot be empty';
              }
              return true;
            },
          })}
          placeholder="Groceries"
          className="h-8"
        />
        {errors.label && <p className="text-sm text-destructive">{errors.label.message}</p>}
      </div>
      <div className="space-y-1">
        <label htmlFor="new-category-icon" className="text-sm font-medium">
          Icon (emoji, optional)
        </label>
        <div className="space-y-2">
          <Input
            id="new-category-icon"
            {...register('icon')}
            placeholder="e.g. 🍔"
            className="h-8"
          />
          <div className="flex flex-wrap gap-1">
            {CATEGORY_PRESET_ICONS.map((presetIcon) => (
              <button
                key={presetIcon}
                type="button"
                onClick={(): void => setValue('icon', presetIcon)}
                className={`flex h-7 w-7 items-center justify-center rounded-md border text-base ${
                  watchedIcon === presetIcon ? 'bg-muted ring-2 ring-ring ring-offset-2' : ''
                }`}
                aria-label={`Use icon ${presetIcon}`}
              >
                <span aria-hidden="true">{presetIcon}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <label htmlFor="new-category-budget" className="text-sm font-medium">
          Monthly budget (optional)
        </label>
        <Input
          id="new-category-budget"
          type="number"
          step="0.01"
          min="0"
          {...register('budget')}
          placeholder="e.g. 500"
          className="h-8"
        />
        <p className="text-xs text-muted-foreground">
          Leave empty if you do not want to set a budget for this category.
        </p>
      </div>
      <div className="space-y-1">
        <label htmlFor="new-category-color" className="text-sm font-medium">
          Color (optional)
        </label>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <input
              id="new-category-color"
              type="color"
              {...register('color')}
              className="h-8 w-10 cursor-pointer rounded border bg-transparent p-0"
            />
            <Input {...register('color')} placeholder="#FF5733" className="h-8 flex-1" />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_PRESET_COLORS.map((presetColor) => (
              <button
                key={presetColor}
                type="button"
                aria-label={`Use color ${presetColor}`}
                onClick={(): void => setValue('color', presetColor)}
                className={`h-6 w-6 rounded-full border ${
                  watchedColor === presetColor ? 'ring-2 ring-ring ring-offset-2' : ''
                }`}
                style={{ backgroundColor: presetColor }}
              />
            ))}
          </div>
        </div>
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
          {isCreating ? 'Creating...' : 'Create category'}
        </Button>
      </div>
    </form>
  );
}
