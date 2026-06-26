import { Briefcase, Activity, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Stats } from "@/lib/types";

export function StatsCards({ stats }: { stats: Stats }) {
  const items = [
    {
      label: "Total applications",
      value: stats.total,
      icon: Briefcase,
      iconClass: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Active",
      value: stats.activeApplications,
      icon: Activity,
      iconClass: "bg-blue-50 text-blue-600",
      hint: "In progress",
    },
    {
      label: "Response rate",
      value: `${Math.round(stats.responseRate)}%`,
      icon: TrendingUp,
      iconClass: "bg-emerald-50 text-emerald-600",
      hint: "Heard back",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Card key={item.label} className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{item.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
                {item.value}
              </p>
              {item.hint && (
                <p className="mt-1 text-xs text-gray-400">{item.hint}</p>
              )}
            </div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${item.iconClass}`}
            >
              <item.icon className="h-5 w-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
