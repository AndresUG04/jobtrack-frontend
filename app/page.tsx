"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  ArrowRight,
  LayoutDashboard,
  ListChecks,
  LineChart,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";

/** GitHub mark — lucide-react dropped brand icons, so we inline it. */
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.575.105.785-.25.785-.555 0-.275-.01-1.005-.015-1.97-3.2.695-3.875-1.54-3.875-1.54-.525-1.33-1.28-1.685-1.28-1.685-1.045-.715.08-.7.08-.7 1.155.08 1.765 1.185 1.765 1.185 1.025 1.76 2.69 1.25 3.345.955.105-.745.4-1.25.73-1.54-2.555-.29-5.24-1.275-5.24-5.675 0-1.255.45-2.28 1.185-3.085-.12-.29-.515-1.46.11-3.045 0 0 .965-.31 3.165 1.18a11 11 0 0 1 5.76 0c2.2-1.49 3.165-1.18 3.165-1.18.625 1.585.23 2.755.115 3.045.735.805 1.18 1.83 1.18 3.085 0 4.41-2.69 5.38-5.255 5.665.41.355.78 1.05.78 2.12 0 1.53-.015 2.765-.015 3.14 0 .31.205.665.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

const features = [
  {
    icon: ListChecks,
    title: "Track every application",
    body: "Companies, positions, sources, salary ranges, and notes — all in one organized place.",
  },
  {
    icon: LayoutDashboard,
    title: "A pipeline at a glance",
    body: "Move applications through statuses from Saved to Offer, with a full status history per role.",
  },
  {
    icon: LineChart,
    title: "Know your numbers",
    body: "See totals, active applications, and your response rate so you can focus your search.",
  },
];

export default function LandingPage() {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && token) {
      router.replace("/dashboard");
    }
  }, [isLoading, token, router]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <span className="flex items-center gap-2 font-semibold text-gray-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Briefcase className="h-4.5 w-4.5" />
          </span>
          JobTrack
        </span>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6">
        {/* Hero */}
        <section className="py-16 sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20">
            Portfolio project · consumes the JobTrack API
          </span>
          <h1 className="mt-5 max-w-2xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Stay on top of your job search.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-gray-600">
            JobTrack is a clean, focused tracker for your job applications.
            Organize roles, follow each one through the interview pipeline, and
            measure your progress — without the spreadsheet chaos.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/register">
              <Button size="lg">
                Create your free account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a
              href="https://github.com/AndresUG04/jobtrack-api"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="lg">
                <GithubIcon className="h-4 w-4" />
                View the API on GitHub
              </Button>
            </a>
          </div>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 gap-6 pb-20 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{f.body}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-gray-200 py-6">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-2 px-6 text-sm text-gray-500 sm:flex-row">
          <p>A portfolio project by Andres Urena.</p>
          <a
            href="https://github.com/AndresUG04/jobtrack-api"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-gray-900"
          >
            <GithubIcon className="h-4 w-4" />
            JobTrack API
          </a>
        </div>
      </footer>
    </div>
  );
}
