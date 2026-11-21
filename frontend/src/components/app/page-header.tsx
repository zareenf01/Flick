import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("flex flex-col gap-4 sm:flex-row sm:items-end", className)}
    >
      <div className="min-w-0">
        <h1 className="text-[26px] font-medium tracking-[-0.03em] sm:text-[30px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-[14.5px] text-muted">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2 sm:ml-auto">
          {actions}
        </div>
      )}
    </div>
  );
}
