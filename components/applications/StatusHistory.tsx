import { ArrowRight, Clock } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { formatDateTime } from "@/lib/utils";
import type { StatusHistoryEntry } from "@/lib/types";

export function StatusHistory({
  entries,
}: {
  entries: StatusHistoryEntry[];
}) {
  if (entries.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Clock className="h-4 w-4" />
        No status changes recorded yet.
      </div>
    );
  }

  // Most recent first.
  const sorted = [...entries].sort(
    (a, b) =>
      new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime(),
  );

  return (
    <ol className="relative space-y-6 border-l border-gray-200 pl-6">
      {sorted.map((entry) => (
        <li key={entry.id} className="relative">
          <span className="absolute -left-[1.625rem] top-1 h-3 w-3 rounded-full border-2 border-white bg-indigo-500 ring-1 ring-gray-200" />
          <div className="flex flex-wrap items-center gap-2">
            {entry.fromStatus && (
              <>
                <StatusBadge status={entry.fromStatus} />
                <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
              </>
            )}
            <StatusBadge status={entry.toStatus} />
          </div>
          <p className="mt-1.5 text-xs text-gray-500">
            {formatDateTime(entry.changedAt)}
          </p>
          {entry.note && (
            <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
              {entry.note}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
