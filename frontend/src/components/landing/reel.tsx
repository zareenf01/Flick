"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { DemoThumb, type Plate } from "@/components/app/demo-thumb";
import { cn } from "@/lib/cn";

const TAKES: {
  title: string;
  plate: Plate;
  t: number;
  length: string;
  light?: boolean;
}[] = [
  {
    title: "Create and assign a task",
    plate: "signal",
    t: 6.1,
    length: "0:13",
  },
  {
    title: "Invite a teammate",
    plate: "lime",
    t: 1.9,
    length: "0:08",
    light: true,
  },
  { title: "Mark work as done", plate: "cobalt", t: 9.9, length: "0:09" },
  {
    title: "Name a new task",
    plate: "lilac",
    t: 4.4,
    length: "0:06",
    light: true,
  },
  { title: "Filter by project", plate: "graphite", t: 8.3, length: "0:11" },
  {
    title: "Open the task list",
    plate: "aqua",
    t: 0.4,
    length: "0:05",
    light: true,
  },
];

function Take({
  take,
  index,
}: {
  take: (typeof TAKES)[number];
  index: number;
}) {
  return (
    <figure className="group relative w-[340px] shrink-0 overflow-hidden rounded-[26px] sm:w-[420px]">
      <DemoThumb
        t={take.t}
        plate={take.plate}
        padding={0.09}
        className="aspect-[16/11] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.03]"
      />
      <figcaption
        className={cn(
          "absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-4 font-mono text-[11px] tracking-[0.08em]",
          take.light ? "text-ink/70" : "text-white/80",
        )}
      >
        <span className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-current" />
          TAKE {String(index + 1).padStart(2, "0")}
        </span>
        <span>{take.length}</span>
      </figcaption>
      <p
        className={cn(
          "absolute inset-x-0 bottom-0 px-5 pb-4 text-[15px] font-medium",
          take.light ? "text-ink" : "text-white",
        )}
      >
        {take.title}
      </p>
    </figure>
  );
}

export function Reel() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-38%"]);
  const loop = [...TAKES, ...TAKES];
  return (
    <section ref={ref} className="relative overflow-hidden py-16 sm:py-24">
      <div className="mx-auto mb-10 flex max-w-[1240px] flex-col gap-3 px-5 sm:flex-row sm:items-end sm:px-8">
        <h2 className="font-display text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.02] font-medium tracking-[-0.04em]">
          Six takes, zero screen recordings
        </h2>
        <p className="max-w-sm text-[15px] leading-relaxed text-muted sm:ml-auto">
          Example demos of a sample tasks app. Each one came from a single
          sentence and a link.
        </p>
      </div>
      <div className="group/reel relative [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
        <motion.div style={{ x }} className="flex w-max gap-4">
          {loop.map((take, i) => (
            <Take
              key={`${take.title}-${i}`}
              take={take}
              index={i % TAKES.length}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
