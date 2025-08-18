'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Transaction } from '@/types';

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'label',
    header: 'Label',
  },
  {
    accessorKey: 'value',
    header: 'Value',
  },
  {
    accessorKey: 'date',
    header: 'Date',
  },
];
