"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  RefreshCw,
  ExternalLink,
  MapPin,
  Wifi,
  DollarSign,
  CalendarDays,
  Tag,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/applications/StatusBadge";
import { StatusUpdateModal } from "@/components/applications/StatusUpdateModal";
import { StatusHistory } from "@/components/applications/StatusHistory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  getApplication,
  getStatusHistory,
  deleteApplication,
  ApiClientError,
} from "@/lib/api";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { Application, StatusHistoryEntry } from "@/lib/types";

export default function ApplicationDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const router = useRouter();

  const [application, setApplication] = useState<Application | null>(null);
  const [history, setHistory] = useState<StatusHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const load = useCallback(async () => {
    if (!Number.isFinite(id)) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const [app, hist] = await Promise.all([
        getApplication(id),
        getStatusHistory(id).catch(() => [] as StatusHistoryEntry[]),
      ]);
      setApplication(app);
      setHistory(hist);
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 404) {
        setNotFound(true);
      } else {
        setError(
          err instanceof ApiClientError
            ? err.message
            : "Couldn't load this application.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await deleteApplication(id);
      toast.success("Application deleted.");
      router.push("/dashboard/applications");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : "Couldn't delete application.";
      toast.error(message);
      setIsDeleting(false);
    }
  }

  function handleStatusUpdated(updated: Application) {
    setApplication(updated);
    // Refresh history to include the new entry.
    getStatusHistory(id)
      .then(setHistory)
      .catch(() => {});
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="text-lg font-semibold text-slate-900">
          Application not found
        </p>
        <p className="mt-1 text-sm text-slate-500">
          It may have been deleted, or the link is incorrect.
        </p>
        <Link href="/dashboard/applications" className="mt-5 inline-block">
          <Button variant="secondary">
            <ArrowLeft className="h-4 w-4" />
            Back to applications
          </Button>
        </Link>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-red-100 bg-red-50/50 px-6 py-12 text-center">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="text-sm text-slate-700">{error}</p>
        <Button variant="secondary" size="sm" onClick={load}>
          <Loader2 className="h-4 w-4" />
          Try again
        </Button>
      </div>
    );
  }

  const details = [
    { icon: Tag, label: "Source", value: application.source },
    { icon: MapPin, label: "Location", value: application.location },
    {
      icon: Wifi,
      label: "Remote",
      value: application.remote ? "Yes" : "No",
    },
    { icon: DollarSign, label: "Salary range", value: application.salaryRange },
    {
      icon: CalendarDays,
      label: "Applied date",
      value: application.appliedDate
        ? formatDate(application.appliedDate)
        : null,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/dashboard/applications"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to applications
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {application.position}
            </h1>
            <StatusBadge status={application.status} />
          </div>
          <p className="mt-1 text-slate-600">{application.companyName}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setStatusModalOpen(true)}
          >
            <RefreshCw className="h-4 w-4" />
            Update status
          </Button>
          <Link href={`/dashboard/applications/${application.id}/edit`}>
            <Button variant="secondary" size="sm">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmDelete(true)}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Details */}
        <div className="space-y-6 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                {details.map((d) => (
                  <div key={d.label}>
                    <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                      <d.icon className="h-3.5 w-3.5" />
                      {d.label}
                    </dt>
                    <dd className="mt-1 text-sm text-slate-900">
                      {d.value || <span className="text-slate-400">—</span>}
                    </dd>
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Job posting
                  </dt>
                  <dd className="mt-1 text-sm">
                    {application.jobUrl ? (
                      <a
                        href={application.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 break-all text-blue-600 hover:text-blue-700"
                      >
                        {application.jobUrl}
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {application.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-slate-700">
                  {application.notes}
                </p>
              </CardContent>
            </Card>
          )}

          <p className="text-xs text-slate-400">
            Created {formatDateTime(application.createdAt)} · Last updated{" "}
            {formatDateTime(application.updatedAt)}
          </p>
        </div>

        {/* History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Status history</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusHistory entries={history} />
            </CardContent>
          </Card>
        </div>
      </div>

      <StatusUpdateModal
        open={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        application={application}
        onUpdated={handleStatusUpdated}
      />

      <Modal
        open={confirmDelete}
        onClose={() => !isDeleting && setConfirmDelete(false)}
        title="Delete application?"
        description={`This will permanently remove ${application.companyName} — ${application.position}. This action can't be undone.`}
      >
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => setConfirmDelete(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
