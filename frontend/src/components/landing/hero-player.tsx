"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Cursor, Ripples } from "@/components/demo/cursor";
import { LumenApp } from "@/components/demo/lumen-app";
import {
  CHAPTERS,
  CLICKS,
  LUMEN_DURATION,
  SCENE,
  WINDOW,
  cameraAt,
  cameraTransform,
  chapterAt,
  cursorAt,
  fadeAt,
  lumenState,
  pressAt,
} from "@/components/demo/lumen-script";
import { ScaledBox } from "@/components/demo/scaled-box";
import { useLoopTime } from "@/hooks/use-loop-time";
import { timecode } from "@/lib/timeline";

export function HeroPlayer({
  className,
  started = true,
}: {
  className?: string;
  started?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const [t, seek] = useLoopTime(LUMEN_DURATION, {
    playing: started && inView && !paused && !scrubbing && !reduceMotion,
    start: started ? 0 : 0.6,
  });

  useEffect(() => {
    if (started) seek(0);
  }, [started, seek]);

  const camera = cameraAt(t);
  const cursor = cursorAt(t);
  const chapter = chapterAt(t);
  const isPaused = paused || Boolean(reduceMotion);

  const seekFromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(
      1,
      Math.max(0, (event.clientX - rect.left) / rect.width),
    );
    seek(ratio * LUMEN_DURATION * 0.999);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-[26px] bg-[#0E0F12] p-2 shadow-[0_40px_120px_-40px_rgba(23,24,28,0.55),0_0_0_1px_rgba(23,24,28,0.9)] sm:p-2.5",
        className,
      )}
    >
      <div className="relative overflow-hidden rounded-[18px]">
        <ScaledBox width={SCENE.width} height={SCENE.height}>
          <div
            className="absolute top-0 left-0 origin-top-left will-change-transform"
            style={{
              width: SCENE.width,
              height: SCENE.height,
              transform: cameraTransform(camera),
            }}
          >
            <div className="absolute inset-0 bg-[#ECEBE7] bg-[radial-gradient(70%_80%_at_12%_8%,#FFDCCF_0%,transparent_60%),radial-gradient(70%_80%_at_92%_100%,#D7DEFF_0%,transparent_60%)]" />
            <div
              className="absolute"
              style={{
                left: WINDOW.x,
                top: WINDOW.y,
                width: WINDOW.width,
                height: WINDOW.height,
                opacity: reduceMotion ? 1 : fadeAt(t),
              }}
            >
              <div className="absolute inset-0 rounded-[14px] shadow-[0_40px_90px_-30px_rgba(23,24,28,0.45),0_0_0_1px_rgba(23,24,28,0.08)]" />
              <LumenApp state={lumenState(t)} />
              <Ripples t={t} clicks={CLICKS} />
              <Cursor
                x={cursor.x}
                y={cursor.y}
                pressed={pressAt(t)}
                scale={1 / Math.sqrt(camera.s)}
              />
            </div>
          </div>
        </ScaledBox>
        <div className="pointer-events-none absolute inset-x-0 bottom-[6%] flex justify-center">
          <AnimatePresence mode="wait">
            {chapter >= 0 && (
              <motion.div
                key={chapter}
                initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                className="flex items-center gap-2.5 rounded-full bg-[#17181C]/88 py-1.5 pr-3.5 pl-1.5 text-[12px] text-white shadow-lg ring-1 ring-white/10 backdrop-blur-md sm:text-[13.5px]"
              >
                <span className="rounded-full bg-white/12 px-2 py-0.5 font-mono text-[10.5px] tracking-wider text-white/70 sm:text-[11px]">
                  {String(chapter + 1).padStart(2, "0")}
                </span>
                {CHAPTERS[chapter]?.title}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex items-center gap-3 px-2 pt-2.5 pb-1 text-white/70 sm:gap-4 sm:px-3">
        <button
          type="button"
          aria-label={isPaused ? "Play" : "Pause"}
          onClick={() => setPaused((value) => !value)}
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/8 text-white transition-[background-color,transform] duration-150 hover:bg-white/14 active:scale-[0.94]"
        >
          {isPaused ? (
            <Play className="size-3.5 translate-x-px fill-current" />
          ) : (
            <Pause className="size-3.5 fill-current" />
          )}
        </button>
        <span className="w-14 shrink-0 font-mono text-[11.5px] text-white tabular-nums">
          {timecode(t)}
        </span>
        <div
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={LUMEN_DURATION}
          aria-valuenow={Math.round(t * 10) / 10}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight")
              seek(Math.min(t + 1, LUMEN_DURATION - 0.01));
            if (event.key === "ArrowLeft") seek(Math.max(t - 1, 0));
          }}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            setScrubbing(true);
            seekFromPointer(event);
          }}
          onPointerMove={(event) => {
            if (scrubbing) seekFromPointer(event);
          }}
          onPointerUp={() => setScrubbing(false)}
          onPointerCancel={() => setScrubbing(false)}
          className="group relative flex h-6 flex-1 cursor-pointer items-center outline-none"
        >
          <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/12 transition-[height] duration-150 group-hover:h-[5px]">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white"
              style={{ width: `${(t / LUMEN_DURATION) * 100}%` }}
            />
          </div>
          {CHAPTERS.slice(1).map((item) => (
            <span
              key={item.at}
              className="absolute top-1/2 h-2.5 w-px -translate-y-1/2 bg-[#0E0F12]"
              style={{ left: `${(item.at / LUMEN_DURATION) * 100}%` }}
            />
          ))}
          <span
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F2542D] opacity-0 shadow ring-2 ring-[#0E0F12] transition-opacity duration-150 group-hover:opacity-100"
            style={{ left: `${(t / LUMEN_DURATION) * 100}%` }}
          />
        </div>
        <span className="hidden shrink-0 font-mono text-[11.5px] tabular-nums sm:block">
          {timecode(LUMEN_DURATION)}
        </span>
        <span className="hidden shrink-0 rounded-md border border-white/10 px-2 py-1 font-mono text-[10.5px] tracking-wider text-white/55 md:block">
          1080P · 60 FPS
        </span>
      </div>
    </div>
  );
}
