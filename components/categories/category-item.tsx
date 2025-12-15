import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCategoryBudgetProgress } from '@/hooks/use-category-budget-progress';
import { CATEGORY_PRESET_COLORS, CATEGORY_PRESET_ICONS } from '@/lib/constants/category';
import type { Category } from '@/lib/types/category';

interface CategoryEditFormData {
  label: string;
  color: string;
  icon: string;
  budget: string;
}

interface CategoryItemProps {
  category: Category;
  isEditing: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
  onStartEdit: (category: Category) => void;
  onCancelEdit: () => void;
  onSaveEdit: (data: {
    label: string;
    color?: string;
    icon?: string;
    budget?: number | null;
  }) => Promise<void>;
  onDelete: (categoryId: string) => Promise<void>;
}

export function CategoryItem({
  category,
  isEditing,
  isDeleting,
  isUpdating,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}: CategoryItemProps): JSX.Element {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryEditFormData>({
    defaultValues: {
      label: category.label,
      color: category.color ?? '',
      icon: category.icon ?? '',
      budget: category.budget != null ? String(category.budget) : '',
    },
  });

  const watchedColor = watch('color');
  const watchedIcon = watch('icon');

  const {
    spentAmount,
    budgetConsumptionPercentage,
    isLoading: isBudgetLoading,
    error: budgetError,
  } = useCategoryBudgetProgress(category.id, category.budget);

  useEffect(() => {
    if (isEditing) {
      reset({
        label: category.label,
        color: category.color ?? '',
        icon: category.icon ?? '',
        budget: category.budget != null ? String(category.budget) : '',
      });
    }
  }, [isEditing, category, reset]);

  const onSubmitEdit = async (data: CategoryEditFormData): Promise<void> => {
    const trimmedBudget = data.budget.trim();
    const hasBudgetValue = trimmedBudget !== '';
    const parsedBudget = hasBudgetValue ? Number(trimmedBudget) : null;
    if (hasBudgetValue && Number.isNaN(parsedBudget)) {
      return;
    }
    await onSaveEdit({
      label: data.label.trim(),
      color: data.color.trim() || undefined,
      icon: data.icon.trim() || undefined,
      budget: parsedBudget,
    });
  };

  if (isEditing) {
    return (
      <li className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
        <div className="flex flex-1 items-center justify-between gap-4">
          <div className="flex-1">
            <form onSubmit={handleSubmit(onSubmitEdit)} className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  {...register('label', {
                    required: 'Category label is required',
                    validate: (value) => {
                      if (!value.trim()) {
                        return 'Category label cannot be empty';
                      }
                      return true;
                    },
                  })}
                  className="h-8 max-w-xs"
                />
                <Input {...register('icon')} placeholder="e.g. 🍔" className="h-8 w-20" />
                <Input
                  {...register('budget')}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Budget"
                  className="h-8 w-28"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    {...register('color')}
                    defaultValue="#cccccc"
                    className="h-8 w-10 cursor-pointer rounded border bg-transparent p-0"
                  />
                  <Input {...register('color')} placeholder="#FF5733" className="h-8 w-28" />
                </div>
              </div>
              {errors.label && <p className="text-xs text-destructive">{errors.label.message}</p>}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-label={`Use color ${color}`}
                      onClick={(): void => setValue('color', color)}
                      className={`h-5 w-5 rounded-full border ${
                        watchedColor === color ? 'ring-2 ring-ring ring-offset-2' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">
                  {CATEGORY_PRESET_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={(): void => setValue('icon', icon)}
                      className={`flex h-6 w-6 items-center justify-center rounded-md border text-xs ${
                        watchedIcon === icon ? 'bg-muted ring-2 ring-ring ring-offset-2' : ''
                      }`}
                      aria-label={`Use icon ${icon}`}
                    >
                      <span aria-hidden="true">{icon}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button type="submit" size="sm" disabled={isUpdating}>
                    {isUpdating ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={(): void => {
                      reset();
                      onCancelEdit();
                    }}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </li>
    );
  }

  const formattedBudget =
    category.budget != null
      ? category.budget.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
      : null;

  const formattedSpent = spentAmount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const budgetBarColor =
    budgetConsumptionPercentage >= 100
      ? 'bg-destructive'
      : budgetConsumptionPercentage >= 80
        ? 'bg-amber-500'
        : 'bg-emerald-500';

  return (
    <li className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
      <div className="flex flex-1 items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="font-medium">
              {category.icon && (
                <span className="mr-1" aria-hidden="true">
                  {category.icon}
                </span>
              )}
              {category.label}
            </p>
            {category.color && (
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
            )}
          </div>
          {category.budget != null ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-4 text-[11px] text-muted-foreground">
                <span>
                  Monthly budget:{' '}
                  {formattedBudget ? (
                    <span className="font-medium text-foreground">€{formattedBudget}</span>
                  ) : (
                    '—'
                  )}
                </span>
                <span>
                  {isBudgetLoading
                    ? 'Loading spending...'
                    : budgetError
                      ? 'Could not load spending'
                      : spentAmount === 0
                        ? 'No spending yet'
                        : `Spent: €${formattedSpent}`}
                </span>
              </div>
              {!isBudgetLoading && !budgetError && (
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full ${budgetBarColor}`}
                    style={{
                      width: `${budgetConsumptionPercentage}%`,
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No monthly budget set</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(): void => onStartEdit(category)}
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(): Promise<void> => onDelete(category.id)}
            disabled={isDeleting || isUpdating}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>
    </li>
  );
}
