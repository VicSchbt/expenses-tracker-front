import { Transaction } from "../types";

const API_BASE_URL = "/api";
const EXPENSE_SUFFIX = "expenses";

interface CreateExpenseRequest {
  label: string;
  date: Date;
  value: number;
  categoryId?: string | null;
}

export async function getExpenses(): Promise<Transaction[]> {
  const response = await fetch(`${API_BASE_URL}/${EXPENSE_SUFFIX}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json() as Promise<Transaction[]>;
}

export async function createExpense(
  request: CreateExpenseRequest,
): Promise<Transaction> {
  const response = await fetch(`${API_BASE_URL}/${EXPENSE_SUFFIX}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  return response.json() as Promise<Transaction>;
}
