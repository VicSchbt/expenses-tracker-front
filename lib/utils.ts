import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}

export function getCategoryBackgroundColor(color: string | null): string {
  if (!color) {
    return 'rgba(229, 231, 235, 0.25)';
  }
  if (!color.startsWith('#')) {
    return color;
  }
  const hex = color.slice(1);
  if (hex.length !== 3 && hex.length !== 6) {
    return color;
  }
  const normalizedHex =
    hex.length === 3
      ? hex
          .split('')
          .map((value) => value + value)
          .join('')
      : hex;
  const red = Number.parseInt(normalizedHex.slice(0, 2), 16);
  const green = Number.parseInt(normalizedHex.slice(2, 4), 16);
  const blue = Number.parseInt(normalizedHex.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, 0.25)`;
}

export function formatTransactionLabel(label: string, occurrenceNumber: string | null): string {
  if (!occurrenceNumber) {
    return label;
  }
  // Validate occurrenceNumber format - should be "current/total" (e.g., "1/12", "3/4")
  // Reject if it contains "undefined" or doesn't match the expected pattern
  if (occurrenceNumber.includes('undefined') || !/^\d+\/\d+$/.test(occurrenceNumber)) {
    return label;
  }
  return `${label} ${occurrenceNumber}`;
}

// Calculate background color from green to red based on progress, and make it lighter using rgba with opacity
// progress: 0 -> green, 100 -> red
// We interpolate from green (#22c55e, rgb(34,197,94)) to red (#ef4444, rgb(239,68,68))
// The result uses alpha for a lighter, softer look
export function getCategoryProgressBarColor(progress: number) {
  // Ensure progress between 0 and 100
  const p = Math.max(0, Math.min(progress, 100)) / 100;

  // Green: 34,197,94   Red: 239,68,68
  const r = Math.round(34 + (239 - 34) * p);
  const g = Math.round(197 + (68 - 197) * p);
  const b = Math.round(94 + (68 - 94) * p);

  // Use an alpha (opacity) value less than 1 for a lighter color, e.g. 0.25
  return `rgba(${r},${g},${b},0.25)`;
}
