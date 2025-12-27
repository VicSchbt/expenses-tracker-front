import { create } from 'zustand';

import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryTransactions,
  updateCategory,
} from '@/lib/api';
import { Category } from '@/lib/types/category';
import { Transaction } from '@/lib/types/transaction';

interface CategoriesStore {
  categories: Category[];
  categoryTransactions: Map<string, Transaction[]>;
  isLoading: boolean;
  error: string | null;
  isDeletingId: string | null;
  editingCategoryId: string | null;
  isUpdatingId: string | null;
  isCreatingCategory: boolean;
  createCategoryError: string | null;
  isAddCategoryFormOpen: boolean;

  fetchCategories: () => Promise<void>;
  fetchCategoryTransactions: (
    categoryId: string,
    params?: { year?: number; month?: number },
  ) => Promise<void>;

  createNewCategory: (data: {
    label: string;
    color?: string;
    icon?: string;
    budget?: number;
  }) => Promise<void>;

  updateExistingCategory: (
    categoryId: string,
    data: {
      label?: string;
      color?: string | null;
      icon?: string | null;
      budget?: number | null;
    },
  ) => Promise<void>;

  deleteExistingCategory: (categoryId: string) => Promise<boolean>;

  setEditingCategoryId: (categoryId: string | null) => void;
  setIsAddCategoryFormOpen: (isOpen: boolean) => void;
  setCreateCategoryError: (error: string | null) => void;
}

export const useCategoriesStore = create<CategoriesStore>((set, get) => ({
  categories: [],
  categoryTransactions: new Map(),
  isLoading: false,
  error: null,
  isDeletingId: null,
  editingCategoryId: null,
  isUpdatingId: null,
  isCreatingCategory: false,
  createCategoryError: null,
  isAddCategoryFormOpen: false,

  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null });
      const categories = await getCategories();
      set({ categories, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
        isLoading: false,
      });
    }
  },

  fetchCategoryTransactions: async (
    categoryId: string,
    params?: { year?: number; month?: number },
  ) => {
    try {
      set({ isLoading: true, error: null });
      const transactions = await getCategoryTransactions(categoryId, params);
      set({
        categoryTransactions: new Map(get().categoryTransactions).set(categoryId, transactions),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch category transactions',
        isLoading: false,
      });
    }
  },

  createNewCategory: async (data: {
    label: string;
    color?: string;
    icon?: string;
    budget?: number;
  }) => {
    try {
      set({ isCreatingCategory: true, createCategoryError: null });
      const newCategory = await createCategory({
        label: data.label,
        color: data.color ?? null,
        icon: data.icon ?? null,
        budget: data.budget,
      });
      set({
        categories: [...get().categories, newCategory],
        isCreatingCategory: false,
        isAddCategoryFormOpen: false,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create category';
      set({
        createCategoryError: errorMessage,
        isCreatingCategory: false,
      });
      throw error;
    }
  },

  updateExistingCategory: async (
    categoryId: string,
    data: {
      label?: string;
      color?: string | null;
      icon?: string | null;
      budget?: number | null;
    },
  ) => {
    try {
      set({ isUpdatingId: categoryId, error: null });
      const updatedCategory = await updateCategory(categoryId, data);
      set({
        categories: get().categories.map((category) =>
          category.id === categoryId ? updatedCategory : category,
        ),
        editingCategoryId: null,
        isUpdatingId: null,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update category',
        isUpdatingId: null,
      });
      throw error;
    }
  },

  deleteExistingCategory: async (categoryId: string) => {
    try {
      set({ isDeletingId: categoryId, error: null });
      await deleteCategory(categoryId);
      set({
        categories: get().categories.filter((category) => category.id !== categoryId),
        isDeletingId: null,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete category',
        isDeletingId: null,
      });
      throw error;
    }
    return true;
  },

  setEditingCategoryId: (categoryId: string | null) => {
    set({ editingCategoryId: categoryId });
  },

  setIsAddCategoryFormOpen: (isOpen: boolean) => {
    set({
      isAddCategoryFormOpen: isOpen,
      createCategoryError: isOpen ? null : get().createCategoryError,
    });
  },

  setCreateCategoryError: (error: string | null) => {
    set({ createCategoryError: error });
  },
}));
