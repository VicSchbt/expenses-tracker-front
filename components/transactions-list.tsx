 'use client';

 import { useEffect, useState } from 'react';

 import type { Category } from '@/lib/types/category';
 import type { PaginatedTransactions } from '@/lib/types/transaction';
 import { getCategories, getCurrentMonthTransactions } from '@/lib/api';

 interface TransactionsListProps {
   refreshKey: number;
 }

 export function TransactionsList({ refreshKey }: TransactionsListProps) {
   const [transactions, setTransactions] = useState<PaginatedTransactions | null>(null);
   const [categories, setCategories] = useState<Category[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
     async function fetchTransactionsAndCategories() {
       try {
         setIsLoading(true);
         setError(null);
         const [transactionsData, categoriesData] = await Promise.all([
           getCurrentMonthTransactions({
             page: 1,
             limit: 20,
           }),
           getCategories(),
         ]);
         setTransactions(transactionsData);
         setCategories(categoriesData);
       } catch (err) {
         const errorMessage =
           err instanceof Error ? err.message : 'Failed to load transactions and categories';
         setError(errorMessage);
       } finally {
         setIsLoading(false);
       }
     }

     void fetchTransactionsAndCategories();
   }, [refreshKey]);

   const formatDate = (dateString: string): string => {
     const date = new Date(dateString);
     return date.toLocaleDateString('en-US', {
       year: 'numeric',
       month: 'short',
       day: 'numeric',
     });
   };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const findCategoryById = (
    categoryId: string | null,
    categoriesList: Category[],
  ): Category | null => {
    if (!categoryId) {
      return null;
    }
    const category = categoriesList.find((categoryItem) => categoryItem.id === categoryId);
    if (!category) {
      return null;
    }
    return category;
  };

  const getCategoryBackgroundColor = (color: string | null): string => {
    if (!color) {
      return 'rgba(229, 231, 235, 0.25)';
    }
    if (!color.startsWith('#')) {
      return color;
    }
    const hex = color.slice(1);
    if (hex.length !== 3 && hex.length !== 6) {
      return color;
    }
    const normalizedHex =
      hex.length === 3 ? hex.split('').map((value) => value + value).join('') : hex;
    const red = Number.parseInt(normalizedHex.slice(0, 2), 16);
    const green = Number.parseInt(normalizedHex.slice(2, 4), 16);
    const blue = Number.parseInt(normalizedHex.slice(4, 6), 16);
    return `rgba(${red}, ${green}, ${blue}, 0.25)`;
  };

   return (
     <div className="w-full max-w-4xl">
       <h1 className="mb-8 text-center text-4xl font-bold">Expense Tracker</h1>
       <div className="mb-6">
         <h2 className="text-2xl font-semibold">Current Month Transactions</h2>
       </div>

       {isLoading && (
         <div className="text-center text-muted-foreground">Loading transactions...</div>
       )}

       {error && (
         <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-center text-destructive">
           {error}
         </div>
       )}

       {!isLoading && !error && transactions && (
         <>
           {transactions.data.length === 0 ? (
             <div className="rounded-md border p-4 text-center text-muted-foreground">
               No transactions found for the current month.
             </div>
           ) : (
            <div className="space-y-2">
              {transactions.data.map((transaction) => {
                const category = findCategoryById(transaction.categoryId, categories);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-md border bg-card p-4"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{transaction.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(transaction.date)}
                        {category && (
                          <span
                            className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                            style={{ backgroundColor: getCategoryBackgroundColor(category.color) }}
                          >
                            {category.icon && (
                              <span className="mr-1" aria-hidden="true">
                                {category.icon}
                              </span>
                            )}
                            {category.label}
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      className={`text-lg font-semibold ${
                        transaction.type === 'REFUND' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'REFUND' ? '+' : '-'}
                      {formatCurrency(Math.abs(transaction.value))}
                    </div>
                  </div>
                );
              })}
            </div>
           )}
         </>
       )}
     </div>
   );
 }
