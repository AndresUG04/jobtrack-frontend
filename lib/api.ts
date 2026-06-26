import type {
  Application,
  ApplicationInput,
  AuthResponse,
  PageResponse,
  Stats,
  StatusHistoryEntry,
  StatusUpdateInput,
  User,
  ApiError,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const TOKEN_KEY = "jobtrack_token";

/** Event dispatched when the API reports the token is invalid/expired (401). */
export const UNAUTHORIZED_EVENT = "jobtrack:unauthorized";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

/** A thrown error carrying the parsed backend `ApiError` shape. */
export class ApiClientError extends Error {
  status: number;
  /** Field-level validation messages from the backend, when present. */
  errors?: string[];

  constructor(payload: ApiError) {
    super(payload.message || payload.error || "Request failed");
    this.name = "ApiClientError";
    this.status = payload.status;
    this.errors = payload.errors;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Skip attaching the Authorization header (used for login/register). */
  auth?: boolean;
}

/**
 * Central fetch wrapper. Attaches auth + JSON headers, parses the response,
 * and throws a typed {@link ApiClientError} on failure. All API access in the
 * app goes through this helper — components never call `fetch` directly.
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, auth = true, headers, method = "GET", ...rest } = options;

  const finalHeaders = new Headers(headers);
  if (body !== undefined) {
    finalHeaders.set("Content-Type", "application/json");
  }
  if (auth) {
    const token = getToken();
    if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...rest,
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiClientError({
      status: 0,
      error: "Network Error",
      message:
        "Couldn't reach the server. Check your connection and try again.",
      timestamp: new Date().toISOString(),
    });
  }

  // A 401 means the token is missing/expired — notify the auth layer.
  if (response.status === 401 && typeof window !== "undefined") {
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  let data: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const payload = (
      data && typeof data === "object" ? data : {}
    ) as Partial<ApiError>;
    throw new ApiClientError({
      status: payload.status ?? response.status,
      error: payload.error ?? response.statusText,
      message:
        payload.message ??
        (typeof data === "string" && data
          ? data
          : "Something went wrong. Please try again."),
      errors: payload.errors,
      timestamp: payload.timestamp ?? new Date().toISOString(),
    });
  }

  return data as T;
}

/* -------------------------------------------------------------------------- */
/*  Auth                                                                       */
/* -------------------------------------------------------------------------- */

export function register(data: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: data,
    auth: false,
  });
}

export function login(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: data,
    auth: false,
  });
}

export function getMe(): Promise<User> {
  return request<User>("/api/auth/me");
}

/* -------------------------------------------------------------------------- */
/*  Applications                                                               */
/* -------------------------------------------------------------------------- */

export function listApplications(params: {
  status?: string;
  search?: string;
  page?: number;
  size?: number;
} = {}): Promise<PageResponse<Application>> {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.size !== undefined) query.set("size", String(params.size));
  const qs = query.toString();
  return request<PageResponse<Application>>(
    `/api/applications${qs ? `?${qs}` : ""}`,
  );
}

export function getApplication(id: number): Promise<Application> {
  return request<Application>(`/api/applications/${id}`);
}

export function createApplication(
  data: ApplicationInput,
): Promise<Application> {
  return request<Application>("/api/applications", {
    method: "POST",
    body: data,
  });
}

export function updateApplication(
  id: number,
  data: ApplicationInput,
): Promise<Application> {
  return request<Application>(`/api/applications/${id}`, {
    method: "PUT",
    body: data,
  });
}

export function updateStatus(
  id: number,
  data: StatusUpdateInput,
): Promise<Application> {
  return request<Application>(`/api/applications/${id}/status`, {
    method: "PATCH",
    body: data,
  });
}

export function deleteApplication(id: number): Promise<void> {
  return request<void>(`/api/applications/${id}`, { method: "DELETE" });
}

export function getStatusHistory(
  id: number,
): Promise<StatusHistoryEntry[]> {
  return request<StatusHistoryEntry[]>(`/api/applications/${id}/history`);
}

/* -------------------------------------------------------------------------- */
/*  Stats                                                                      */
/* -------------------------------------------------------------------------- */

export function getStats(): Promise<Stats> {
  return request<Stats>("/api/applications/stats");
}
