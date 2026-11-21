"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { Cursor, Ripples } from "@/components/demo/cursor";
import { ScaledBox } from "@/components/demo/scaled-box";
import { useLoopTime } from "@/hooks/use-loop-time";
import { cn } from "@/lib/cn";
import { glide, lerp, spring, track, type Point } from "@/lib/timeline";
import { Section, SectionLabel, SectionTitle } from "./section";

const W = 960;
const H = 600;
const DURATION = 7.5;
const HOME: Point = { x: 700, y: 520 };
const TARGETS = {
  button: { x: 850, y: 58 },
  input: { x: 420, y: 251 },
  toggle: { x: 355, y: 442 },
};
const CLICKS = [
  { at: 1.5, ...TARGETS.button },
  { at: 3.3, ...TARGETS.input },
  { at: 5.1, ...TARGETS.toggle },
];

type Mode = "raw" | "flick";
type Cam = { x: number; y: number; s: number };

const FLICK_CURSOR = [
  { at: 0.4, dur: 1.0, to: TARGETS.button },
  { at: 2.3, dur: 0.9, to: TARGETS.input },
  { at: 4.1, dur: 0.9, to: TARGETS.toggle },
  { at: 6.0, dur: 1.1, to: HOME },
];

const RAW_CURSOR = [
  { at: 1.3, dur: 0, to: TARGETS.button },
  { at: 3.1, dur: 0, to: TARGETS.input },
  { at: 4.9, dur: 0, to: TARGETS.toggle },
  { at: 6.9, dur: 0, to: HOME },
];

const CAM_START: Cam = { x: W / 2, y: H / 2, s: 1 };
const FLICK_CAMERA = [
  { at: 0.6, dur: 1.0, to: { x: 800, y: 120, s: 1.8 } },
  { at: 2.4, dur: 1.0, to: { x: 480, y: 270, s: 1.6 } },
  { at: 4.2, dur: 1.0, to: { x: 420, y: 430, s: 1.8 } },
  { at: 6.0, dur: 1.2, to: CAM_START },
];

function camTransform(cam: Cam) {
  const tx = Math.min(0, Math.max(W - W * cam.s, W / 2 - cam.x * cam.s));
  const ty = Math.min(0, Math.max(H - H * cam.s, H / 2 - cam.y * cam.s));
  return `translate3d(${tx}px, ${ty}px, 0) scale(${cam.s})`;
}

function Block({ className }: { className: string }) {
  return <span className={cn("absolute rounded-md bg-[#E7E9EC]", className)} />;
}

function Stage({ t, mode }: { t: number; mode: Mode }) {
  const flick = mode === "flick";
  const cursor = flick
    ? track(HOME, FLICK_CURSOR, t, (a, b, p) => glide(a, b, p))
    : track(HOME, RAW_CURSOR, t, (_, b) => b);
  const cam = flick
    ? track(CAM_START, FLICK_CAMERA, t, (a, b, p) => {
        const e = spring(p, 7);
        return {
          x: lerp(a.x, b.x, e),
          y: lerp(a.y, b.y, e),
          s: lerp(a.s, b.s, e),
        };
      })
    : CAM_START;
  const pressed = CLICKS.some((c) => t >= c.at && t < c.at + 0.14);
  const inputFocused = t >= 3.3 && t < 6.5;
  const toggleOn = t >= 5.1 && t < 7.2;

  return (
    <ScaledBox width={W} height={H} className="rounded-[16px] bg-[#F3F3F0]">
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ width: W, height: H, transform: camTransform(cam) }}
      >
        <div className="absolute inset-4 rounded-[12px] bg-white shadow-[0_0_0_1px_rgba(23,24,28,0.06)]">
          <Block className="top-6 left-6 h-5 w-24" />
          <Block className="top-[88px] left-6 h-4 w-40" />
          <Block className="top-[124px] left-6 h-4 w-32" />
          <Block className="top-[160px] left-6 h-4 w-36" />
          <Block className="top-[196px] left-6 h-4 w-28" />
          <span className="absolute top-0 bottom-0 left-[230px] w-px bg-[#EEEFF2]" />
          <Block className="top-[90px] left-[298px] h-7 w-56" />
          <Block className="top-[140px] left-[298px] h-3.5 w-[420px] bg-[#F0F1F4]" />
          <Block className="top-[164px] left-[298px] h-3.5 w-[360px] bg-[#F0F1F4]" />
          <span
            className="absolute flex items-center justify-center rounded-[10px] bg-[#17181C] text-[15px] font-medium text-white"
            style={{
              left: 784 - 16,
              top: 24,
              width: 132,
              height: 36,
              transform: `scale(${pressed && t < 2 ? 0.94 : 1})`,
            }}
          >
            New project
          </span>
          <span
            className="absolute flex items-center rounded-[10px] border bg-white px-4 text-[15px] text-[#A8AAAF]"
            style={{
              left: 298,
              top: 212,
              width: 386,
              height: 46,
              borderColor: inputFocused ? "#4C6FFF" : "#E3E5E8",
              boxShadow: inputFocused
                ? "0 0 0 3px rgba(76,111,255,0.16)"
                : "none",
            }}
          >
            Project name
          </span>
          <span className="absolute top-[318px] left-[298px] h-3.5 w-48 rounded-md bg-[#F0F1F4]" />
          <span className="absolute top-[352px] left-[298px] h-3.5 w-64 rounded-md bg-[#F0F1F4]" />
          <span
            className="absolute flex items-center rounded-full p-[3px] transition-colors duration-200"
            style={{
              left: 314,
              top: 414,
              width: 50,
              height: 28,
              background: toggleOn ? "#17181C" : "#D6D9DE",
            }}
          >
            <span
              className="size-[22px] rounded-full bg-white shadow transition-transform duration-200"
              style={{ transform: `translateX(${toggleOn ? 22 : 0}px)` }}
            />
          </span>
          <Block className="top-[421px] left-[378px] h-3.5 w-40 bg-[#F0F1F4]" />
        </div>
        {flick && <Ripples t={t} clicks={CLICKS} />}
        <Cursor
          x={cursor.x}
          y={cursor.y}
          pressed={flick && pressed}
          scale={1 / Math.sqrt(cam.s)}
        />
      </div>
    </ScaledBox>
  );
}

