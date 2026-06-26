"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import {
  createApplication,
  updateApplication,
  ApiClientError,
} from "@/lib/api";
import { applicationSchema, type ApplicationValues } from "@/lib/schemas";
import { STATUS_ORDER, STATUS_STYLES } from "@/lib/utils";
import type { Application, ApplicationInput } from "@/lib/types";

const statusOptions = STATUS_ORDER.map((s) => ({
  value: s,
  label: STATUS_STYLES[s].label,
}));

interface ApplicationFormProps {
  /** When provided, the form edits this application; otherwise it creates one. */
  application?: Application;
}

export function ApplicationForm({ application }: ApplicationFormProps) {
  const router = useRouter();
  const isEdit = Boolean(application);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      companyName: application?.companyName ?? "",
      position: application?.position ?? "",
      status: application?.status ?? "SAVED",
      source: application?.source ?? "",
      jobUrl: application?.jobUrl ?? "",
      salaryRange: application?.salaryRange ?? "",
      location: application?.location ?? "",
      remote: application?.remote ?? false,
      appliedDate: application?.appliedDate?.slice(0, 10) ?? "",
      notes: application?.notes ?? "",
    },
  });

  async function onSubmit(values: ApplicationValues) {
    setFormError(null);
    // Normalize empty optional strings to null so the backend clears the field.
    const clean = (v: string) => (v.trim() ? v.trim() : null);
    const payload: ApplicationInput = {
      companyName: values.companyName,
      position: values.position,
      status: values.status,
      remote: values.remote,
      source: clean(values.source),
      jobUrl: clean(values.jobUrl),
      salaryRange: clean(values.salaryRange),
      location: clean(values.location),
      appliedDate: clean(values.appliedDate),
      notes: clean(values.notes),
    };

    try {
      const saved = isEdit
        ? await updateApplication(application!.id, payload)
        : await createApplication(payload);
      toast.success(isEdit ? "Application updated." : "Application created.");
      router.push(`/dashboard/applications/${saved.id}`);
      router.refresh();
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? (err.errors?.join(" ") ?? err.message)
          : "Something went wrong. Please try again.";
      setFormError(message);
      toast.error(message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {formError && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-inset ring-red-200">
          {formError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <Input
          label="Company name *"
          placeholder="Acme Inc."
          error={errors.companyName?.message}
          {...register("companyName")}
        />
        <Input
          label="Position *"
          placeholder="Senior Frontend Engineer"
          error={errors.position?.message}
          {...register("position")}
        />
        <Select
          label="Status"
          options={statusOptions}
          error={errors.status?.message}
          {...register("status")}
        />
        <Input
          label="Source"
          placeholder="LinkedIn, referral, company site…"
          error={errors.source?.message}
          {...register("source")}
        />
        <Input
          label="Location"
          placeholder="Remote, Berlin, NYC…"
          error={errors.location?.message}
          {...register("location")}
        />
        <Input
          label="Salary range"
          placeholder="$120k – $150k"
          error={errors.salaryRange?.message}
          {...register("salaryRange")}
        />
        <Input
          label="Job URL"
          type="url"
          placeholder="https://…"
          error={errors.jobUrl?.message}
          {...register("jobUrl")}
        />
        <Input
          label="Applied date"
          type="date"
          max={new Date().toISOString().slice(0, 10)}
          error={errors.appliedDate?.message}
          {...register("appliedDate")}
        />
      </div>

      <label className="flex items-center gap-2.5 text-sm font-medium text-gray-700">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
          {...register("remote")}
        />
        This is a remote position
      </label>

      <Textarea
        label="Notes"
        rows={4}
        placeholder="Anything worth remembering — contacts, prep, next steps…"
        error={errors.notes?.message}
        {...register("notes")}
      />

      <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {isEdit ? "Save changes" : "Create application"}
        </Button>
      </div>
    </form>
  );
}
