import type { ApplicationStatus } from "./types";

/** Tiny className combiner — joins truthy values with a space. */
export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

/** All statuses in their natural pipeline order. */
export const STATUS_ORDER: ApplicationStatus[] = [
  "SAVED",
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "TECHNICAL_TEST",
  "OFFER",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
];

/** Statuses that represent an application still "in flight". */
export const ACTIVE_STATUSES: ApplicationStatus[] = [
  "SAVED",
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "TECHNICAL_TEST",
  "OFFER",
];

interface StatusStyle {
  /** Human-friendly label. */
  label: string;
  /** Badge classes: background + text + ring. */
  badge: string;
  /** Solid dot/bar color for charts and indicators. */
  dot: string;
  /** Bar fill color for the distribution view. */
  bar: string;
}

/**
 * Status → Tailwind color mapping (see SPEC "STATUS COLOR MAPPING").
 * Used consistently across StatusBadge, StatusDistribution, and history.
 */
export const STATUS_STYLES: Record<ApplicationStatus, StatusStyle> = {
  SAVED: {
    label: "Saved",
    badge: "bg-gray-100 text-gray-700 ring-gray-500/20",
    dot: "bg-gray-400",
    bar: "bg-gray-400",
  },
  APPLIED: {
    label: "Applied",
    badge: "bg-blue-100 text-blue-700 ring-blue-600/20",
    dot: "bg-blue-500",
    bar: "bg-blue-500",
  },
  SCREENING: {
    label: "Screening",
    badge: "bg-indigo-100 text-indigo-700 ring-indigo-600/20",
    dot: "bg-indigo-500",
    bar: "bg-indigo-500",
  },
  INTERVIEW: {
    label: "Interview",
    badge: "bg-purple-100 text-purple-700 ring-purple-600/20",
    dot: "bg-purple-500",
    bar: "bg-purple-500",
  },
  TECHNICAL_TEST: {
    label: "Technical Test",
    badge: "bg-violet-100 text-violet-700 ring-violet-600/20",
    dot: "bg-violet-500",
    bar: "bg-violet-500",
  },
  OFFER: {
    label: "Offer",
    badge: "bg-green-100 text-green-700 ring-green-600/20",
    dot: "bg-green-500",
    bar: "bg-green-500",
  },
  ACCEPTED: {
    label: "Accepted",
    badge: "bg-emerald-100 text-emerald-700 ring-emerald-600/20",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
  },
  REJECTED: {
    label: "Rejected",
    badge: "bg-red-100 text-red-700 ring-red-600/20",
    dot: "bg-red-500",
    bar: "bg-red-500",
  },
  WITHDRAWN: {
    label: "Withdrawn",
    badge: "bg-gray-100 text-gray-500 ring-gray-400/20",
    dot: "bg-gray-300",
    bar: "bg-gray-300",
  },
};

export function statusLabel(status: ApplicationStatus): string {
  return STATUS_STYLES[status].label;
}

/** Format an ISO date(-time) string as e.g. "Jun 26, 2026". Returns "—" when empty. */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Format an ISO date-time as e.g. "Jun 26, 2026 · 2:30 PM". */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
