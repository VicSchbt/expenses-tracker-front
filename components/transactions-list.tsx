'use client';

import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { createColumns } from '@/components/transactions/columns';
import { DeleteTransactionDialog } from '@/components/transactions/delete-transaction-dialog';
import {
  EditTransactionDialog,
  type EditTransactionFormState,
} from '@/components/transactions/edit-transaction-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
  deleteTransaction,
  getCategories,
  getCurrentMonthTransactions,
  updateTransaction,
  type UpdateTransactionRequest,
} from '@/lib/api';
import type { Category } from '@/lib/types/category';
import type { MonthFilter } from '@/lib/types/month-filter';
import type { PaginatedTransactions, Transaction } from '@/lib/types/transaction';

interface TransactionsListProps {
  refreshKey: number;
  monthFilter: MonthFilter;
}

export function TransactionsList({ refreshKey, monthFilter }: TransactionsListProps) {
  const [transactions, setTransactions] = useState<PaginatedTransactions | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingTransactionId, setDeletingTransactionId] = useState<string | null>(null);
  const [deleteTransactionLabel, setDeleteTransactionLabel] = useState<string>('');
  const [deleteRecurrenceScope, setDeleteRecurrenceScope] = useState<
    'CURRENT_ONLY' | 'CURRENT_AND_FUTURE' | 'ALL'
  >('CURRENT_ONLY');
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditTransactionFormState | null>(null);
  const [isUpdatingTransaction, setIsUpdatingTransaction] = useState(false);
  const { toast } = useToast();

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

  const handleEditClick = useCallback(
    (transactionId: string): void => {
      if (!transactions) {
        return;
      }
      const transactionToEdit = transactions.data.find(
        (transaction) => transaction.id === transactionId,
      );
      if (!transactionToEdit) {
        return;
      }
      const formattedDate = new Date(transactionToEdit.date).toISOString().slice(0, 10);
      setEditingTransactionId(transactionId);
      setEditForm({
        label: transactionToEdit.label,
        date: formattedDate,
        value: transactionToEdit.value.toString(),
        categoryId: transactionToEdit.categoryId ?? '',
        recurrenceScope: 'CURRENT_ONLY',
      });
    },
    [transactions],
  );

  const handleEditFieldChange = (
    fieldName: keyof EditTransactionFormState,
    value: string,
  ): void => {
    setEditForm((previous) => {
      if (!previous) {
        return previous;
      }
      return {
        ...previous,
        [fieldName]: value,
      };
    });
  };

  const handleCancelEdit = (): void => {
    setEditingTransactionId(null);
    setEditForm(null);
  };

  const handleSubmitEdit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!editingTransactionId || !editForm) {
      return;
    }
    try {
      setIsUpdatingTransaction(true);
      const transactionToEdit = transactions?.data.find(
        (transaction) => transaction.id === editingTransactionId,
      );
      const updatePayload: UpdateTransactionRequest = {
        label: editForm.label.trim(),
        date: editForm.date,
        value: Number(editForm.value),
        categoryId: editForm.categoryId || undefined,
        recurrenceScope:
          transactionToEdit?.recurrence || transactionToEdit?.parentTransactionId
            ? editForm.recurrenceScope
            : undefined,
      };
      const updatedTransaction = await updateTransaction(editingTransactionId, updatePayload);
      setTransactions((currentTransactions) => {
        if (!currentTransactions) {
          return currentTransactions;
        }
        const updatedData = currentTransactions.data.map((transaction) =>
          transaction.id === editingTransactionId ? updatedTransaction : transaction,
        );
        return {
          ...currentTransactions,
          data: updatedData,
        };
      });
      toast({
        title: 'Transaction updated',
        description: `Transaction "${updatedTransaction.label}" has been updated successfully.`,
      });
      handleCancelEdit();
    } catch (updateError) {
      const errorMessage =
        updateError instanceof Error ? updateError.message : 'Failed to update transaction';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsUpdatingTransaction(false);
    }
  };

  const handleDeleteClick = useCallback(
    (transactionId: string): void => {
      const transactionToDelete = transactions?.data.find(
        (transaction) => transaction.id === transactionId,
      );
      if (!transactionToDelete) {
        return;
      }
      setDeleteTransactionLabel(transactionToDelete.label);
      setDeleteRecurrenceScope('CURRENT_ONLY');
      setDeletingTransactionId(transactionId);
    },
    [transactions],
  );

  const handleConfirmDelete = async (): Promise<void> => {
    if (!deletingTransactionId) {
      return;
    }
    try {
      const deleteResponse = await deleteTransaction(deletingTransactionId, deleteRecurrenceScope);
      setTransactions((currentTransactions) => {
        if (!currentTransactions) {
          return currentTransactions;
        }
        const filteredData = currentTransactions.data.filter(
          (transaction) => transaction.id !== deletingTransactionId,
        );
        return {
          ...currentTransactions,
          data: filteredData,
        };
      });
      toast({
        title: 'Transaction deleted',
        description: deleteResponse.message || 'The transaction has been deleted successfully.',
      });
      setDeletingTransactionId(null);
      setDeleteTransactionLabel('');
    } catch (deleteError) {
      const errorMessage =
        deleteError instanceof Error ? deleteError.message : 'Failed to delete transaction';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleCancelDelete = (): void => {
    setDeletingTransactionId(null);
    setDeleteTransactionLabel('');
  };

  const tableData = useMemo(() => {
    if (!transactions) {
      return [];
    }
    return transactions.data.map((transaction: Transaction) => ({
      ...transaction,
      category: findCategoryById(transaction.categoryId, categories),
    }));
  }, [transactions, categories]);

  const columns = useMemo(
    () =>
      createColumns({
        onEdit: handleEditClick,
        onDelete: handleDeleteClick,
        deletingTransactionId,
      }),
    [deletingTransactionId, handleEditClick, handleDeleteClick],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Transactions</h2>
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
            <div className="rounded-md border">
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
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
      <EditTransactionDialog
        isOpen={Boolean(editingTransactionId && editForm)}
        editForm={editForm}
        categories={categories}
        isUpdating={isUpdatingTransaction}
        hasRecurrence={Boolean(
          transactions?.data.find(
            (transaction) =>
              transaction.id === editingTransactionId &&
              (transaction.recurrence || transaction.parentTransactionId),
          ),
        )}
        onClose={handleCancelEdit}
        onSubmit={handleSubmitEdit}
        onFieldChange={handleEditFieldChange}
      />
      <DeleteTransactionDialog
        isOpen={Boolean(deletingTransactionId)}
        transactionLabel={deleteTransactionLabel}
        hasRecurrence={Boolean(
          transactions?.data.find(
            (transaction) =>
              transaction.id === deletingTransactionId &&
              (transaction.recurrence || transaction.parentTransactionId),
          ),
        )}
        recurrenceScope={deleteRecurrenceScope}
        isDeleting={false}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        onRecurrenceScopeChange={setDeleteRecurrenceScope}
      />
    </div>
  );
}
