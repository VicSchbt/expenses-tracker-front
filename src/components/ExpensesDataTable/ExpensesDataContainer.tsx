'use client';

import { useTransactionsStore } from '@/store/transactions.store';
import { columns } from './columns';
import { ExpensesDataTable } from './ExpensesDataTable';
import { useEffect } from 'react';

export default function ExpensesDataContainer() {
  const { fetchAll, transactions } = useTransactionsStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <div className="container mx-auto py-10">
      <ExpensesDataTable columns={columns} data={transactions} />
    </div>
  );
}
