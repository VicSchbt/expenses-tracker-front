import { Transaction } from "../types";

const API_BASE_URL = "/api";
const EXPENSE_SUFFIX = "expenses";

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
  data: Omit<Transaction, "id">,
): Promise<Transaction> {
  const response = await fetch(`${API_BASE_URL}/${EXPENSE_SUFFIX}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Failed to create expense");
  }

  return response.json() as Promise<Transaction>;
}
