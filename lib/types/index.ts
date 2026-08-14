export type TransactionType =
  | "EXPENSE"
  | "INCOME"
  | "BILL"
  | "SUBSCRIPTION"
  | "SAVINGS"
  | "REFUND";

export type Transaction = {
  id: string;
  label: string;
  date: Date;
  value: number;
  categoryId?: string | null;
  type: TransactionType;
};

export type Category = {
  id: string;
  label: string;
};
