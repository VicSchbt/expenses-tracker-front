import { Category } from '@/lib/types/category';

export const findCategoryById = (
  categoryId: string | null,
  categoriesList: Category[],
): Category | null => {
  if (!categoryId) {
    return null;
  }
  return categoriesList.find((category) => category.id === categoryId) || null;
};
