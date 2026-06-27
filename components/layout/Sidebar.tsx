"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  {
    href: "/dashboard/applications",
    label: "Applications",
    icon: Briefcase,
    exact: false,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white md:block">
      <nav className="sticky top-16 space-y-1 p-4">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

/** Horizontal nav shown on mobile, where the sidebar is hidden. */
export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 border-b border-slate-200 bg-white px-4 py-2 md:hidden">
      {navItems.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-50",
            )}
          >
            <item.icon className="h-4.5 w-4.5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
