export interface MonthlyBalance {
  year: number;
  month: number;
  // Net balance fields (backend may use different names)
  closingBalance?: number;
  balance?: number;
  netBalance?: number;
  // Additional breakdown fields
  openingBalance?: number;
  totalIncome?: number;
  totalExpenses?: number;
}
