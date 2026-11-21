"use client";

import { motion, useInView } from "motion/react";
import {
  ArrowRight,
  Check,
  Copy,
  Download,
  Film,
  RefreshCw,
} from "lucide-react";
import { useRef } from "react";
import { LumenApp } from "@/components/demo/lumen-app";
import { lumenState } from "@/components/demo/lumen-script";
import { ScaledBox } from "@/components/demo/scaled-box";
import { useLoopTime } from "@/hooks/use-loop-time";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/reveal";
import { PLATES, type Plate } from "@/components/app/demo-thumb";
import { Section, SectionLabel, SectionTitle } from "./section";

function Tile({
  title,
  body,
  className,
  children,
  delay = 0,
  plate,
}: {
  plate: Plate;
  title: string;
  body: string;
  className?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className={cn("flex", className)}>
      <div className="group flex w-full flex-col overflow-hidden rounded-[28px] bg-canvas transition-shadow duration-300 hover:shadow-[0_30px_70px_-34px_rgba(11,11,15,0.35)]">
        <div
          className={cn(
            "relative m-2 flex-1 overflow-hidden rounded-[22px]",
            PLATES[plate],
          )}
        >
          {children}
        </div>
        <div className="px-5 pt-3 pb-5 sm:px-6 sm:pb-6">
          <h3 className="font-display text-[18px] font-medium tracking-[-0.02em]">
            {title}
          </h3>
          <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">
            {body}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

function InteractiveDemo() {
  return (
    <div className="flex h-full items-center justify-center p-6 sm:p-10">
      <div className="relative w-full max-w-[560px] overflow-hidden rounded-[12px] shadow-[0_24px_60px_-20px_rgba(23,24,28,0.3),0_0_0_1px_rgba(23,24,28,0.06)]">
        <ScaledBox width={1280} height={800}>
          <LumenApp state={lumenState(0)} />
          <span className="absolute top-[70px] left-[1124px] h-12 w-32 rounded-[12px] ring-[3px] ring-signal" />
          <span className="absolute top-[70px] left-[1124px] h-12 w-32 animate-ping rounded-[12px] ring-2 ring-signal/60" />
          <div className="absolute top-[134px] left-[772px] w-[480px] rounded-[20px] bg-[#17181C] p-7 text-white shadow-2xl">
            <span className="absolute -top-2.5 right-[60px] size-5 rotate-45 rounded-[3px] bg-[#17181C]" />
            <p className="font-mono text-[18px] tracking-wider text-white/50">
              STEP 1 OF 5
            </p>
            <p className="mt-2 text-[32px] leading-tight font-medium tracking-[-0.02em]">
              Click New task to start
            </p>
            <div className="mt-5 flex items-center justify-between">
              <span className="flex gap-1.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-2 rounded-full",
                      i === 0 ? "w-8 bg-white" : "w-2 bg-white/25",
                    )}
                  />
                ))}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white px-6 py-3 text-[22px] font-medium text-[#17181C]">
                Next
                <ArrowRight className="size-6" />
              </span>
            </div>
          </div>
        </ScaledBox>
      </div>
    </div>
  );
}

