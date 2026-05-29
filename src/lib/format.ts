/**
 * Format a price in Namibian cents to a display string.
 * Example: 15000 → "N$ 150"
 */
export function formatPrice(cents: number): string {
  return `N$ ${(cents / 100).toLocaleString()}`;
}
