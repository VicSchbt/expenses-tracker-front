'use client';

import Link from 'next/link';

import { AuthGuard } from '@/components/auth-guard';
import { CategoriesSection } from '@/components/categories/categories-section';
import AppNavbar from '@/components/navigation/AppNavbar';
import { Button } from '@/components/ui/button';
import { useCategories } from '@/hooks/use-categories';

export default function CategoriesPage() {
  const {
    categories,
    isLoading,
    error,
    isDeletingId,
    editingCategoryId,
    isUpdatingId,
    isCreatingCategory,
    createCategoryError,
    isAddCategoryFormOpen,
    handleDeleteCategory,
    handleStartEditCategory,
    handleCancelEditCategory,
    handleSaveEditCategory,
    handleCreateCategory,
    handleToggleAddCategoryForm,
  } = useCategories();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 md:px-8">
          <header className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Manage categories</h1>
              <p className="text-sm text-muted-foreground">
                Create and organize the categories you use for your expenses and refunds.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/">Back to dashboard</Link>
            </Button>
          </header>

          {error && (
            <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <CategoriesSection
            categories={categories}
            isLoading={isLoading}
            isAddCategoryFormOpen={isAddCategoryFormOpen}
            createCategoryError={createCategoryError}
            isCreatingCategory={isCreatingCategory}
            editingCategoryId={editingCategoryId}
            isDeletingId={isDeletingId}
            isUpdatingId={isUpdatingId}
            onToggleAddCategoryForm={handleToggleAddCategoryForm}
            onCreateCategory={handleCreateCategory}
            onStartEdit={handleStartEditCategory}
            onCancelEdit={handleCancelEditCategory}
            onSaveEdit={handleSaveEditCategory}
            onDelete={handleDeleteCategory}
          />
        </main>
      </div>
    </AuthGuard>
  );
}
