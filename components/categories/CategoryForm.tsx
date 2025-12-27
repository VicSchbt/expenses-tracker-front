import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { CATEGORY_PRESET_COLORS, CATEGORY_PRESET_ICONS } from '@/lib/constants/category';
import { Category } from '@/lib/types/category';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface CategoryFormData {
  label: string;
  color: string;
  icon: string;
  budget: string;
}

interface CategoryFormProps {
  mode: 'create' | 'edit';
  category?: Category;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (data: {
    label: string;
    color?: string | null;
    icon?: string | null;
    budget?: number | null;
  }) => Promise<void>;
  onCancel: () => void;
}

export function CategoryForm({
  mode,
  category,
  isSubmitting,
  error,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const isEditMode = mode === 'edit';
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: {
      label: category?.label ?? '',
      color: category?.color ?? '',
      icon: category?.icon ?? '',
      budget: category?.budget != null ? String(category?.budget) : '',
    },
  });

  const watchedColor = watch('color');
  const watchedIcon = watch('icon');

  useEffect(() => {
    if (isEditMode && category) {
      reset({
        label: category.label,
        color: category.color ?? '',
        icon: category.icon ?? '',
        budget: category.budget != null ? String(category.budget) : '',
      });
    }
  }, [category, reset, isEditMode]);

  const onSubmitForm = async (data: CategoryFormData): Promise<void> => {
    const trimmedBudget = data.budget.trim();
    const hasBudgetValue = trimmedBudget !== '';
    const parsedBudget = hasBudgetValue ? Number(trimmedBudget) : null;
    if (hasBudgetValue && Number.isNaN(parsedBudget)) {
      return;
    }
    await onSubmit({
      label: data.label.trim(),
      color: data.color.trim() || null,
      icon: data.icon.trim() || null,
      budget: parsedBudget,
    });
    if (isEditMode) {
      reset();
    }
  };

  const idPrefix = isEditMode ? 'edit' : 'create';

  return (
    <form
      className={`space-y-4 pt-4 ${!isEditMode ? 'border-t' : ''}`}
      onSubmit={handleSubmit(onSubmitForm)}
    >
      <div className="space-y-1">
        <Label htmlFor={`${idPrefix}-category-label`} className="text-sm font-medium">
          Category name
        </Label>
        <Input
          id={`${idPrefix}-category-label`}
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
        <Label htmlFor={`${idPrefix}-category-icon`} className="text-sm font-medium">
          Icon (emoji, optional)
        </Label>
        <div className="space-y-2">
          <Input
            id={`${idPrefix}-category-icon`}
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
        <Label htmlFor={`${idPrefix}-category-budget`} className="text-sm font-medium">
          Monthly budget (optional)
        </Label>
        <Input
          id={`${idPrefix}-category-budget`}
          type="number"
          step="0.01"
          min="0"
          {...register('budget')}
          placeholder="e.g. 500"
          className="h-8"
        />
        <p className="text-xs text-muted-foreground">
          Leave empty to remove budget for this category.
        </p>
      </div>
      <div className="space-y-1">
        <Label htmlFor={`${idPrefix}-category-color`} className="text-sm font-medium">
          Color (optional)
        </Label>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <input
              id={`${idPrefix}-category-color`}
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
          onClick={() => {
            if (!isEditMode) reset();
            onCancel();
          }}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditMode
              ? 'Saving...'
              : 'Creating...'
            : isEditMode
              ? 'Save changes'
              : 'Create category'}
        </Button>
      </div>
    </form>
  );
}

export default CategoryForm;
