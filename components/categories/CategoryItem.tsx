import { MoreVertical, PiggyBank } from 'lucide-react';
import React from 'react';

import { Category } from '@/lib/types/category';
import { formatCurrency } from '@/lib/utils';

import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

interface CategoryItemProps {
  category: Category;
}

const CategoryItem = ({ category }: CategoryItemProps) => {
  const progress =
    category.budget != null
      ? Math.min(Number(((category.budget / category.budget) * 100).toFixed(2)), 100)
      : 0;
  const displayedProgress = progress + ' %';

  return (
    <li className="col-center relative w-full gap-2 rounded-md border bg-card p-4 text-sm">
      <Button variant="ghost" className="absolute right-1 top-1" size="icon">
        <MoreVertical />
      </Button>
      <p className="text-lg font-bold">{category.icon}</p>
      <p className="text-md text-center font-bold">{category.label}</p>
      {category.budget != null && (
        <>
          <p>{formatCurrency(category.budget ?? 0)}</p>
          <Progress value={progress} />
          <p>{displayedProgress}</p>
        </>
      )}
    </li>
  );
};

export default CategoryItem;
