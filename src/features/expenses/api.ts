export type CreateExpensePayload = {
  label: string;
  value: number; // already parsed to number
  date: string; // 'YYYY-MM-DD' (we’ll keep it date-only)
  categoryId?: string | null;
};

export type ExpenseDTO = {
  id: string;
  label: string;
  value: number;
  date: string; // ISO or date-only depending on backend
  categoryId?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

const BASE = process.env.NEXT_PUBLIC_API_URL;

export async function createExpense(payload: CreateExpensePayload): Promise<ExpenseDTO> {
  const res = await fetch(`${BASE}/api/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // harmless if you don’t use cookies; remove if unwanted
    body: JSON.stringify(payload),
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

  return body as ExpenseDTO;
}
