'use client';

import { useEffect, useState } from 'react';

import { AuthGuard } from '@/components/auth-guard';
import AddCategoryDialog from '@/components/categories/AddCategoryDialog';
import CategoriesList from '@/components/categories/CategoriesList';
import { MonthTabs } from '@/components/month-tabs';
import AppNavbar from '@/components/navigation/AppNavbar';
import { MonthFilter } from '@/lib/types/month-filter';
import { formatCurrency } from '@/lib/utils';
import { useCategoriesStore } from '@/store/useCategoriesStore';
import { useTransactionsStore } from '@/store/useTransactionsStore';

const CategoriesPage = () => {
  const { fetchCategories, categories, totalBudget } = useCategoriesStore();
  const { fetchIncomes, totalIncomes } = useTransactionsStore();
  const [monthFilter, setMonthFilter] = useState<MonthFilter>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });
  useEffect(() => {
    async function fetchData() {
      try {
        await fetchCategories();
        await fetchIncomes({ year: monthFilter.year, month: monthFilter.month });
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchData();
  }, [fetchCategories, monthFilter.year, monthFilter.month]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <AppNavbar />
        <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 md:px-8">
          <header className="flex flex-col gap-2">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Categories & Budget</h1>
            </div>
            <MonthTabs monthFilter={monthFilter} onMonthFilterChange={setMonthFilter} />
            <div className="flex w-full flex-col gap-2 md:flex-row">
              <div className="flex-1 rounded-md border p-2">
                <p className="text-sm text-muted-foreground">Total budget:</p>
                <p className="text-xl font-bold">{formatCurrency(totalBudget)}</p>
              </div>
              <div className="flex-1 rounded-md border p-2">
                <p className="text-sm text-muted-foreground">Total income:</p>
                <p className="text-xl font-bold">{formatCurrency(totalIncomes)}</p>
              </div>
            </div>
          </header>
          <AddCategoryDialog />
          <CategoriesList categories={categories} monthFilter={monthFilter} />
        </main>
      </div>
    </AuthGuard>
  );
};

export default CategoriesPage;
