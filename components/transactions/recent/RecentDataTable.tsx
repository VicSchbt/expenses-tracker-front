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
import { useTransactionsStore } from '@/store/useTransactionsStore';

import createRecentTransactionsColumns from './RecentColumns';

const RecentDataTable = () => {
  const { recentTransactions, fetchRecentTransactions, isLoading, error } = useTransactionsStore();

  useEffect(() => {
    async function fetchData() {
      try {
        await fetchRecentTransactions();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load recent transactions';
      }
    }
    void fetchData();
  }, [fetchRecentTransactions]);

  const tableData = useMemo(() => {
    if (!recentTransactions || !Array.isArray(recentTransactions)) {
      return [];
    }
    return recentTransactions;
  }, [recentTransactions]);

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
