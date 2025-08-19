'use client';

import { useTransactionsStore } from '@/store/transactions.store';
import { columns } from './columns';
import { TransactionsDataTable } from './TransactionsDataTable';
import { useEffect } from 'react';

export default function TransactionsDataContainer() {
  const { fetchAll, transactions } = useTransactionsStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <div className="container mx-auto py-10">
      <TransactionsDataTable columns={columns} data={transactions} />
    </div>
  );
}
