import React from 'react';

import { Category } from '@/lib/types/category';

import CategoryItem from './CategoryItem';

interface CategoriesListProps {
  categories: Category[];
}
const CategoriesList = ({ categories }: CategoriesListProps) => {
  return (
    <ul className="grid grid-cols-2 gap-2 md:grid-cols-3">
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </ul>
  );
};

export default CategoriesList;
