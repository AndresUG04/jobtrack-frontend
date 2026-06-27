"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase } from "lucide-react";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && token) router.replace("/dashboard");
  }, [isLoading, token, router]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-12rem] -z-10 h-[30rem] w-[44rem] -translate-x-1/2 rounded-full bg-linear-to-br from-brand-200/60 via-sky-200/40 to-transparent blur-3xl"
      />
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 font-bold text-slate-900"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-b from-brand-500 to-brand-600 text-white shadow-sm shadow-brand-600/30">
            <Briefcase className="h-5 w-5" />
          </span>
          JobTrack
        </Link>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-200/50 sm:p-8">
          <h1 className="text-xl font-semibold text-slate-900">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Start tracking your job search in minutes.
          </p>
          <div className="mt-6">
            <RegisterForm />
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
