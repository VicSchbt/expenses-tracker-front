import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CATEGORY_PRESET_COLORS, CATEGORY_PRESET_ICONS } from '@/lib/constants/category';
import type { Category } from '@/lib/types/category';

interface CategoryEditFormData {
  label: string;
  color: string;
  icon: string;
}

interface CategoryItemProps {
  category: Category;
  isEditing: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
  onStartEdit: (category: Category) => void;
  onCancelEdit: () => void;
  onSaveEdit: (data: { label: string; color?: string; icon?: string }) => Promise<void>;
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
    },
  });

  const watchedColor = watch('color');
  const watchedIcon = watch('icon');

  useEffect(() => {
    if (isEditing) {
      reset({
        label: category.label,
        color: category.color ?? '',
        icon: category.icon ?? '',
      });
    }
  }, [isEditing, category, reset]);

  const onSubmitEdit = async (data: CategoryEditFormData): Promise<void> => {
    await onSaveEdit({
      label: data.label.trim(),
      color: data.color.trim() || undefined,
      icon: data.icon.trim() || undefined,
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

  return (
    <li className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
      <div className="flex flex-1 items-center justify-between gap-4">
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
