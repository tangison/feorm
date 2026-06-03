/**
 * Feorm App Configuration
 *
 * Centralized runtime config pulled from environment variables.
 * Hardcoded values have been moved here for easy management.
 */

// ─── Support Contact ──────────────────────────────────────────────
// Default: Feorm support line (+264 85 341 1522)
export const SUPPORT_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP ?? "264853411522";

export const SUPPORT_PHONE =
  process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "+264853411522";

export const SUPPORT_WHATSAPP_URL = `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}`;

// ─── Escrow ────────────────────────────────────────────────────────
export const DEFAULT_ESCROW_MIN_CENTS = 50000; // N$500 minimum escrow
export const ESCROW_PERCENTAGE = 0.1; // 10% of total price

export function calculateEscrow(totalPriceCents: number): number {
  return Math.max(DEFAULT_ESCROW_MIN_CENTS, Math.round(totalPriceCents * ESCROW_PERCENTAGE));
}
