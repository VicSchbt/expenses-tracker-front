import React, { useEffect, useMemo } from 'react';

import { Category } from '@/lib/types/category';
import { MonthFilter } from '@/lib/types/month-filter';
import { formatCurrency, getCategoryProgressBarColor } from '@/lib/utils';
import { useCategoriesStore } from '@/store/useCategoriesStore';

import { Progress } from '../ui/progress';
import CategoryDetails from './CategoryDetails';
import { getCategoryItemInfo } from './utils';

interface CategoryItemProps {
  category: Category;
  monthFilter: MonthFilter;
}

const CategoryItem = ({ category, monthFilter }: CategoryItemProps) => {
  const { fetchCategoryTransactions, isLoading, error, categoryTransactions } =
    useCategoriesStore();

  useEffect(() => {
    void fetchCategoryTransactions(category.id, {
      year: monthFilter.year,
      month: monthFilter.month,
    });
  }, [category.id, fetchCategoryTransactions, monthFilter.year, monthFilter.month]);

  const transactions = useMemo(() => {
    const transactions = categoryTransactions.get(category.id) || [];
    return transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [categoryTransactions]);

  const { progress, bgColor, totalRefunds, isBudgetOverloaded, budgetOverloadAmount } =
    getCategoryItemInfo(category, transactions);
  category.isBudgetOverloaded = isBudgetOverloaded;
  category.budgetOverloadAmount = budgetOverloadAmount;

  const formattedBudget = () => {
    if (category.isBudgetOverloaded) {
      return formatCurrency(category.budget ?? 0) + ` + ${formatCurrency(totalRefunds ?? 0)}`;
    }
    return category.budget != null ? formatCurrency(category.budget ?? 0) : 'No budget';
  };

  return (
    <li
      className="col-center w-full gap-2 rounded-md border bg-card p-2 text-sm"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <p className="text-lg font-bold">{category.icon}</p>
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-md line-clamp-1 font-bold">{category.label}</p>
          <p className="text-sm text-muted-foreground">{formattedBudget()}</p>
        </div>
        <CategoryDetails category={category} progress={progress} />
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