const NOTES: Record<Mode, { label: string; value: string }[]> = {
  raw: [
    { label: "Cursor", value: "Jumps from click to click" },
    { label: "Camera", value: "Fixed, the whole screen at once" },
    { label: "Clicks", value: "Nothing marks where they land" },
  ],
  flick: [
    { label: "Cursor", value: "Eased, slightly curved path" },
    { label: "Camera", value: "Zooms to the element in use" },
    { label: "Clicks", value: "A short ripple on each one" },
  ],
};

export function MotionCompare() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduceMotion = useReducedMotion();
  const [mode, setMode] = useState<Mode>("flick");
  const [t] = useLoopTime(DURATION, { playing: inView && !reduceMotion });

  return (
    <Section id="motion" tone="ink">
      <div
        ref={ref}
        className="px-5 pt-16 pb-6 text-white sm:px-10 sm:pt-24 sm:pb-12"
      >
        <div className="grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:items-end">
          <div>
            <div>
              <SectionLabel index="02">Motion</SectionLabel>
            </div>
            <SectionTitle className="mt-5">
              Agent recordings look robotic. Flick fixes that.
            </SectionTitle>
            <p className="mt-5 max-w-[30rem] text-[16px] leading-relaxed text-white/55">
              Flick records the exact position of everything the agent clicks,
              so it can plan the camera and cursor afterwards instead of
              replaying a raw screen capture.
            </p>
            <div className="mt-8 inline-flex rounded-full bg-white/6 p-1 ring-1 ring-white/10">
              {(["raw", "flick"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMode(value)}
                  className={cn(
                    "relative rounded-full px-4 py-1.5 text-[13px] transition-colors duration-200",
                    mode === value
                      ? "text-white"
                      : "text-white/60 hover:text-white",
                  )}
                >
                  {mode === value && (
                    <motion.span
                      layoutId="mode-pill"
                      className="absolute inset-0 rounded-full bg-signal"
                      transition={{
                        type: "spring",
                        bounce: 0.18,
                        duration: 0.45,
                      }}
                    />
                  )}
                  <span className="relative">
                    {value === "raw" ? "Raw capture" : "With Flick"}
                  </span>
                </button>
              ))}
            </div>
            <dl className="mt-8 flex flex-col divide-y divide-white/8 border-y border-white/8">
              {NOTES[mode].map((note) => (
                <div
                  key={note.label}
                  className="flex items-baseline gap-6 py-3"
                >
                  <dt className="w-16 font-mono text-[11px] tracking-[0.12em] text-white/40 uppercase">
                    {note.label}
                  </dt>
                  <motion.dd
                    key={mode + note.label}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                    className="text-[14.5px] text-white/85"
                  >
                    {note.value}
                  </motion.dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-[22px] bg-white/4 p-2 ring-1 ring-white/8">
            <Stage t={t} mode={mode} />
          </div>
        </div>
      </div>
    </Section>
  );
}
