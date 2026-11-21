import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1200px] px-5 sm:px-8", className)}
    >
      {children}
    </div>
  );
}

export function Section({
  id,
  tone = "white",
  className,
  children,
}: {
  id?: string;
  tone?: "white" | "canvas" | "outline" | "ink" | "signal";
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="relative scroll-mt-24 px-2.5 py-1.5 sm:px-4 sm:py-2"
    >
      <div
        className={cn(
          "mx-auto w-full max-w-[1440px] overflow-clip rounded-[28px] sm:rounded-[44px]",
          tone === "canvas" && "bg-canvas",
          tone === "outline" && "bg-white ring-1 ring-black/[0.07] ring-inset",
          tone === "ink" && "bg-ink text-white",
          tone === "signal" && "bg-signal text-white",
        )}
      >
        <div
          className={cn("relative mx-auto w-full max-w-[1240px]", className)}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

export function SectionLabel({
  index,
  children,
  className,
}: {
  index: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full bg-white py-1 pr-3 pl-1 font-mono text-[11px] tracking-[0.12em] text-muted uppercase ring-1 ring-black/6",
        className,
      )}
    >
      <span className="rounded-full bg-signal px-2 py-0.5 text-[10.5px] text-white">
        {index}
      </span>
      {children}
    </p>
  );
}

export function SectionTitle({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <h2
      className={cn(
        "font-display text-[clamp(2.2rem,4.8vw,4rem)] leading-[1.02] font-medium tracking-[-0.04em] text-balance",
        className,
      )}
    >
      {children}
    </h2>
  );
}
