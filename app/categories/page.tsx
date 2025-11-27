'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { AppNavbar } from '@/components/app-navbar';
import { AuthGuard } from '@/components/auth-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { deleteCategory, getCategories, updateCategory } from '@/lib/api';
import type { Category } from '@/lib/types/category';

const CATEGORY_PRESET_COLORS: readonly string[] = [
  '#FF5733',
  '#F39C12',
  '#F1C40F',
  '#27AE60',
  '#2ECC71',
  '#16A085',
  '#2980B9',
  '#3498DB',
  '#8E44AD',
  '#9B59B6',
  '#E67E22',
  '#D35400',
  '#C0392B',
  '#E74C3C',
  '#7F8C8D',
  '#95A5A6',
  '#34495E',
  '#2C3E50',
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryLabel, setEditingCategoryLabel] = useState('');
  const [editingCategoryColor, setEditingCategoryColor] = useState<string>('');
  const [editingCategoryIcon, setEditingCategoryIcon] = useState<string>('');
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load categories';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    void fetchCategories();
  }, []);

  const handleDeleteCategory = async (categoryId: string): Promise<void> => {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this category? Existing transactions will keep their amounts but lose this category.',
    );
    if (!isConfirmed) {
      return;
    }
    setIsDeletingId(categoryId);
    try {
      await deleteCategory(categoryId);
      setCategories((previous) => previous.filter((category) => category.id !== categoryId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete category';
      setError(message);
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleStartEditCategory = (category: Category): void => {
    setEditingCategoryId(category.id);
    setEditingCategoryLabel(category.label);
    setEditingCategoryColor(category.color ?? '');
    setEditingCategoryIcon(category.icon ?? '');
  };

  const handleCancelEditCategory = (): void => {
    setEditingCategoryId(null);
    setEditingCategoryLabel('');
    setEditingCategoryColor('');
    setEditingCategoryIcon('');
  };

  const handleSaveEditCategory = async (): Promise<void> => {
    if (!editingCategoryId || !editingCategoryLabel.trim()) {
      return;
    }
    setIsUpdatingId(editingCategoryId);
    try {
      const updatedCategory = await updateCategory(editingCategoryId, {
        label: editingCategoryLabel.trim(),
        color: editingCategoryColor.trim() || null,
        icon: editingCategoryIcon.trim() || null,
      });
      setCategories((previous) =>
        previous.map((category) =>
          category.id === updatedCategory.id ? updatedCategory : category,
        ),
      );
      setEditingCategoryId(null);
      setEditingCategoryLabel('');
      setEditingCategoryColor('');
      setEditingCategoryIcon('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update category';
      setError(message);
    } finally {
      setIsUpdatingId(null);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <AppNavbar />
        <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 md:px-8">
          <header className="flex items-center justify-between">
            <div>
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

          <section className="space-y-3 rounded-md border bg-muted/40 p-4">
            <h2 className="text-lg font-semibold">Existing categories</h2>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading categories...</p>
            ) : categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You have no categories yet. You can add them directly when creating an expense, or
                from here.
              </p>
            ) : (
              <ul className="divide-y rounded-md border bg-background">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
                  >
                    <div className="flex flex-1 items-center justify-between gap-4">
                      <div className="flex-1">
                        {editingCategoryId === category.id ? (
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <Input
                                value={editingCategoryLabel}
                                onChange={(event): void =>
                                  setEditingCategoryLabel(event.target.value)
                                }
                                className="h-8 max-w-xs"
                              />
                              <Input
                                value={editingCategoryIcon}
                                onChange={(event): void =>
                                  setEditingCategoryIcon(event.target.value)
                                }
                                placeholder="e.g. 🍔"
                                className="h-8 w-20"
                              />
                              <div className="flex items-center gap-2">
                                <input
                                  type="color"
                                  value={editingCategoryColor || '#cccccc'}
                                  onChange={(event): void =>
                                    setEditingCategoryColor(event.target.value)
                                  }
                                  className="h-8 w-10 cursor-pointer rounded border bg-transparent p-0"
                                />
                                <Input
                                  value={editingCategoryColor}
                                  onChange={(event): void =>
                                    setEditingCategoryColor(event.target.value)
                                  }
                                  placeholder="#FF5733"
                                  className="h-8 w-28"
                                />
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="flex flex-wrap gap-2">
                                {CATEGORY_PRESET_COLORS.map((color) => (
                                  <button
                                    key={color}
                                    type="button"
                                    aria-label={`Use color ${color}`}
                                    onClick={(): void => setEditingCategoryColor(color)}
                                    className={`h-5 w-5 rounded-full border ${
                                      editingCategoryColor === color
                                        ? 'ring-2 ring-ring ring-offset-2'
                                        : ''
                                    }`}
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {[
                                  '🍔',
                                  '🍕',
                                  '🍣',
                                  '☕️',
                                  '🍺',
                                  '🛒',
                                  '🚗',
                                  '🏠',
                                  '💡',
                                  '📱',
                                  '🐈 ',
                                ].map((icon) => (
                                  <button
                                    key={icon}
                                    type="button"
                                    onClick={(): void => setEditingCategoryIcon(icon)}
                                    className={`flex h-6 w-6 items-center justify-center rounded-md border text-xs ${
                                      editingCategoryIcon === icon
                                        ? 'bg-muted ring-2 ring-ring ring-offset-2'
                                        : ''
                                    }`}
                                    aria-label={`Use icon ${icon}`}
                                  >
                                    <span aria-hidden="true">{icon}</span>
                                  </button>
                                ))}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={handleSaveEditCategory}
                                  disabled={isUpdatingId === category.id}
                                >
                                  {isUpdatingId === category.id ? 'Saving...' : 'Save'}
                                </Button>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancelEditCategory}
                                  disabled={isUpdatingId === category.id}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="font-medium">
                              {category.icon && (
                                <span className="mr-1" aria-hidden="true">
                                  {category.icon}
                                </span>
                              )}
                              {category.label}
                            </p>
                            {category.color && (
                              <span className="mt-1 inline-flex items-center gap-2 text-xs text-muted-foreground">
                                <span
                                  className="inline-block h-3 w-3 rounded-full"
                                  style={{ backgroundColor: category.color }}
                                />
                                {category.color}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {editingCategoryId !== category.id && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={(): void => handleStartEditCategory(category)}
                          >
                            Edit
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(): Promise<void> => handleDeleteCategory(category.id)}
                          disabled={isDeletingId === category.id || isUpdatingId === category.id}
                        >
                          {isDeletingId === category.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="space-y-3 rounded-md border bg-muted/40 p-4">
            <h2 className="text-lg font-semibold">How to add or edit categories</h2>
            <p className="text-sm text-muted-foreground">
              To add new categories or change their names, use the expense creation dialog. When you
              create or edit an expense, choose{' '}
              <span className="font-medium">+ Add new category</span> from the category dropdown.
            </p>
            <div className="space-y-1 rounded-md border border-dashed bg-background p-3 text-xs text-muted-foreground">
              <p className="font-medium">Tip</p>
              <p>
                Categories are shared across all your expenses and refunds. Deleting a category will
                not delete past transactions, but they will no longer show this category.
              </p>
            </div>
          </section>
        </main>
      </div>
    </AuthGuard>
  );
}
