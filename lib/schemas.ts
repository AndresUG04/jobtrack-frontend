import { z } from "zod";
import { STATUS_ORDER } from "./utils";
import type { ApplicationStatus } from "./types";

const statusEnum = z.enum(
  STATUS_ORDER as [ApplicationStatus, ...ApplicationStatus[]],
);

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Application form schema. Optional text fields stay as (possibly empty)
 * strings so the form's input and output types match — react-hook-form needs
 * them to be identical. Empty strings are normalized to `null` at submit time.
 */
export const applicationSchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .max(150, "Must be at most 150 characters"),
  position: z
    .string()
    .trim()
    .min(1, "Position is required")
    .max(150, "Must be at most 150 characters"),
  status: statusEnum,
  source: z.string().trim().max(150, "Must be at most 150 characters"),
  jobUrl: z
    .string()
    .trim()
    .refine((v) => v === "" || isHttpUrl(v), {
      message: "Enter a valid URL (including https://)",
    }),
  salaryRange: z.string().trim().max(100, "Must be at most 100 characters"),
  location: z.string().trim().max(150, "Must be at most 150 characters"),
  remote: z.boolean(),
  appliedDate: z.string().refine(
    (v) => {
      if (!v) return true;
      const date = new Date(v);
      if (Number.isNaN(date.getTime())) return false;
      // Past or present only — a date picked "today" is < now (later in the day).
      return date <= new Date();
    },
    { message: "Date can't be in the future" },
  ),
  notes: z.string().trim().max(2000, "Must be at most 2000 characters"),
});

export const statusUpdateSchema = z.object({
  status: statusEnum,
  note: z.string().trim().max(500, "Note must be at most 500 characters"),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ApplicationValues = z.infer<typeof applicationSchema>;
export type StatusUpdateValues = z.infer<typeof statusUpdateSchema>;
