"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Check,
  CornerDownLeft,
  Loader2,
  Pause,
  Play,
  SkipForward,
  Square,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Cursor, Ripples } from "@/components/demo/cursor";
import { LumenApp } from "@/components/demo/lumen-app";
import {
  CHAPTERS,
  CLICKS,
  LUMEN_DURATION,
  cursorAt,
  lumenState,
  pressAt,
} from "@/components/demo/lumen-script";
import { ScaledBox } from "@/components/demo/scaled-box";
import { useLoopTime } from "@/hooks/use-loop-time";
import { cn } from "@/lib/cn";
import { timecode } from "@/lib/timeline";
import { Card } from "./controls";

const LOG = [
  { at: 0.2, text: "Opened app.lumen.so/tasks" },
  { at: 2.0, text: "Clicked button “New task”" },
  { at: 3.45, text: "Focused field “Task name”" },
  { at: 4.6, text: "Typed “Prepare launch checklist”" },
  { at: 5.45, text: "Opened select “Assignee”" },
  { at: 6.4, text: "Chose “Maya Chen”" },
  { at: 7.35, text: "Clicked button “Create task”" },
  { at: 8.0, text: "New row appeared in “My tasks”" },
  { at: 9.55, text: "Checked the new task" },
  { at: 10.2, text: "Scene 5 complete" },
];

const END = 11.2;

function sceneIndex(t: number) {
  let index = 0;
  CHAPTERS.forEach((chapter, i) => {
    if (t >= chapter.at) index = i;
  });
  return t >= END ? CHAPTERS.length : index;
}

