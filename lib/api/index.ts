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
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }
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
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Failed to create expense");
  }
  return response.json() as Promise<Transaction>;
}
