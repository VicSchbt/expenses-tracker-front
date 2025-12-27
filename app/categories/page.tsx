'use client';

import { useEffect } from 'react';

import { AuthGuard } from '@/components/auth-guard';
import AddCategoryDialog from '@/components/categories/AddCategoryDialog';
import CategoriesList from '@/components/categories/CategoriesList';
import AppNavbar from '@/components/navigation/AppNavbar';
import { formatCurrency } from '@/lib/utils';
import { useCategoriesStore } from '@/store/useCategoriesStore';
import { useTransactionsStore } from '@/store/useTransactionsStore';

const CategoriesPage = () => {
  const { fetchCategories, categories, totalBudget } = useCategoriesStore();
  const { fetchIncomes, totalIncomes } = useTransactionsStore();

  useEffect(() => {
    async function fetchData() {
      try {
        await fetchCategories();
        await fetchIncomes({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 });
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchData();
  }, [fetchCategories]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <AppNavbar />
        <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 md:px-8">
          <header className="flex flex-col gap-2">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Categories & Budget</h1>
            </div>
            <div className="flex w-full gap-2">
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
          <CategoriesList categories={categories} />
        </main>
      </div>
    </AuthGuard>
  );
};

export default CategoriesPage;
