export interface Category {
  id: string;
  userId: string;
  label: string;
  icon: string | null;
  color: string | null;
  budget: number | null;
  isBudgetOverloaded: boolean;
  budgetOverloadAmount: number | null;
}
