'use client';

import { useEffect } from 'react';
import Link from 'next/link';

import { AuthGuard } from '@/components/auth-guard';
import { CategoriesSection } from '@/components/categories/categories-section';
import CategoriesList from '@/components/categories/CategoriesList';
import AppNavbar from '@/components/navigation/AppNavbar';
import { Button } from '@/components/ui/button';
import { useCategoriesStore } from '@/store/useCategoriesStore';

const CategoriesPage = () => {
  const { fetchCategories, categories } = useCategoriesStore();

  useEffect(() => {
    async function fetchData() {
      try {
        await fetchCategories();
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
          <header className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Categories & Budget</h1>
            </div>
          </header>

          <CategoriesList categories={categories} />
        </main>
      </div>
    </AuthGuard>
  );
};

export default CategoriesPage;
