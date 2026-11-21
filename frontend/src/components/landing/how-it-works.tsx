"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Section, SectionLabel, SectionTitle } from "./section";
import { LiveVisual, PasteVisual, ShareVisual } from "./step-visuals";

const STEPS = [
  {
    title: "Point it at your app",
    body: "Paste a URL and describe the flow you want to show. If the app needs a login, add a test account. Flick stores it encrypted and deletes it after the run.",
  },
  {
    title: "Watch it work",
    body: "The agent opens your app in a real browser and you see every step as it happens. Pause it, skip a step or tell it to go somewhere else.",
  },
  {
    title: "Share the result",
    body: "You get an interactive demo, an MP4 and a written guide from the same run. Change a caption or retake one scene without recording the rest.",
  },
];

function Visual({ index, active }: { index: number; active: boolean }) {
  if (index === 0) return <PasteVisual />;
  if (index === 1) return <LiveVisual active={active} />;
  return <ShareVisual />;
}

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const scaled = Math.min(0.9999, Math.max(0, value)) * STEPS.length;
    setActive(Math.floor(scaled));
    setStepProgress(scaled % 1);
  });

  return (
    <Section id="how" tone="outline">
      <div className="px-5 pt-20 sm:px-10 sm:pt-28">
        <SectionLabel index="01">How it works</SectionLabel>
        <SectionTitle className="mt-5 max-w-[16ch]">
          From a link to a finished demo in three steps
        </SectionTitle>
      </div>

      <div className="flex flex-col gap-14 px-5 pt-14 pb-20 sm:px-10 md:hidden">
        {STEPS.map((step, i) => (
          <div key={step.title}>
            <p className="font-mono text-[11px] text-muted">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-2 font-display text-[24px] font-medium tracking-[-0.025em]">
              {step.title}
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">
              {step.body}
            </p>
            <div className="mt-6">
              <Visual index={i} active />
            </div>
          </div>
        ))}
      </div>

      <div ref={ref} className="relative hidden h-[300vh] md:block">
        <div className="sticky top-0 grid h-screen grid-cols-[1fr_1.15fr] items-center gap-16 px-10">
          <ol className="flex flex-col gap-2">
            {STEPS.map((step, i) => (
              <li
                key={step.title}
                className={cn(
                  "relative py-5 pl-7 transition-opacity duration-500",
                  i === active ? "opacity-100" : "opacity-35",
                )}
              >
                <span className="absolute top-5 bottom-5 left-0 w-px bg-rule">
                  <span
                    className="absolute inset-x-0 top-0 bg-signal"
                    style={{
                      height: `${i < active ? 100 : i === active ? stepProgress * 100 : 0}%`,
                    }}
                  />
                </span>
                <p className="font-mono text-[11px] text-muted">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-[30px] font-medium tracking-[-0.03em]">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[26rem] text-[15.5px] leading-relaxed text-muted">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
          <div className="relative">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={active}
                initial={{
                  opacity: 0,
                  y: 24,
                  scale: 0.98,
                  filter: "blur(6px)",
                }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -16, scale: 0.98, filter: "blur(6px)" }}
                transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
              >
                <Visual index={active} active />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  );
}
