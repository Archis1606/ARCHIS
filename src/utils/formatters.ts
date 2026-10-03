/**
 * Utility formatters for land parcel data display
 */

export function formatCurrency(value: number | undefined | null): string {
  if (value === undefined || value === null) return 'Not Available';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatArea(area: number | undefined | null, unit: string = 'Acres'): string {
  if (area === undefined || area === null) return 'Not Available';
  return `${area.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unit}`;
}

export function formatPercentage(value: number | undefined | null): string {
  if (value === undefined || value === null) return 'Not Available';
  return `${value.toFixed(2)}%`;
}

export function formatNumber(value: number | undefined | null): string {
  if (value === undefined || value === null) return 'Not Available';
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return 'Not Available';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'Not Available';
  }
}

export function formatDateTime(dateString: string | undefined | null): string {
  if (!dateString) return 'Not Available';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Not Available';
  }
}

export function getSafeValue<T>(value: T | undefined | null, fallback: string = 'Not Available'): T | string {
  if (value === undefined || value === null || value === '') return fallback;
  return value;
}