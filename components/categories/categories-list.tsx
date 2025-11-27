import { CategoryItem } from './category-item';
import type { Category } from '@/lib/types/category';

interface CategoriesListProps {
  categories: Category[];
  isLoading: boolean;
  editingCategoryId: string | null;
  isDeletingId: string | null;
  isUpdatingId: string | null;
  onStartEdit: (category: Category) => void;
  onCancelEdit: () => void;
  onSaveEdit: (data: { label: string; color?: string; icon?: string }) => Promise<void>;
  onDelete: (categoryId: string) => Promise<void>;
}

export function CategoriesList({
  categories,
  isLoading,
  editingCategoryId,
  isDeletingId,
  isUpdatingId,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}: CategoriesListProps): JSX.Element {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading categories...</p>;
  }

  if (categories.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        You have no categories yet. You can add them directly when creating an expense, or from
        here.
      </p>
    );
  }

  return (
    <ul className="divide-y rounded-md border bg-background">
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          category={category}
          isEditing={editingCategoryId === category.id}
          isDeleting={isDeletingId === category.id}
          isUpdating={isUpdatingId === category.id}
          onStartEdit={onStartEdit}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
