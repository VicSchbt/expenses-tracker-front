import { TransactionDTO } from '@/features/expenses/api';
import { Transaction } from '@/types';

// date parser that handles ISO or 'YYYY-MM-DD'
function parseAPIDate(s: string): Date {
  // fast path: ISO with time
  if (s.includes('T')) return new Date(s);

  // date-only -> construct as local date to avoid TZ shifts in display
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function dtoToTransaction(dto: TransactionDTO): Transaction {
  return {
    id: dto.id,
    label: dto.label,
    value: dto.value,
    date: dateFmt.format(parseAPIDate(dto.date)),
    categoryId: dto.categoryId ?? undefined,
    type: 'expense',
  };
}

export function dtosToTransactions(dtos: TransactionDTO[]): Transaction[] {
  return dtos.map((d) => dtoToTransaction(d));
}

// ------- Formatting helpers (adjust to your locale/UX) -------
const moneyFmt = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 2,
});

const dateFmt = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
});
