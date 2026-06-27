import { Briefcase, Activity, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Stats } from "@/lib/types";

export function StatsCards({ stats }: { stats: Stats }) {
  const items = [
    {
      label: "Total applications",
      value: stats.total,
      icon: Briefcase,
      iconClass:
        "bg-linear-to-b from-brand-50 to-brand-100 text-brand-600 ring-brand-600/10",
    },
    {
      label: "Active",
      value: stats.activeApplications,
      icon: Activity,
      iconClass:
        "bg-linear-to-b from-sky-50 to-sky-100 text-sky-600 ring-sky-600/10",
      hint: "In progress",
    },
    {
      label: "Response rate",
      value: `${Math.round(stats.responseRate)}%`,
      icon: TrendingUp,
      iconClass:
        "bg-linear-to-b from-emerald-50 to-emerald-100 text-emerald-600 ring-emerald-600/10",
      hint: "Heard back",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card
          key={item.label}
          className="p-5 transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">{item.label}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
                {item.value}
              </p>
              {item.hint && (
                <p className="mt-1 text-xs text-slate-400">{item.hint}</p>
              )}
            </div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset ${item.iconClass}`}
            >
              <item.icon className="h-5 w-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
