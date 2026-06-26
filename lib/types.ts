export type ApplicationStatus =
  | "SAVED"
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "TECHNICAL_TEST"
  | "OFFER"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
}

export interface Application {
  id: number;
  companyName: string;
  position: string;
  status: ApplicationStatus;
  source: string | null;
  jobUrl: string | null;
  salaryRange: string | null;
  location: string | null;
  remote: boolean;
  appliedDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export interface StatusHistoryEntry {
  id: number;
  fromStatus: ApplicationStatus | null;
  toStatus: ApplicationStatus;
  note: string | null;
  changedAt: string;
}

export interface Stats {
  total: number;
  byStatus: Record<ApplicationStatus, number>;
  responseRate: number;
  activeApplications: number;
}

/** Payload for creating/updating an application — mirrors the backend `ApplicationRequest`. */
export interface ApplicationInput {
  companyName: string;
  position: string;
  status: ApplicationStatus;
  source?: string | null;
  jobUrl?: string | null;
  salaryRange?: string | null;
  location?: string | null;
  remote: boolean;
  appliedDate?: string | null;
  notes?: string | null;
}

export interface StatusUpdateInput {
  status: ApplicationStatus;
  note?: string;
}

export interface ApiError {
  status: number;
  error: string;
  message: string;
  errors?: string[];
  timestamp: string;
}
