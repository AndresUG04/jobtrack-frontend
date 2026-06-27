import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { STATUS_ORDER, STATUS_STYLES } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Stats } from "@/lib/types";

export function StatusDistribution({ stats }: { stats: Stats }) {
  const total = stats.total || 0;
  // Only show statuses that have at least one application.
  const rows = STATUS_ORDER.map((status) => ({
    status,
    count: stats.byStatus?.[status] ?? 0,
  })).filter((r) => r.count > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            No applications to chart yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {rows.map(({ status, count }) => {
              const pct = total ? Math.round((count / total) * 100) : 0;
              const style = STATUS_STYLES[status];
              return (
                <li key={status}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-slate-700">
                      <span
                        className={cn("h-2.5 w-2.5 rounded-full", style.dot)}
                      />
                      {style.label}
                    </span>
                    <span className="tabular-nums text-slate-500">
                      {count}
                      <span className="ml-1 text-slate-400">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={cn("h-full rounded-full", style.bar)}
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
