"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ApplicationForm } from "@/components/applications/ApplicationForm";
import { Card, CardContent } from "@/components/ui/Card";

export default function NewApplicationPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/dashboard/applications"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to applications
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
          New application
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Add a role you&apos;re tracking. Only company and position are
          required.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <ApplicationForm />
        </CardContent>
      </Card>
    </div>
  );
}
