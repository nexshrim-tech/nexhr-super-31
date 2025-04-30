
/**
 * Format a number as a currency value
 * @param value The number to format
 * @param decimals Number of decimal places (default: 0)
 * @returns Formatted currency string without the currency symbol
 */
export const formatCurrency = (value: number, decimals = 0): string => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format a date to a readable string
 * @param date The date to format
 * @param format The format to use (default: 'MMM dd, yyyy')
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
};