export function LiveRecording() {
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [instruction, setInstruction] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const [t, seek] = useLoopTime(LUMEN_DURATION, {
    playing: !paused && !reduceMotion,
  });
  const cursor = cursorAt(t);
  const current = sceneIndex(t);
  const lines = LOG.filter((line) => t >= line.at);
  const pct = Math.min(1, t / END);

  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 py-6 sm:px-8 sm:py-8">
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="flex min-w-0 flex-col gap-3">
          <div className="overflow-hidden rounded-[22px] bg-[#0E0F12] p-2 shadow-[0_30px_80px_-40px_rgba(23,24,28,0.6)]">
            <div className="flex items-center gap-3 px-2 pt-1 pb-2.5 text-white/70">
              <span
                className={cn(
                  "flex items-center gap-2 rounded-full px-2.5 py-1 font-mono text-[11px]",
                  paused
                    ? "bg-white/10 text-white/70"
                    : "bg-signal/15 text-[#FF9A7A]",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    paused ? "bg-white/50" : "animate-pulse bg-signal",
                  )}
                />
                {paused ? "PAUSED" : "REC"} {timecode(t)}
              </span>
              <span className="truncate font-mono text-[11.5px] text-white/45">
                app.lumen.so/tasks
              </span>
              <span className="ml-auto hidden font-mono text-[11px] text-white/40 sm:block">
                1440 × 900
              </span>
            </div>
            <div className="overflow-hidden rounded-[14px]">
              <ScaledBox width={1280} height={800}>
                <LumenApp state={lumenState(t)} />
                <Ripples t={t} clicks={CLICKS} />
                <Cursor x={cursor.x} y={cursor.y} pressed={pressAt(t)} />
                <AnimatePresence>
                  {paused && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-[#17181C]/30 backdrop-blur-[2px]"
                    >
                      <span className="rounded-full bg-[#17181C]/90 px-7 py-4 text-[26px] font-medium text-white">
                        Paused. The agent is waiting.
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </ScaledBox>
            </div>
          </div>
          <div className="flex items-center gap-3 px-1">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-[#E5E7EA]">
              <div
                className="h-full rounded-full bg-signal transition-[width] duration-200"
                style={{ width: `${pct * 100}%` }}
              />
            </div>
            <span className="font-mono text-[11.5px] text-muted tabular-nums">
              {Math.min(current + 1, CHAPTERS.length)} / {CHAPTERS.length}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-2">
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setPaused((value) => !value)}
                className="flex h-16 flex-col items-center justify-center gap-1.5 rounded-xl bg-[#F2F3F5] text-[12.5px] transition-[background-color,transform] duration-150 hover:bg-[#E8EAED] active:scale-[0.97]"
              >
                {paused ? (
                  <Play className="size-4 fill-current" />
                ) : (
                  <Pause className="size-4 fill-current" />
                )}
                {paused ? "Resume" : "Pause"}
              </button>
              <button
                type="button"
                onClick={() =>
                  seek(
                    CHAPTERS[Math.min(current + 1, CHAPTERS.length - 1)]?.at ??
                      0,
                  )
                }
                className="flex h-16 flex-col items-center justify-center gap-1.5 rounded-xl bg-[#F2F3F5] text-[12.5px] transition-[background-color,transform] duration-150 hover:bg-[#E8EAED] active:scale-[0.97]"
              >
                <SkipForward className="size-4" />
                Skip scene
              </button>
              <Link
                href="/demos/lumen-create-task/edit"
                className="flex h-16 flex-col items-center justify-center gap-1.5 rounded-xl bg-[#FBEDEA] text-[12.5px] text-[#B42318] transition-[background-color,transform] duration-150 hover:bg-[#F8E1DC] active:scale-[0.97]"
              >
                <Square className="size-3.5 fill-current" />
                Stop
              </Link>
            </div>
          </Card>

          <Card className="p-5">
            <p className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
              Scenes
            </p>
            <ol className="mt-4 flex flex-col">
              {CHAPTERS.map((chapter, i) => {
                const done = i < current;
                const active = i === current;
                return (
                  <li
                    key={chapter.title}
                    className="relative flex items-center gap-3 py-2"
                  >
                    {i < CHAPTERS.length - 1 && (
                      <span className="absolute top-[26px] left-[9px] h-[calc(100%-12px)] w-px bg-[#E5E7EA]" />
                    )}
                    <span
                      className={cn(
                        "relative flex size-[19px] shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                        done
                          ? "bg-signal text-paper"
                          : active
                            ? "bg-white ring-[1.5px] ring-signal"
                            : "bg-white ring-1 ring-[#D6D9DE]",
                      )}
                    >
                      {done ? (
                        <Check className="size-3" strokeWidth={3} />
                      ) : active ? (
                        <Loader2
                          className={cn("size-3", !paused && "animate-spin")}
                        />
                      ) : null}
                    </span>
                    <span
                      className={cn(
                        "text-[13.5px]",
                        !done && !active && "text-muted",
                      )}
                    >
                      {chapter.title}
                    </span>
                  </li>
                );
              })}
            </ol>
          </Card>

          <Card className="flex flex-col p-5">
            <p className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
              Agent log
            </p>
            <div className="mt-3 flex h-[156px] flex-col justify-end overflow-hidden">
              <AnimatePresence initial={false}>
                {lines.slice(-6).map((line) => (
                  <motion.p
                    key={line.at}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                    className="flex gap-3 py-[3px] text-[12.5px]"
                  >
                    <span className="font-mono text-[11px] text-muted tabular-nums">
                      {timecode(line.at)}
                    </span>
                    <span className="truncate">{line.text}</span>
                  </motion.p>
                ))}
              </AnimatePresence>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (!instruction.trim()) return;
                setSent(instruction.trim());
                setInstruction("");
              }}
              className="mt-4 flex items-center gap-2 rounded-xl bg-[#F5F6F8] py-1 pr-1 pl-3.5 ring-1 ring-[#E5E7EA] focus-within:bg-white focus-within:ring-2 focus-within:ring-focus/40"
            >
              <input
                value={instruction}
                onChange={(event) => setInstruction(event.target.value)}
                placeholder="Tell the agent what to do instead"
                className="h-9 flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-[#A0A4AC]"
              />
              <button
                type="submit"
                aria-label="Send instruction"
                className="flex size-8 items-center justify-center rounded-lg bg-signal text-paper transition-transform active:scale-95"
              >
                <CornerDownLeft className="size-3.5" />
              </button>
            </form>
            <AnimatePresence>
              {sent && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden pt-2 text-[12.5px] text-muted"
                >
                  Queued for the next step: “{sent}”
                </motion.p>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </div>
  );
}
