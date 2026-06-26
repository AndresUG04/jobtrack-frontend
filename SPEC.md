# JOBTRACK FRONTEND — SPECIFICATION

Next.js + TypeScript frontend for the JobTrack API. Single source of truth for architecture, pages, and API integration.

Backend repo: https://github.com/AndresUG04/jobtrack-api
Backend live: https://jobtrack-api-l102.onrender.com
Backend docs: https://jobtrack-api-l102.onrender.com/swagger-ui.html

---

## STACK

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form + Zod (forms and validation)
- Lucide React (icons)
- Native fetch API (no axios)
- localStorage for JWT token persistence

No state management library — React Context is enough for auth.

---

## ARCHITECTURE

```
User → Pages (App Router) → API client (lib/api.ts) → JobTrack API
                ↓
        Auth Context (lib/auth-context.tsx)
                ↓
        localStorage (token persistence)
```

Rules:
- All API calls go through `lib/api.ts`. No `fetch()` directly in components.
- JWT token lives in `localStorage` under key `jobtrack_token`.
- Auth state managed by `AuthContext`, consumed via `useAuth()` hook.
- Protected pages use a `<ProtectedRoute>` wrapper that redirects to `/login` if no token.
- All forms validated with Zod schemas, never trust client-side state.

---

## FOLDER STRUCTURE

```
jobtrack-frontend/
├── app/
│   ├── layout.tsx                  Root layout with AuthProvider
│   ├── page.tsx                    Landing page (redirects to /dashboard if logged in)
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx              Protected layout with sidebar/navbar
│   │   ├── page.tsx                Stats overview
│   │   └── applications/
│   │       ├── page.tsx            List with filters and pagination
│   │       ├── new/
│   │       │   └── page.tsx        Create form
│   │       └── [id]/
│   │           ├── page.tsx        Detail view with history
│   │           └── edit/
│   │               └── page.tsx    Edit form
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Modal.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── applications/
│   │   ├── ApplicationCard.tsx
│   │   ├── ApplicationForm.tsx
│   │   ├── ApplicationsList.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── StatusUpdateModal.tsx
│   │   └── StatusHistory.tsx
│   ├── dashboard/
│   │   ├── StatsCards.tsx
│   │   └── StatusDistribution.tsx
│   └── layout/
│       ├── Navbar.tsx
│       └── Sidebar.tsx
├── lib/
│   ├── api.ts
│   ├── auth-context.tsx
│   ├── types.ts
│   ├── schemas.ts
│   └── utils.ts
├── .env.local
└── SPEC.md
```

---

## TYPES (`lib/types.ts`)

```ts
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

export interface ApiError {
  status: number;
  error: string;
  message: string;
  errors?: string[];
  timestamp: string;
}
```

---

## API CLIENT (`lib/api.ts`)

Base URL from `process.env.NEXT_PUBLIC_API_URL`.

Helper function `request<T>(endpoint, options)`:
- Reads token from `localStorage`
- Adds `Authorization: Bearer <token>` header if token exists
- Adds `Content-Type: application/json` for non-GET requests
- Throws an `ApiError` if response is not ok
- Parses JSON and returns typed result

Exported functions:

```ts
// Auth
register(data: { name: string; email: string; password: string }): Promise<AuthResponse>
login(data: { email: string; password: string }): Promise<AuthResponse>
getMe(): Promise<User>

// Applications
listApplications(params?: { status?: string; search?: string; page?: number; size?: number }): Promise<PageResponse<Application>>
getApplication(id: number): Promise<Application>
createApplication(data: ApplicationInput): Promise<Application>
updateApplication(id: number, data: ApplicationInput): Promise<Application>
updateStatus(id: number, data: { status: ApplicationStatus; note?: string }): Promise<Application>
deleteApplication(id: number): Promise<void>
getStatusHistory(id: number): Promise<StatusHistoryEntry[]>

// Stats
getStats(): Promise<Stats>
```

`ApplicationInput` matches `ApplicationRequest` from the backend (all fields except id/createdAt/updatedAt).

---

## VALIDATION SCHEMAS (`lib/schemas.ts`)

Zod schemas that match the backend validation rules exactly:

