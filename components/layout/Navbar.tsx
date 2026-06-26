"use client";

import Link from "next/link";
import { Briefcase, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const { user, logout } = useAuth();

  const initial = (user?.name || user?.email || "?").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold text-gray-900"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Briefcase className="h-4.5 w-4.5" />
          </span>
          JobTrack
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-sm font-medium text-indigo-700">
              {initial}
            </span>
            <span className="max-w-[12rem] truncate text-sm text-gray-600">
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
