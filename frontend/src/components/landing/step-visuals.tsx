"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  Copy,
  Film,
  FileText,
  Globe,
  KeyRound,
  MousePointerClick,
  Pause,
  SkipForward,
  Sparkles,
  Undo2,
} from "lucide-react";
import { LumenApp } from "@/components/demo/lumen-app";
import { lumenState } from "@/components/demo/lumen-script";
import { ScaledBox } from "@/components/demo/scaled-box";
import { useLoopTime } from "@/hooks/use-loop-time";
import { timecode } from "@/lib/timeline";

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[22px] bg-white p-5 shadow-[0_1px_2px_rgba(23,24,28,0.04),0_24px_60px_-24px_rgba(23,24,28,0.18)] ring-1 ring-rule sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

function FieldRow({
  icon: Icon,
  label,
  value,
  muted = false,
}: {
  icon: typeof Globe;
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div>
      <p className="text-[12px] font-medium text-muted">{label}</p>
      <div className="mt-1.5 flex min-h-11 items-center gap-2.5 rounded-xl bg-[#F5F6F8] px-3.5 py-2.5 text-[14px] ring-1 ring-[#E8EAED]">
        <Icon className="size-4 shrink-0 text-muted" strokeWidth={1.75} />
        <span className={muted ? "text-muted" : "text-ink"}>{value}</span>
      </div>
    </div>
  );
}

export function PasteVisual() {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-medium">New demo</p>
        <span className="font-mono text-[10.5px] tracking-wider text-muted">
          STEP 1 OF 3
        </span>
      </div>
      <div className="mt-5 flex flex-col gap-4">
        <FieldRow icon={Globe} label="App URL" value="https://app.lumen.so" />
        <FieldRow
          icon={Sparkles}
          label="What should the demo show?"
          value="Show a new teammate how to create a task, assign it and mark it done."
        />
        <div className="rounded-xl ring-1 ring-[#E8EAED]">
          <div className="flex items-center gap-2.5 px-3.5 py-3">
            <KeyRound className="size-4 text-muted" strokeWidth={1.75} />
            <span className="text-[14px]">Sign in with a test account</span>
            <span className="ml-auto flex h-5 w-9 items-center rounded-full bg-ink p-0.5">
              <span className="ml-auto size-4 rounded-full bg-white" />
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 border-t border-[#E8EAED] p-2">
            <span className="rounded-lg bg-[#F5F6F8] px-3 py-2 text-[13px]">
              demo@lumen.so
            </span>
            <span className="rounded-lg bg-[#F5F6F8] px-3 py-2 font-mono text-[13px] tracking-widest text-muted">
              ••••••••••
            </span>
          </div>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <div className="flex rounded-full bg-[#F0F1F4] p-0.5 font-mono text-[11px]">
          {["16:9", "1:1", "9:16"].map((ratio, i) => (
            <span
              key={ratio}
              className={`rounded-full px-2.5 py-1 ${i === 0 ? "bg-white text-ink shadow-sm" : "text-muted"}`}
            >
              {ratio}
            </span>
          ))}
        </div>
        <span className="flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-[13.5px] font-medium text-paper">
          Start exploring
        </span>
      </div>
    </Card>
  );
}

const LOG = [
  { at: 0.4, text: "Opened app.lumen.so/tasks", icon: Globe },
  { at: 1.3, text: "Clicked New task", icon: MousePointerClick },
  { at: 2.3, text: "Typed “Prepare launch checklist”", icon: Sparkles },
  {
    at: 3.3,
    text: "Opened Assignee and chose Maya Chen",
    icon: MousePointerClick,
  },
  { at: 4.3, text: "Clicked Create task", icon: MousePointerClick },
  { at: 5.3, text: "Marked the new task as done", icon: Check },
];

export function LiveVisual({ active }: { active: boolean }) {
  const [t] = useLoopTime(8, { playing: active });
  const visible = LOG.filter((line) => t >= line.at);
  return (
    <Card className="p-3! sm:p-3!">
      <div className="relative overflow-hidden rounded-[14px] bg-[#0E0F12] p-1.5">
        <ScaledBox width={1280} height={800} className="rounded-[10px]">
          <LumenApp state={lumenState(6.1)} />
        </ScaledBox>
        <span className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-[#17181C]/85 py-1 pr-3 pl-2 font-mono text-[11px] text-white backdrop-blur">
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-70" />
            <span className="relative size-2 rounded-full bg-signal" />
          </span>
          REC {timecode(t)}
        </span>
      </div>
      <div className="h-[168px] overflow-hidden px-2 pt-3">
        <AnimatePresence initial={false}>
          {visible.slice(-4).map((line) => (
            <motion.div
              key={line.at}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="flex items-center gap-3 py-1.5 text-[13px]"
            >
              <span className="font-mono text-[11px] text-muted tabular-nums">
                {timecode(line.at + 0.8)}
              </span>
              <line.icon className="size-3.5 text-muted" strokeWidth={1.75} />
              <span className="truncate">{line.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex gap-2 border-t border-[#EDEEF1] px-2 pt-3 pb-1">
        {[
          { label: "Pause", icon: Pause },
          { label: "Skip step", icon: SkipForward },
          { label: "Redirect", icon: Undo2 },
        ].map(({ label, icon: Icon }) => (
          <span
            key={label}
            className="flex h-8 items-center gap-1.5 rounded-full bg-[#F2F3F5] px-3 text-[12.5px] text-ink"
          >
            <Icon className="size-3.5" strokeWidth={1.75} />
            {label}
          </span>
        ))}
      </div>
    </Card>
  );
}

export function ShareVisual() {
  const scenes = [
    "Open a new task",
    "Name it",
    "Assign a teammate",
    "Create the task",
    "Mark it done",
  ];
  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-medium">
          Lumen: create and assign a task
        </p>
        <span className="rounded-full bg-[#E9F7EE] px-2.5 py-1 text-[11.5px] font-medium text-[#1C7C43]">
          Ready
        </span>
      </div>
      <div className="mt-5 flex flex-col gap-1.5">
        {scenes.map((scene, i) => (
          <div
            key={scene}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] ring-1 ring-[#E8EAED]"
          >
            <span className="font-mono text-[11px] text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            {scene}
            <span className="ml-auto font-mono text-[11px] text-muted tabular-nums">
              {["2.4s", "2.3s", "1.9s", "1.8s", "3.0s"][i]}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {[
          { label: "Interactive", icon: MousePointerClick },
          { label: "MP4", icon: Film },
          { label: "Guide", icon: FileText },
        ].map(({ label, icon: Icon }) => (
          <span
            key={label}
            className="flex flex-col items-start gap-3 rounded-xl bg-[#F5F6F8] p-3 text-[13px] ring-1 ring-[#E8EAED]"
          >
            <Icon className="size-4 text-muted" strokeWidth={1.75} />
            {label}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#F5F6F8] py-1.5 pr-1.5 pl-3.5 ring-1 ring-[#E8EAED]">
        <span className="truncate font-mono text-[12px] text-muted">
          /d/lumen-create-task
        </span>
        <span className="ml-auto flex h-8 items-center gap-1.5 rounded-lg bg-ink px-3 text-[12.5px] font-medium text-paper">
          <Copy className="size-3.5" />
          Copy link
        </span>
      </div>
    </Card>
  );
}
