import { useEffect, useState } from 'react';

import { createCategory, deleteCategory, getCategories, updateCategory } from '@/lib/api';
import type { Category } from '@/lib/types/category';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [createCategoryError, setCreateCategoryError] = useState<string | null>(null);
  const [isAddCategoryFormOpen, setIsAddCategoryFormOpen] = useState(false);

  useEffect(() => {
    async function fetchCategories(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load categories';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchCategories();
  }, []);

  const handleDeleteCategory = async (categoryId: string): Promise<void> => {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this category? Existing transactions will keep their amounts but lose this category.',
    );
    if (!isConfirmed) {
      return;
    }
    setIsDeletingId(categoryId);
    try {
      await deleteCategory(categoryId);
      setCategories((previous) => previous.filter((category) => category.id !== categoryId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete category';
      setError(message);
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleStartEditCategory = (category: Category): void => {
    setEditingCategoryId(category.id);
  };

  const handleCancelEditCategory = (): void => {
    setEditingCategoryId(null);
  };

  const handleSaveEditCategory = async (data: {
    label: string;
    color?: string;
    icon?: string;
  }): Promise<void> => {
    if (!editingCategoryId) {
      return;
    }
    setIsUpdatingId(editingCategoryId);
    try {
      const updatedCategory = await updateCategory(editingCategoryId, {
        label: data.label,
        color: data.color ?? null,
        icon: data.icon ?? null,
      });
      setCategories((previous) =>
        previous.map((category) =>
          category.id === updatedCategory.id ? updatedCategory : category,
        ),
      );
      setEditingCategoryId(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update category';
      setError(message);
      throw err;
    } finally {
      setIsUpdatingId(null);
    }
  };

  const handleCreateCategory = async (data: {
    label: string;
    color?: string;
    icon?: string;
  }): Promise<void> => {
    setCreateCategoryError(null);
    setIsCreatingCategory(true);
    try {
      const createdCategory = await createCategory({
        label: data.label,
        color: data.color,
        icon: data.icon,
      });
      setCategories((previous) => [...previous, createdCategory]);
      setIsAddCategoryFormOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create category';
      setCreateCategoryError(message);
      throw err;
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleToggleAddCategoryForm = (): void => {
    setIsAddCategoryFormOpen((previous) => !previous);
    if (isAddCategoryFormOpen) {
      setCreateCategoryError(null);
    }
  };

  return {
    categories,
    isLoading,
    error,
    isDeletingId,
    editingCategoryId,
    isUpdatingId,
    isCreatingCategory,
    createCategoryError,
    isAddCategoryFormOpen,
    setCreateCategoryError,
    handleDeleteCategory,
    handleStartEditCategory,
    handleCancelEditCategory,
    handleSaveEditCategory,
    handleCreateCategory,
    handleToggleAddCategoryForm,
  };
}

