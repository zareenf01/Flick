"use client";

import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { cn } from "@/lib/cn";
import { StatusBadge, type Status } from "./controls";

const TABS = [
  { slug: "storyboard", label: "Storyboard" },
  { slug: "live", label: "Live" },
  { slug: "edit", label: "Editor" },
  { slug: "share", label: "Share" },
];

const STATUS_BY_TAB: Record<string, Status> = {
  storyboard: "draft",
  live: "recording",
  edit: "ready",
  share: "ready",
};

function HeaderView({
  id,
  current,
}: {
  id: string | null;
  current: string | null;
}) {
  return (
    <div className="sticky top-0 z-30 border-b border-rule bg-paper/85 backdrop-blur-xl max-lg:top-14">
      <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center gap-x-4 gap-y-2 px-5 pt-4 sm:px-8">
        <Link
          href="/dashboard"
          aria-label="Back to demos"
          className="flex size-8 items-center justify-center rounded-full text-muted ring-1 ring-rule transition-colors hover:bg-white hover:text-ink"
        >
          <ChevronLeft className="size-4" />
        </Link>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-medium tracking-[-0.01em]">
            Create and assign a task
          </p>
          <p className="truncate font-mono text-[11px] text-muted">
            app.lumen.so · 5 scenes
          </p>
        </div>
        {current && (
          <StatusBadge
            status={STATUS_BY_TAB[current] ?? "ready"}
            className="ml-1"
          />
        )}
      </div>
      <nav className="mx-auto mt-2 flex w-full max-w-[1400px] gap-1 overflow-x-auto px-5 sm:px-8">
        {TABS.map((tab) => {
          const active = current === tab.slug;
          const className = cn(
            "relative px-3 pt-1.5 pb-3 text-[13.5px] whitespace-nowrap transition-colors duration-150",
            active ? "text-ink" : "text-muted hover:text-ink",
          );
          if (!id) {
            return (
              <span key={tab.slug} className={className}>
                {tab.label}
              </span>
            );
          }
          return (
            <Link
              key={tab.slug}
              href={`/demos/${id}/${tab.slug}`}
              className={className}
            >
              {tab.label}
              {active && (
                <motion.span
                  layoutId="demo-tab"
                  className="absolute inset-x-2 -bottom-px h-[2px] rounded-full bg-signal"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function HeaderFromPath() {
  const pathname = usePathname();
  const [, , id = "", current = "edit"] = pathname.split("/");
  return <HeaderView id={id} current={current} />;
}

export function DemoHeader() {
  return (
    <Suspense fallback={<HeaderView id={null} current={null} />}>
      <HeaderFromPath />
    </Suspense>
  );
}
