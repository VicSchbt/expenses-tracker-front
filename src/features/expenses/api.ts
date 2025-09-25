'use client';

import { dtosToTransactions } from '@/mappers/transaction';
import { useAuthStore } from '@/store/auth.store';
import { Transaction } from '@/types';

export type CreateExpensePayload = {
  label: string;
  value: number; // already parsed to number
  date: string; // 'YYYY-MM-DD' (we’ll keep it date-only)
  categoryId?: string | null;
};

// transport only, not used in the app
export type TransactionDTO = {
  id: string;
  label: string;
  value: number;
  date: string; // ISO or date-only depending on backend
  categoryId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

// helper to inject Authorization header if present
function authHeader() {
  const token = useAuthStore.getState().token; // "Basic <base64>"
  return token ? { Authorization: token } : {};
}

const BASE = process.env.NEXT_PUBLIC_API_URL;

export async function createExpense(payload: CreateExpensePayload): Promise<TransactionDTO> {
  const res = await fetch(`${BASE}/api/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  // Robust error handling
  let body: any = null;
  try {
    body = await res.json();
  } catch {
    /* non-JSON response */
  }

  if (!res.ok) {
    const msg = body?.message || body?.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return body as TransactionDTO;
}

export async function getTransactions(): Promise<Transaction[]> {
  const res = await fetch(`${BASE}/api/transactions`, {
    headers: { ...authHeader() },
    cache: 'no-store',
  });

  let body: any = null;
  try {
    body = await res.json();
  } catch {}

  if (!res.ok) {
    const msg = body?.message || body?.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return dtosToTransactions(body as TransactionDTO[]);
}
