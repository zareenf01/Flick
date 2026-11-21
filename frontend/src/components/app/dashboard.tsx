"use client";

import { AnimatePresence, motion } from "motion/react";
import { Clock, MoreHorizontal, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { Segmented, StatusBadge, type Status } from "./controls";
import { DemoThumb, type Plate } from "./demo-thumb";
import { PageHeader } from "./page-header";

type Demo = {
  title: string;
  app: string;
  status: Status;
  updated: string;
  length: string;
  scenes: number;
  t: number;
  plate: Plate;
  href: string;
};

const DEMOS: Demo[] = [
  {
    title: "Create and assign a task",
    app: "app.lumen.so",
    status: "ready",
    updated: "2 hours ago",
    length: "0:13",
    scenes: 5,
    t: 6.1,
    plate: "ember",
    href: "/demos/lumen-create-task/edit",
  },
  {
    title: "Invite a teammate",
    app: "app.lumen.so",
    status: "recording",
    updated: "Recording now",
    length: "0:08",
    scenes: 4,
    t: 0.8,
    plate: "sky",
    href: "/demos/lumen-create-task/live",
  },
  {
    title: "Upgrade to the team plan",
    app: "app.lumen.so/billing",
    status: "waiting",
    updated: "Stuck on step 3",
    length: "0:06",
    scenes: 6,
    t: 4.2,
    plate: "mint",
    href: "/demos/lumen-create-task/live",
  },
  {
    title: "Build a project board",
    app: "app.lumen.so",
    status: "draft",
    updated: "Storyboard ready",
    length: "—",
    scenes: 7,
    t: 8.3,
    plate: "paper",
    href: "/demos/lumen-create-task/storyboard",
  },
  {
    title: "Mark work as done",
    app: "app.lumen.so",
    status: "ready",
    updated: "Yesterday",
    length: "0:09",
    scenes: 3,
    t: 9.9,
    plate: "graphite",
    href: "/demos/lumen-create-task/edit",
  },
  {
    title: "Filter tasks by project",
    app: "app.lumen.so",
    status: "ready",
    updated: "Nov 18",
    length: "0:11",
    scenes: 4,
    t: 2.0,
    plate: "sky",
    href: "/demos/lumen-create-task/share",
  },
];

const FILTERS = [
  { value: "all", label: "All" },
  { value: "ready", label: "Ready" },
  { value: "active", label: "In progress" },
  { value: "draft", label: "Drafts" },
] as const;

type Filter = (typeof FILTERS)[number]["value"];

function matches(demo: Demo, filter: Filter, query: string) {
  const inFilter =
    filter === "all" ||
    (filter === "ready" && demo.status === "ready") ||
    (filter === "active" &&
      (demo.status === "recording" || demo.status === "waiting")) ||
    (filter === "draft" && demo.status === "draft");
  return (
    inFilter && demo.title.toLowerCase().includes(query.trim().toLowerCase())
  );
}

export function Dashboard() {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const visible = DEMOS.filter((demo) => matches(demo, filter, query));

  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-8 sm:py-10">
      <PageHeader
        title="Demos"
        description="6 demos for Lumen · 2 in progress"
        actions={
          <Link href="/new" className={buttonClass("primary", "md")}>
            <Plus className="size-4" />
            New demo
          </Link>
        }
      />
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Segmented value={filter} options={FILTERS} onChange={setFilter} />
        <label className="flex h-9 items-center gap-2 rounded-full bg-white px-3.5 ring-1 ring-rule transition-shadow duration-150 focus-within:ring-[#CDD0D6] sm:ml-auto sm:w-64">
          <Search className="size-3.5 text-muted" />
          <span className="sr-only">Search demos</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search demos"
            className="w-full bg-transparent text-[13.5px] outline-none placeholder:text-[#A0A4AC]"
          />
        </label>
      </div>
      <motion.div
        layout
        className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {visible.map((demo, i) => (
            <motion.div
              key={demo.title}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{
                duration: 0.4,
                ease: [0.23, 1, 0.32, 1],
                delay: i * 0.03,
              }}
            >
              <Link
                href={demo.href}
                className="group block overflow-hidden rounded-[20px] bg-white ring-1 ring-rule transition-[box-shadow,transform] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-24px_rgba(23,24,28,0.3)]"
              >
                <div className="relative">
                  <DemoThumb
                    t={demo.t}
                    plate={demo.plate}
                    className="aspect-[16/10]"
                  />
                  <StatusBadge
                    status={demo.status}
                    className="absolute top-3 left-3 shadow-sm"
                  />
                  <span className="absolute right-3 bottom-3 rounded-md bg-[#17181C]/80 px-1.5 py-0.5 font-mono text-[10.5px] text-white backdrop-blur">
                    {demo.length}
                  </span>
                </div>
                <div className="flex items-start gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-[14.5px] font-medium">
                      {demo.title}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 truncate text-[12.5px] text-muted">
                      <span className="truncate">{demo.app}</span>
                      <span className="size-0.5 shrink-0 rounded-full bg-current" />
                      <Clock className="size-3 shrink-0" />
                      <span className="truncate">{demo.updated}</span>
                    </p>
                  </div>
                  <span
                    className={cn(
                      "ml-auto flex size-7 shrink-0 items-center justify-center rounded-full text-muted opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:bg-[#F0F1F4]",
                    )}
                  >
                    <MoreHorizontal className="size-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {visible.length === 0 && (
        <div className="mt-6 rounded-[20px] border border-dashed border-[#D3D6DB] px-6 py-16 text-center">
          <p className="text-[15px] font-medium">No demos match that</p>
          <p className="mt-1 text-[14px] text-muted">
            Try another filter or clear the search.
          </p>
        </div>
      )}
    </div>
  );
}
