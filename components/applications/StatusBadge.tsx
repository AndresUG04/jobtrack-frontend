import { Badge } from "@/components/ui/Badge";
import { STATUS_STYLES } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/lib/types";

export function StatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus;
  className?: string;
}) {
  const style = STATUS_STYLES[status];
  return (
    <Badge colorClassName={style.badge} className={className}>
      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} aria-hidden />
      {style.label}
    </Badge>
  );
}
