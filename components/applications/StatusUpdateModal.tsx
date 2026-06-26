"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { updateStatus, ApiClientError } from "@/lib/api";
import {
  statusUpdateSchema,
  type StatusUpdateValues,
} from "@/lib/schemas";
import { STATUS_ORDER, STATUS_STYLES } from "@/lib/utils";
import type { Application, ApplicationStatus } from "@/lib/types";

const statusOptions = STATUS_ORDER.map((s) => ({
  value: s,
  label: STATUS_STYLES[s].label,
}));

interface StatusUpdateModalProps {
  open: boolean;
  onClose: () => void;
  application: Application;
  onUpdated: (updated: Application) => void;
}

export function StatusUpdateModal({
  open,
  onClose,
  application,
  onUpdated,
}: StatusUpdateModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StatusUpdateValues>({
    resolver: zodResolver(statusUpdateSchema),
    defaultValues: { status: application.status, note: "" },
  });

  async function onSubmit(values: StatusUpdateValues) {
    try {
      const updated = await updateStatus(application.id, {
        status: values.status as ApplicationStatus,
        note: values.note.trim() || undefined,
      });
      toast.success("Status updated.");
      onUpdated(updated);
      reset({ status: updated.status, note: "" });
      onClose();
    } catch (err) {
      const message =
        err instanceof ApiClientError
          ? err.message
          : "Couldn't update status. Please try again.";
      toast.error(message);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Update status"
      description="Move this application to a new stage and optionally add a note."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Select
          label="New status"
          options={statusOptions}
          error={errors.status?.message}
          {...register("status")}
        />
        <Textarea
          label="Note (optional)"
          rows={3}
          placeholder="e.g. Recruiter call scheduled for Friday"
          error={errors.note?.message}
          {...register("note")}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Update status
          </Button>
        </div>
      </form>
    </Modal>
  );
}
