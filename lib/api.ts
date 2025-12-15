import type { Category } from './types/category';
import type { MonthFilter } from './types/month-filter';
import type { SavingsGoal } from './types/savings-goal';
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

interface CreateExpenseRequest {
  label: string;
  date: string;
  value: number;
  categoryId?: string;
  isPaid?: boolean;
  recurrence?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  recurrenceEndDate?: string;
  isAuto?: boolean;
}

interface CreateIncomeRequest {
  label: string;
  date: string;
  value: number;
  recurrence?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  recurrenceEndDate?: string;
  recurrenceCount?: number;
}

interface CreateBillRequest {
  label: string;
  date: string;
  value: number;
  recurrence?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  recurrenceEndDate?: string;
  recurrenceCount?: number;
}

interface CreateSubscriptionRequest {
  label: string;
  date: string;
  value: number;
  recurrence?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  recurrenceEndDate?: string;
  recurrenceCount?: number;
}

interface CreateSavingRequest {
  goalId: string;
  value: number;
  date: string;
  isPaid?: boolean;
  recurrence?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  recurrenceEndDate?: string;
  isAuto?: boolean;
  recurrenceCount?: number;
}

interface CreateCategoryRequest {
  label: string;
  icon?: string | null;
  color?: string | null;
  budget?: number;
}

type RecurrenceType = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
type RecurrenceScope = 'CURRENT_ONLY' | 'CURRENT_AND_FUTURE' | 'ALL';

export interface UpdateTransactionRequest {
  label?: string;
  date?: string;
  value?: number;
  categoryId?: string;
  recurrence?: RecurrenceType;
  recurrenceEndDate?: string;
  recurrenceScope?: RecurrenceScope;
  isPaid?: boolean;
  dueDate?: string;
  recurrenceCount?: number;
}

interface UpdateCategoryRequest {
  label?: string;
  icon?: string | null;
  color?: string | null;
  budget?: number | null;
}

interface CreateSavingsGoalRequest {
  name: string;
  targetAmount: number;
  dueDate?: string;
}

interface UpdateSavingsGoalRequest {
  name?: string;
  targetAmount?: number;
  dueDate?: string | null;
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

export async function createIncome(request: CreateIncomeRequest): Promise<Transaction> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/transactions/income`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  return handleResponse<Transaction>(response);
}

export async function createBill(request: CreateBillRequest): Promise<Transaction> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/transactions/bill`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  return handleResponse<Transaction>(response);
}

export async function createSubscription(request: CreateSubscriptionRequest): Promise<Transaction> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/transactions/subscription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });
  return handleResponse<Transaction>(response);
}