- `loginSchema`: email (valid email format), password (min 1)
- `registerSchema`: name (min 2, max 100), email, password (min 8)
- `applicationSchema`:
  - companyName (min 1, max 150)
  - position (min 1, max 150)
  - status (enum)
  - source (optional)
  - jobUrl (optional, must be valid URL if present)
  - salaryRange (optional)
  - location (optional)
  - remote (boolean)
  - appliedDate (optional, past or present)
  - notes (optional)
- `statusUpdateSchema`: status (enum), note (optional, max 500)

---

## AUTH CONTEXT (`lib/auth-context.tsx`)

```ts
interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login(token: string, user: { email: string; name: string }): void;
  logout(): void;
}
```

Behavior:
- On mount, read token from `localStorage`. If exists, call `getMe()` to validate and load user.
- If token is invalid (401), clear it and set user to null.
- `login()` saves token to `localStorage` and updates state.
- `logout()` clears token from `localStorage`, resets state, redirects to `/login`.

---

## PAGES

### `/` (Landing)
If logged in, redirect to `/dashboard`. Otherwise show a simple landing with project description, GitHub link, and CTAs to login/register. Mention this is a portfolio project consuming the JobTrack API.

### `/login`
Form: email, password. On success, save token via AuthContext and redirect to `/dashboard`. Show validation errors and API errors clearly.

### `/register`
Form: name, email, password. On success, save token and redirect to `/dashboard`.

### `/dashboard` (Protected)
Layout with navbar (logo, user email, logout button). Stats overview with cards (Total, Active, Response rate) and a status distribution view. "New application" CTA. Recent applications list (last 5) linking to the full list.

### `/dashboard/applications` (Protected)
List with pagination (10 per page). Filter by status (dropdown with all statuses + "All"). Search by company/position (debounced input). Each row: company, position, status badge, applied date, location, remote indicator. Click row to open detail. Edit and Delete icons per row.

### `/dashboard/applications/new` (Protected)
Full form with all fields. Status defaults to SAVED. On submit, redirect to detail view of created application.

### `/dashboard/applications/[id]` (Protected)
All application fields displayed. Status badge prominent. "Update status" button opens a modal (select new status + optional note). Status history timeline (most recent first). Edit and Delete buttons. Delete shows confirmation dialog.

### `/dashboard/applications/[id]/edit` (Protected)
Same form as new, pre-populated. On submit, redirect back to detail view.

---

## STATUS COLOR MAPPING

In `lib/utils.ts`:

```
SAVED          → gray
APPLIED        → blue
SCREENING      → indigo
INTERVIEW      → purple
TECHNICAL_TEST → violet
OFFER          → green
ACCEPTED       → emerald
REJECTED       → red
WITHDRAWN      → gray (muted)
```

Use Tailwind classes consistently across `StatusBadge` and other status indicators.

---

## UX REQUIREMENTS

- Loading states for every async action (button spinners, page loaders)
- Empty states when there are no applications (with CTA to create the first one)
- Error states with retry buttons
- Toast notifications for create/update/delete success and errors
- Confirmation before destructive actions (delete)
- Form errors shown inline below fields
- Mobile responsive (test at 375px, 768px, 1024px)

---

## ERROR HANDLING

- API errors caught in `request()` helper and re-thrown as typed `ApiError`
- Components catch errors with try/catch and show toast or inline message
- 401 errors automatically trigger logout via AuthContext
- Validation errors from backend (`errors[]` array) shown next to relevant fields when possible

---

## STYLING GUIDELINES

- Clean, professional, recruiter-friendly aesthetic
- Use Tailwind utility classes; no custom CSS unless necessary
- Consistent spacing (Tailwind scale: 4, 6, 8, 12 most common)
- Buttons: primary (filled), secondary (outlined), destructive (red)
- Cards with subtle shadows and rounded corners
- Generous whitespace
- Sans-serif font (Inter via next/font is the default)

---

## DEPLOYMENT

Target: Vercel.

Environment variable in Vercel:
- `NEXT_PUBLIC_API_URL` = `https://jobtrack-api-l102.onrender.com`

After deploy, add the Vercel URL to the backend's `ALLOWED_ORIGINS` env var on Render so CORS allows the production frontend.

---

## OUT OF SCOPE

- Refresh tokens / token refresh logic (backend doesn't support it yet)
- Admin panel
- Bulk operations
- Export to CSV
- Email notifications
- Reminders feature (backend doesn't expose it)
- Multi-language support
