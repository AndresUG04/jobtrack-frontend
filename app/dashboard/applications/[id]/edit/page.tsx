"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { ApplicationForm } from "@/components/applications/ApplicationForm";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getApplication, ApiClientError } from "@/lib/api";
import type { Application } from "@/lib/types";

export default function EditApplicationPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    if (!Number.isFinite(id)) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const app = await getApplication(id);
      setApplication(app);
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

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href={`/dashboard/applications/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to application
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
          Edit application
        </h1>
      </div>

      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-blue-500" />
        </div>
      ) : notFound ? (
        <div className="py-16 text-center">
          <p className="text-lg font-semibold text-slate-900">
            Application not found
          </p>
          <Link href="/dashboard/applications" className="mt-5 inline-block">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              Back to applications
            </Button>
          </Link>
        </div>
      ) : error || !application ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-red-100 bg-red-50/50 px-6 py-12 text-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-sm text-slate-700">{error}</p>
          <Button variant="secondary" size="sm" onClick={load}>
            <Loader2 className="h-4 w-4" />
            Try again
          </Button>
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <ApplicationForm application={application} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
