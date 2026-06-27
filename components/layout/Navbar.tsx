"use client";

import Link from "next/link";
import { Briefcase, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const { user, logout } = useAuth();

  const initial = (user?.name || user?.email || "?").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/70 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-bold text-slate-900"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-b from-brand-500 to-brand-600 text-white shadow-sm shadow-brand-600/30">
            <Briefcase className="h-4.5 w-4.5" />
          </span>
          JobTrack
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-b from-brand-50 to-brand-100 text-sm font-semibold text-brand-700 ring-1 ring-inset ring-brand-600/10">
              {initial}
            </span>
            <span className="max-w-48 truncate text-sm text-slate-600">
              {user?.email}
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={logout}
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Log out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
