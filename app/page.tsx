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

const pipeline = [
  { label: "Applied", dot: "bg-blue-500" },
  { label: "Screening", dot: "bg-indigo-500" },
  { label: "Interview", dot: "bg-purple-500" },
  { label: "Offer", dot: "bg-emerald-500" },
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
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Decorative background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-[-10rem] h-[28rem] w-[44rem] -translate-x-1/2 rounded-full bg-linear-to-br from-brand-200/60 via-sky-200/40 to-transparent blur-3xl" />
        <div className="absolute right-[-8rem] top-40 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
      </div>

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <span className="flex items-center gap-2 font-bold text-slate-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-b from-brand-500 to-brand-600 text-white shadow-sm shadow-brand-600/30">
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

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6">
        {/* Hero */}
        <section className="flex flex-col items-center py-16 text-center sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-brand-700 shadow-xs ring-1 ring-inset ring-brand-600/15 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Portfolio project · consumes the JobTrack API
          </span>
          <h1 className="mt-6 max-w-3xl text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Stay on top of your{" "}
            <span className="bg-linear-to-r from-brand-600 to-sky-500 bg-clip-text text-transparent">
              job search
            </span>
            .
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-lg text-slate-600">
            A clean, focused tracker for your job applications. Organize roles,
            follow each one through the interview pipeline, and measure your
            progress — without the spreadsheet chaos.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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

          {/* Pipeline preview */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
            {pipeline.map((p, i) => (
              <span key={p.label} className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-xs ring-1 ring-inset ring-slate-200">
                  <span className={`h-1.5 w-1.5 rounded-full ${p.dot}`} />
                  {p.label}
                </span>
                {i < pipeline.length - 1 && (
                  <ArrowRight className="h-3 w-3 text-slate-300" />
                )}
              </span>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 gap-6 pb-20 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-200/80 bg-white/70 p-6 shadow-xs backdrop-blur transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-b from-brand-50 to-brand-100 text-brand-600 ring-1 ring-inset ring-brand-600/10">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {f.body}
              </p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-slate-200/80 py-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-6 text-sm text-slate-500 sm:flex-row">
          <p>A portfolio project by Andres Urena.</p>
          <a
            href="https://github.com/AndresUG04/jobtrack-api"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-slate-900"
          >
            <GithubIcon className="h-4 w-4" />
            JobTrack API
          </a>
        </div>
      </footer>
    </div>
  );
}
