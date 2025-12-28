import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useMemo } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCategoriesStore } from '@/store/useCategoriesStore';
import { useTransactionsStore } from '@/store/useTransactionsStore';

import createRecentTransactionsColumns from './RecentColumns';
import { findCategoryById } from './utils';

const RecentDataTable = () => {
  const { recentTransactions, fetchRecentTransactions, isLoading, error } = useTransactionsStore();
  const { categories, fetchCategories } = useCategoriesStore();

  useEffect(() => {
    async function fetchData() {
      try {
        await Promise.all([fetchCategories(), fetchRecentTransactions()]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load recent transactions';
      }
    }
    void fetchData();
  }, [fetchRecentTransactions, fetchCategories]);

  const tableData = useMemo(() => {
    if (!recentTransactions || !Array.isArray(recentTransactions)) {
      return [];
    }
    return recentTransactions.map((transaction) => ({
      ...transaction,
      category: findCategoryById(transaction.categoryId, categories),
    }));
  }, [recentTransactions, categories]);

  const columns = useMemo(() => {
    return createRecentTransactionsColumns();
  }, []);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Loading recent transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (
    !recentTransactions ||
    !Array.isArray(recentTransactions) ||
    recentTransactions.length === 0
  ) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No recent transactions found</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentDataTable;
