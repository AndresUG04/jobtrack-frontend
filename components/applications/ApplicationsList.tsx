"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Pencil,
  Trash2,
  MapPin,
  Wifi,
  Plus,
  Inbox,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Modal } from "@/components/ui/Modal";
import {
  listApplications,
  deleteApplication,
  ApiClientError,
} from "@/lib/api";
import { STATUS_ORDER, STATUS_STYLES, formatDate } from "@/lib/utils";
import type { Application, PageResponse } from "@/lib/types";

const PAGE_SIZE = 10;

const statusFilterOptions = [
  { value: "", label: "All statuses" },
  ...STATUS_ORDER.map((s) => ({ value: s, label: STATUS_STYLES[s].label })),
];

export function ApplicationsList() {
  const router = useRouter();

  const [data, setData] = useState<PageResponse<Application> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  const [pendingDelete, setPendingDelete] = useState<Application | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce the search input (300ms) and reset to the first page.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(0);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await listApplications({
        status: status || undefined,
        search: search || undefined,
        page,
        size: PAGE_SIZE,
      });
      setData(res);
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : "Couldn't load applications.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [status, search, page]);

  useEffect(() => {
    load();
  }, [load]);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteApplication(pendingDelete.id);
      toast.success("Application deleted.");
      setPendingDelete(null);
      // If we deleted the last row on a page beyond the first, step back.
      if (data && data.content.length === 1 && page > 0) {
        setPage((p) => p - 1);
      } else {
        load();
      }
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : "Couldn't delete application.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  }

  const hasFilters = Boolean(status || search);
  const applications = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative sm:max-w-xs sm:flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search company or position…"
              className="block w-full rounded-lg border-0 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
            />
          </div>
          <div className="sm:w-48">
            <Select
              options={statusFilterOptions}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(0);
              }}
              aria-label="Filter by status"
            />
          </div>
        </div>
        <Link href="/dashboard/applications/new">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            New application
          </Button>
        </Link>
      </div>

      {/* Body */}
      {isLoading ? (
        <ListSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : applications.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm md:block">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-5 py-3">Company &amp; position</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Applied</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() =>
                      router.push(`/dashboard/applications/${app.id}`)
                    }
                    className="cursor-pointer transition-colors hover:bg-gray-50"
                  >
                    <td className="px-5 py-3">
                      <div className="font-medium text-gray-900">
                        {app.companyName}
                      </div>
                      <div className="text-gray-500">{app.position}</div>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      <div className="flex items-center gap-2">
                        {app.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            {app.location}
                          </span>
                        )}
                        {app.remote && (
                          <span className="inline-flex items-center gap-1 text-gray-500">
                            <Wifi className="h-3.5 w-3.5 text-gray-400" />
                            Remote
                          </span>
                        )}
                        {!app.location && !app.remote && (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {formatDate(app.appliedDate)}
                    </td>
                    <td className="px-5 py-3">
                      <div
                        className="flex items-center justify-end gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          href={`/dashboard/applications/${app.id}/edit`}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                          aria-label={`Edit ${app.companyName}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(app)}
                          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          aria-label={`Delete ${app.companyName}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {applications.map((app) => (
              <div
                key={app.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/dashboard/applications/${app.id}`}
                    className="min-w-0"
                  >
                    <p className="truncate font-medium text-gray-900">
                      {app.companyName}
                    </p>
                    <p className="truncate text-sm text-gray-500">
                      {app.position}
                    </p>
                  </Link>
                  <StatusBadge status={app.status} className="shrink-0" />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                    {app.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {app.location}
                      </span>
                    )}
                    {app.remote && (
                      <span className="inline-flex items-center gap-1">
                        <Wifi className="h-3 w-3" />
                        Remote
                      </span>
                    )}
                    <span>{formatDate(app.appliedDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/dashboard/applications/${app.id}/edit`}
                      className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                      aria-label={`Edit ${app.companyName}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(app)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                      aria-label={`Delete ${app.companyName}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-1">
              <p className="text-sm text-gray-500">
                Page {page + 1} of {totalPages} · {data?.totalElements}{" "}
                {data?.totalElements === 1 ? "result" : "results"}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete confirmation */}
      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => !isDeleting && setPendingDelete(null)}
        title="Delete application?"
        description={
          pendingDelete
            ? `This will permanently remove ${pendingDelete.companyName} — ${pendingDelete.position}. This action can't be undone.`
            : undefined
        }
      >
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setPendingDelete(null)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={confirmDelete}
            isLoading={isDeleting}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between border-b border-gray-100 px-5 py-4 last:border-b-0"
        >
          <div className="space-y-2">
            <div className="h-3.5 w-40 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-28 animate-pulse rounded bg-gray-100" />
          </div>
          <div className="h-5 w-20 animate-pulse rounded-full bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-red-100 bg-red-50/50 px-6 py-12 text-center">
      <AlertCircle className="h-8 w-8 text-red-500" />
      <p className="text-sm text-gray-700">{message}</p>
      <Button variant="secondary" size="sm" onClick={onRetry}>
        <Loader2 className="h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <Inbox className="h-6 w-6 text-gray-400" />
      </div>
      {hasFilters ? (
        <>
          <p className="font-medium text-gray-900">No matches</p>
          <p className="max-w-sm text-sm text-gray-500">
            No applications match your filters. Try a different search or status.
          </p>
        </>
      ) : (
        <>
          <p className="font-medium text-gray-900">No applications yet</p>
          <p className="max-w-sm text-sm text-gray-500">
            Start tracking your job hunt by adding your first application.
          </p>
          <Link href="/dashboard/applications/new" className="mt-1">
            <Button>
              <Plus className="h-4 w-4" />
              Add your first application
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
