export type TransactionType = 'EXPENSE' | 'REFUND';

export interface Transaction {
  id: string;
  userId: string;
  label: string;
  date: string;
  value: number;
  type: TransactionType;
  categoryId: string | null;
  goalId: string | null;
  recurrence: unknown | null;
  isPaid: boolean | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedTransactions {
  data: Transaction[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