export async function createSaving(request: CreateSavingRequest): Promise<Transaction> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }
  const response = await fetch(`${API_BASE_URL}/transactions/saving`, {
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

interface GetExpensesAndRefundsParams {
  page?: number;
  limit?: number;
  year?: number;
  month?: number;
}

export async function getExpensesAndRefunds(
  params?: GetExpensesAndRefundsParams,
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
  if (params?.year) {
    searchParams.append('year', params.year.toString());
  }
  if (params?.month) {
    searchParams.append('month', params.month.toString());
  }

  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}/transactions/expenses-refunds${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<PaginatedTransactions>(response);
}

interface GetIncomeParams {
  page?: number;
  limit?: number;
  year?: number;
  month?: number;
}

export async function getIncome(params?: GetIncomeParams): Promise<PaginatedTransactions> {
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
  if (params?.year) {
    searchParams.append('year', params.year.toString());
  }
  if (params?.month) {
    searchParams.append('month', params.month.toString());
  }

  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}/transactions/income${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<PaginatedTransactions>(response);
}

interface GetSavingsParams {
  page?: number;
  limit?: number;
  year?: number;
  month?: number;
}

export async function getSavings(params?: GetSavingsParams): Promise<PaginatedTransactions> {
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
  if (params?.year) {
    searchParams.append('year', params.year.toString());
  }
  if (params?.month) {
    searchParams.append('month', params.month.toString());
  }

  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}/transactions/savings${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<PaginatedTransactions>(response);
}

interface GetCurrentMonthIncomeParams {
  page?: number;
  limit?: number;
}

export async function getCurrentMonthIncome(
  params?: GetCurrentMonthIncomeParams,
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
  const url = `${API_BASE_URL}/transactions/income/current-month${
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

interface GetBillsParams {
  page?: number;
  limit?: number;
  year?: number;
  month?: number;
}

export async function getBills(params?: GetBillsParams): Promise<PaginatedTransactions> {
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
  if (params?.year) {
    searchParams.append('year', params.year.toString());
  }
  if (params?.month) {
    searchParams.append('month', params.month.toString());
  }

  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}/transactions/bills${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<PaginatedTransactions>(response);
}

interface GetCurrentMonthBillsParams {
  page?: number;
  limit?: number;
}

export async function getCurrentMonthBills(
  params?: GetCurrentMonthBillsParams,
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
  const url = `${API_BASE_URL}/transactions/bills/current-month${
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

interface GetSubscriptionsParams {
  page?: number;
  limit?: number;
  year?: number;
  month?: number;
}

export async function getSubscriptions(
  params?: GetSubscriptionsParams,
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
  if (params?.year) {
    searchParams.append('year', params.year.toString());
  }
  if (params?.month) {
    searchParams.append('month', params.month.toString());
  }

  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}/transactions/subscriptions${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<PaginatedTransactions>(response);
}

interface GetCurrentMonthSubscriptionsParams {
  page?: number;
  limit?: number;
}

export async function getCurrentMonthSubscriptions(
  params?: GetCurrentMonthSubscriptionsParams,
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
  const url = `${API_BASE_URL}/transactions/subscriptions/current-month${
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

export async function getCategories(): Promise<Category[]> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<Category[]>(response);
}

export async function createCategory(request: CreateCategoryRequest): Promise<Category> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  return handleResponse<Category>(response);
}

export async function updateCategory(
  id: string,
  request: UpdateCategoryRequest,
): Promise<Category> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  return handleResponse<Category>(response);
}

export async function deleteCategory(id: string): Promise<void> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  await handleResponse<{ message: string }>(response);
}

export async function getSavingsGoals(): Promise<SavingsGoal[]> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/savings-goals`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<SavingsGoal[]>(response);
}

export async function createSavingsGoal(request: CreateSavingsGoalRequest): Promise<SavingsGoal> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/savings-goals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  return handleResponse<SavingsGoal>(response);
}

export async function updateSavingsGoal(
  id: string,
  request: UpdateSavingsGoalRequest,
): Promise<SavingsGoal> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/savings-goals/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  return handleResponse<SavingsGoal>(response);
}

export async function deleteSavingsGoal(id: string): Promise<{ message: string }> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/savings-goals/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<{ message: string }>(response);
}

export async function updateTransaction(
  id: string,
  request: UpdateTransactionRequest,
): Promise<Transaction> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  return handleResponse<Transaction>(response);
}

interface DeleteResponse {
  message: string;
}

export async function deleteTransaction(
  id: string,
  recurrenceScope?: 'CURRENT_ONLY' | 'CURRENT_AND_FUTURE' | 'ALL',
): Promise<DeleteResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const searchParams = new URLSearchParams();
  if (recurrenceScope) {
    searchParams.append('recurrenceScope', recurrenceScope);
  }

  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}/transactions/${id}${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<DeleteResponse>(response);
}

export async function getAvailableMonths(): Promise<MonthFilter[]> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const response = await fetch(`${API_BASE_URL}/transactions/available-months`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<MonthFilter[]>(response);
}

interface GetCategoryTransactionsParams {
  year?: number;
  month?: number;
}

export async function getCategoryTransactions(
  id: string,
  params?: GetCategoryTransactionsParams,
): Promise<Transaction[]> {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const searchParams = new URLSearchParams();
  if (params?.year) {
    searchParams.append('year', params.year.toString());
  }
  if (params?.month) {
    searchParams.append('month', params.month.toString());
  }

  const queryString = searchParams.toString();
  const url = `${API_BASE_URL}/categories/${id}/transactions${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<Transaction[]>(response);
}
