import { MoreVertical, PiggyBank } from 'lucide-react';
import React from 'react';

import { Category } from '@/lib/types/category';
import { formatCurrency, getCategoryProgressBarColor } from '@/lib/utils';

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

  const bgColor = getCategoryProgressBarColor(progress);

  return (
    <li
      className="col-center relative w-full gap-2 rounded-md border bg-card p-2 text-sm"
      style={{ backgroundColor: bgColor }}
    >
      <Button variant="ghost" className="absolute right-1 top-1" size="icon">
        <MoreVertical />
      </Button>
      <div className="flex w-full items-center gap-2">
        <p className="text-lg font-bold">{category.icon}</p>
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-md font-bold">{category.label}</p>
          <p className="text-sm text-muted-foreground">
            {category.budget != null ? formatCurrency(category.budget ?? 0) : 'No budget'}
          </p>
        </div>
      </div>
      {category.budget != null && (
        <>
          <Progress value={progress} className="h-2" />
        </>
      )}
    </li>
  );
};

export default CategoryItem;