function VideoExport() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [t] = useLoopTime(5, { playing: inView });
  const pct = Math.min(100, Math.round((t / 3.6) * 100));
  const done = pct >= 100;
  return (
    <div
      ref={ref}
      className="flex h-full flex-col justify-center gap-4 p-6 sm:p-8"
    >
      <div className="grid grid-cols-4 gap-1.5">
        {[0.5, 4.2, 6.1, 9.8].map((time, i) => (
          <div
            key={time}
            className="overflow-hidden rounded-md ring-1 ring-black/5"
          >
            <ScaledBox width={1280} height={800}>
              <LumenApp state={lumenState(time)} />
            </ScaledBox>
            <span className="sr-only">Frame {i + 1}</span>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-white p-4 ring-1 ring-[#E8EAED]">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-[#F2F3F5]">
            <Film className="size-4 text-muted" strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13.5px] font-medium">
              lumen-create-task.mp4
            </p>
            <p className="font-mono text-[11px] text-muted">
              1080P · 60 FPS · 4.2 MB
            </p>
          </div>
          <span
            className={cn(
              "ml-auto flex size-8 items-center justify-center rounded-full transition-colors duration-300",
              done ? "bg-ink text-paper" : "bg-[#F2F3F5] text-muted",
            )}
          >
            {done ? (
              <Check className="size-4" />
            ) : (
              <Download className="size-4" />
            )}
          </span>
        </div>
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-[#EDEEF1]">
          <div
            className="h-full rounded-full bg-signal"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 font-mono text-[11px] text-muted tabular-nums">
          {done ? "Ready to download" : `Rendering ${pct}%`}
        </p>
      </div>
    </div>
  );
}

function Guide() {
  return (
    <div className="h-full p-6 sm:p-8">
      <div className="rounded-2xl bg-white p-5 text-[13px] ring-1 ring-[#E8EAED]">
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-semibold">Create and assign a task</p>
          <Copy className="size-3.5 text-muted" />
        </div>
        <ol className="mt-4 flex flex-col gap-3">
          {[
            ["Click ", "New task", " in the top right."],
            ["Type a name, like ", "Prepare launch checklist", "."],
            ["Open ", "Assignee", " and choose a teammate."],
          ].map(([a, b, c], i) => (
            <li key={i} className="flex gap-3">
              <span className="font-mono text-[11px] leading-5 text-muted">
                {i + 1}.
              </span>
              <span className="leading-5">
                {a}
                <span className="rounded bg-[#F2F3F5] px-1 py-0.5 font-medium">
                  {b}
                </span>
                {c}
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-4 overflow-hidden rounded-lg ring-1 ring-black/5">
          <ScaledBox width={1280} height={420}>
            <LumenApp state={lumenState(6.1)} />
          </ScaledBox>
        </div>
      </div>
    </div>
  );
}

function Retake() {
  const scenes = ["Open", "Name", "Assign", "Create", "Done"];
  return (
    <div className="flex h-full flex-col justify-center gap-2 p-6 sm:p-8">
      {scenes.map((scene, i) => {
        const retaking = i === 2;
        return (
          <div
            key={scene}
            className={cn(
              "flex items-center gap-3 rounded-xl bg-white px-3.5 py-2.5 text-[13px] ring-1",
              retaking ? "ring-signal/50" : "ring-[#E8EAED]",
            )}
          >
            <span className="font-mono text-[11px] text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            {scene}
            {retaking ? (
              <span className="ml-auto flex items-center gap-1.5 text-[12px] text-signal">
                <RefreshCw className="size-3.5 animate-spin [animation-duration:1.6s]" />
                Retaking
              </span>
            ) : (
              <Check className="ml-auto size-3.5 text-muted" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Embed() {
  return (
    <div className="flex h-full items-center p-6 sm:p-8">
      <pre className="w-full overflow-hidden rounded-2xl bg-[#0E0F12] p-5 font-mono text-[12px] leading-6 text-white/80">
        <span className="text-white/40">{"<"}</span>
        <span className="text-[#FF9A73]">iframe</span>
        {"\n  "}
        <span className="text-[#9DB0FF]">src</span>
        <span className="text-white/40">=</span>
        <span className="text-[#A7E3B4]">
          &quot;/embed/lumen-create-task&quot;
        </span>
        {"\n  "}
        <span className="text-[#9DB0FF]">width</span>
        <span className="text-white/40">=</span>
        <span className="text-[#A7E3B4]">&quot;100%&quot;</span>
        {"\n  "}
        <span className="text-[#9DB0FF]">allow</span>
        <span className="text-white/40">=</span>
        <span className="text-[#A7E3B4]">&quot;fullscreen&quot;</span>
        {"\n"}
        <span className="text-white/40">{"/>"}</span>
      </pre>
    </div>
  );
}

export function Outputs() {
  return (
    <Section id="outputs" className="px-5 py-20 sm:px-10 sm:py-28">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <SectionLabel index="03">Outputs</SectionLabel>
          <SectionTitle className="mt-5 max-w-[15ch]">
            One run, three ways to share it
          </SectionTitle>
        </div>
        <p className="max-w-[24rem] text-[15.5px] leading-relaxed text-muted">
          Every format is built from the same recording, so the video, the
          clickable demo and the guide always match.
        </p>
      </div>
      <motion.div className="mt-12 grid gap-3 md:grid-cols-6">
        <Tile
          plate="cobalt"
          className="md:col-span-4"
          title="Interactive demo"
          body="Viewers click through your app themselves, one step at a time, with a hint on what to do next."
        >
          <InteractiveDemo />
        </Tile>
        <Tile
          plate="graphite"
          className="md:col-span-2"
          delay={0.08}
          title="MP4 video"
          body="Rendered at 1080p and 60 fps, ready for a launch post or a sales email."
        >
          <VideoExport />
        </Tile>
        <Tile
          plate="lilac"
          className="md:col-span-2"
          title="Written guide"
          body="Markdown with a screenshot for each step, for help centers and docs."
        >
          <Guide />
        </Tile>
        <Tile
          plate="lime"
          className="md:col-span-2"
          delay={0.08}
          title="Retake one scene"
          body="If one step is wrong, redo just that step. The rest of the demo stays as it is."
        >
          <Retake />
        </Tile>
        <Tile
          plate="aqua"
          className="md:col-span-2"
          delay={0.16}
          title="Embed anywhere"
          body="Paste one snippet into your docs, landing page or help center."
        >
          <Embed />
        </Tile>
      </motion.div>
    </Section>
  );
}
