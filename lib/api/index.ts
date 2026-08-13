import { Transaction } from "../types";

const API_BASE_URL = "/api";

interface CreateTransactionRequest {
  label: string;
  date: string;
  amount: number;
}

export async function getTransactions(): Promise<Transaction[]> {
  const response = await fetch(`${API_BASE_URL}/transactions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json() as Promise<Transaction[]>;
}

export async function createTransaction(
  request: CreateTransactionRequest,
): Promise<Transaction> {
  const response = await fetch(`${API_BASE_URL}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
  return response.json() as Promise<Transaction>;
}
