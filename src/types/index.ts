export type Transaction = Expense | Income | Bill | Savings;

type BaseTransaction = {
  id?: string;
  label: string;
  date: string;
  value: number;
};

export type Expense = BaseTransaction & {
  type: 'expense';
  categoryId?: string;
};

export type Income = BaseTransaction & {
  type: 'income';
  source?: string;
  isRecurrent?: boolean;
  recurrenceRule?: string;
};

export type Bill = BaseTransaction & {
  type: 'bill';
  recurrenceRule: string;
  endDate?: string;
  note?: string;
};

export type Savings = BaseTransaction & {
  type: 'savings';
  goalId?: string;
};

export type Category = {
  id: string;
  name: string;
  color?: string; // For UI
  icon?: string;
};

export type Recurrence = 'daily' | 'weekly' | 'monthly' | 'yearly';
