import Link from "next/link";
import { MapPin, Wifi, CalendarDays } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { formatDate } from "@/lib/utils";
import type { Application } from "@/lib/types";

/** Compact card used in the dashboard "recent applications" list. */
export function ApplicationCard({ application }: { application: Application }) {
  return (
    <Link
      href={`/dashboard/applications/${application.id}`}
      className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 px-4 py-3 transition-colors hover:border-gray-200 hover:bg-gray-50"
    >
      <div className="min-w-0">
        <p className="truncate font-medium text-gray-900">
          {application.position}
        </p>
        <p className="truncate text-sm text-gray-500">
          {application.companyName}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
          {application.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {application.location}
            </span>
          )}
          {application.remote && (
            <span className="inline-flex items-center gap-1">
              <Wifi className="h-3 w-3" />
              Remote
            </span>
          )}
          {application.appliedDate && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {formatDate(application.appliedDate)}
            </span>
          )}
        </div>
      </div>
      <StatusBadge status={application.status} className="shrink-0" />
    </Link>
  );
}
