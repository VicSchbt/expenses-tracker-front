import type { PaginatedTransactions, Transaction } from './types/transaction';

const API_BASE_URL = '/api';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
  };
}

interface ApiError {
  message: string;
  statusCode: number;
}

export async function loginUser(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse<LoginResponse>(response);
}

export async function registerUser(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse<LoginResponse>(response);
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('authToken');
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem('authToken', token);
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem('authToken');
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData: ApiError | null = null;
    try {
      errorData = (await response.json()) as ApiError;
    } catch {
      errorData = {
        message: 'An error occurred',
        statusCode: response.status,
      };
    }
    if (response.status === 401) {
      removeAuthToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error(errorData.message || 'Authentication required');
    }
    throw new Error(errorData.message || 'An error occurred');
  }
  return response.json() as Promise<T>;
}

interface CreateExpenseRequest {
  label: string;
  date: string;
  value: number;
  categoryId?: string;
}

export async function createExpense(request: CreateExpenseRequest): Promise<Transaction> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/transactions/expense`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  return handleResponse<Transaction>(response);
}

interface GetCurrentMonthTransactionsParams {
  page?: number;
  limit?: number;
}

export async function getCurrentMonthTransactions(
  params?: GetCurrentMonthTransactionsParams,
): Promise<PaginatedTransactions> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const searchParams = new URLSearchParams();
  if (params?.page) {
    searchParams.append('page', params.page.toString());
  }
  if (params?.limit) {
    searchParams.append('limit', params.limit.toString());
  }

  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}/transactions/expenses-refunds/current-month${
    queryString ? `?${queryString}` : ''
  }`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<PaginatedTransactions>(response);
}
