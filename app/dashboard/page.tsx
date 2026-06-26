"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { StatusDistribution } from "@/components/dashboard/StatusDistribution";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth-context";
import { getStats, listApplications, ApiClientError } from "@/lib/api";
import type { Application, Stats } from "@/lib/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsRes, recentRes] = await Promise.all([
        getStats(),
        listApplications({ page: 0, size: 5 }),
      ]);
      setStats(statsRes);
      setRecent(recentRes.content);
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : "Couldn't load your dashboard.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Welcome back, {firstName}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here&apos;s an overview of your job search.
          </p>
        </div>
        <Link href="/dashboard/applications/new">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            New application
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-red-100 bg-red-50/50 px-6 py-12 text-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <p className="text-sm text-gray-700">{error}</p>
          <Button variant="secondary" size="sm" onClick={load}>
            <Loader2 className="h-4 w-4" />
            Try again
          </Button>
        </div>
      ) : (
        stats && (
          <>
            <StatsCards stats={stats} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              {/* Recent applications */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle>Recent applications</CardTitle>
                    <Link
                      href="/dashboard/applications"
                      className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      View all
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </CardHeader>
                  <CardContent>
                    {recent.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="text-sm text-gray-500">
                          No applications yet.
                        </p>
                        <Link
                          href="/dashboard/applications/new"
                          className="mt-3 inline-block"
                        >
                          <Button size="sm">
                            <Plus className="h-4 w-4" />
                            Add your first one
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {recent.map((app) => (
                          <ApplicationCard key={app.id} application={app} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Status distribution */}
              <div className="lg:col-span-2">
                <StatusDistribution stats={stats} />
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl border border-gray-200 bg-white"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="h-72 animate-pulse rounded-xl border border-gray-200 bg-white lg:col-span-3" />
        <div className="h-72 animate-pulse rounded-xl border border-gray-200 bg-white lg:col-span-2" />
      </div>
    </div>
  );
}
