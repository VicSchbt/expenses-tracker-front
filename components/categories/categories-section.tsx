import { Button } from '@/components/ui/button';
import { AddCategoryForm } from './add-category-form';
import { CategoriesList } from './categories-list';
import type { Category } from '@/lib/types/category';

interface CategoriesSectionProps {
  categories: Category[];
  isLoading: boolean;
  isAddCategoryFormOpen: boolean;
  createCategoryError: string | null;
  isCreatingCategory: boolean;
  editingCategoryId: string | null;
  isDeletingId: string | null;
  isUpdatingId: string | null;
  onToggleAddCategoryForm: () => void;
  onCreateCategory: (data: { label: string; color?: string; icon?: string }) => Promise<void>;
  onStartEdit: (category: Category) => void;
  onCancelEdit: () => void;
  onSaveEdit: (data: { label: string; color?: string; icon?: string }) => Promise<void>;
  onDelete: (categoryId: string) => Promise<void>;
}

export function CategoriesSection({
  categories,
  isLoading,
  isAddCategoryFormOpen,
  createCategoryError,
  isCreatingCategory,
  editingCategoryId,
  isDeletingId,
  isUpdatingId,
  onToggleAddCategoryForm,
  onCreateCategory,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}: CategoriesSectionProps): JSX.Element {
  return (
    <section className="space-y-3 rounded-md border bg-muted/40 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Categories</h2>
        <Button type="button" onClick={onToggleAddCategoryForm}>
          {isAddCategoryFormOpen ? 'Cancel' : 'Add a category'}
        </Button>
      </div>
      {isAddCategoryFormOpen && (
        <AddCategoryForm
          error={createCategoryError}
          isCreating={isCreatingCategory}
          onSubmit={onCreateCategory}
          onCancel={onToggleAddCategoryForm}
        />
      )}
      <div className={isAddCategoryFormOpen ? 'mt-4 border-t pt-4' : 'mt-4 pt-4'}>
        <h2 className="mb-3 text-lg font-semibold">Existing categories</h2>
        <CategoriesList
          categories={categories}
          isLoading={isLoading}
          editingCategoryId={editingCategoryId}
          isDeletingId={isDeletingId}
          isUpdatingId={isUpdatingId}
          onStartEdit={onStartEdit}
          onCancelEdit={onCancelEdit}
          onSaveEdit={onSaveEdit}
          onDelete={onDelete}
        />
      </div>
    </section>
  );
}
