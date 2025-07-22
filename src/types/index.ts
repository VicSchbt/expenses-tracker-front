type Transaction = Expense | Income | Bill | Savings;

type BaseTransaction = {
  id: string;
  label: string;
  date: string;
  value: number;
};

type Expense = BaseTransaction & {
  type: 'expense';
  categoryId: string;
};

type Income = BaseTransaction & {
  type: 'income';
  source?: string;
  isRecurrent?: boolean;
  recurrenceRule?: string;
};

type Bill = BaseTransaction & {
  type: 'bill';
  recurrenceRule: string;
  endDate?: string;
  note?: string;
};

type Savings = BaseTransaction & {
  type: 'savings';
  goalId?: string;
};

type Category = {
  id: string;
  name: string;
  color?: string; // For UI
  icon?: string;
};

type Recurrence = 'daily' | 'weekly' | 'monthly' | 'yearly';
