import React from 'react';

import { Category } from '@/lib/types/category';
import { MonthFilter } from '@/lib/types/month-filter';

import CategoryItem from './CategoryItem';

interface CategoriesListProps {
  categories: Category[];
  monthFilter: MonthFilter;
}
const CategoriesList = ({ categories, monthFilter }: CategoriesListProps) => {
  return (
    <ul className="grid grid-cols-2 gap-2 md:grid-cols-3">
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category} monthFilter={monthFilter} />
      ))}
    </ul>
  );
};

export default CategoriesList;
