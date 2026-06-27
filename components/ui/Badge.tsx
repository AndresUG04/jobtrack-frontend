import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Tailwind classes for color (bg + text + ring). */
  colorClassName?: string;
}

export function Badge({
  className,
  colorClassName = "bg-slate-100 text-slate-700 ring-slate-500/20",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        colorClassName,
        className,
      )}
      {...props}
    />
  );
}
