const ugxNumber = new Intl.NumberFormat("en-UG", { maximumFractionDigits: 0 });

/** 150000 → "UGX 150,000" */
export function formatUGX(amount: number): string {
  return `UGX ${ugxNumber.format(Math.round(amount))}`;
}

/** Compact variant for tight spaces: 2500000 → "UGX 2.5M", 150000 → "UGX 150K". */
export function formatUGXCompact(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    return `UGX ${Number.isInteger(millions) ? millions : millions.toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    const thousands = amount / 1_000;
    return `UGX ${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}K`;
  }
  return `UGX ${Math.round(amount)}`;
}

/** "256700123456" → "+256 700 123 456" */
export function formatPhoneDisplay(phone: string): string {
  const match = /^(\d{3})(\d{3})(\d{3})(\d{3})$/.exec(phone);
  return match ? `+${match[1]} ${match[2]} ${match[3]} ${match[4]}` : `+${phone}`;
}

/**
 * Normalises the many ways Ugandans write phone numbers
 * ("0700 123 456", "+256700123456", "700123456") to "256700123456".
 * Returns `null` when the input cannot be a Ugandan mobile number.
 */
export function normalizeUgandanPhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("256")) digits = digits.slice(3);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  return /^\d{9}$/.test(digits) ? `256${digits}` : null;
}

/** "2026-10-08T10:00:00Z" → "2d ago" */
export function formatRelativeTime(isoDate: string, now: Date = new Date()): string {
  const then = new Date(isoDate).getTime();
  if (Number.isNaN(then)) return "";
  const minutes = Math.max(0, Math.floor((now.getTime() - then) / 60_000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return months < 12 ? `${months}mo ago` : `${Math.floor(months / 12)}y ago`;
}

export function pluralize(count: number, singular: string, plural: string = `${singular}s`): string {
  return count === 1 ? singular : plural;
}
