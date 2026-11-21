"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  Copy,
  Download,
  FileText,
  Film,
  Globe,
  ImageIcon,
  Link2,
  Lock,
  RefreshCw,
  Users,
} from "lucide-react";
import { useState } from "react";
import { HeroPlayer } from "@/components/landing/hero-player";
import { cn } from "@/lib/cn";
import { Card, Label, Segmented } from "./controls";

const VISIBILITY = [
  {
    value: "public",
    label: "Anyone",
    icon: Globe,
    note: "Listed on your public page",
  },
  {
    value: "link",
    label: "With the link",
    icon: Link2,
    note: "Only people you send it to",
  },
  {
    value: "private",
    label: "Only me",
    icon: Lock,
    note: "Hidden until you share it",
  },
] as const;

type Visibility = (typeof VISIBILITY)[number]["value"];

function CopyButton({
  value,
  label = "Copy",
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className="relative flex h-8 min-w-[76px] items-center justify-center gap-1.5 overflow-hidden rounded-lg bg-signal px-3 text-[12.5px] font-medium text-paper transition-transform duration-150 active:scale-95"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={copied ? "done" : "idle"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1.5"
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
          {copied ? "Copied" : label}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

const EMBED_IFRAME = `<iframe
  src="/embed/lumen-create-task"
  width="100%"
  style="aspect-ratio: 16 / 9; border: 0"
  allow="fullscreen"
></iframe>`;

const EMBED_SCRIPT = `<div data-flick="lumen-create-task"></div>
<script src="/embed.js" async></script>`;

export function Share() {
  const [visibility, setVisibility] = useState<Visibility>("link");
  const [embed, setEmbed] = useState<"iframe" | "script">("iframe");
  const [resolution, setResolution] = useState<"720p" | "1080p">("1080p");
  const code = embed === "iframe" ? EMBED_IFRAME : EMBED_SCRIPT;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 py-6 sm:px-8 sm:py-8">
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="flex min-w-0 flex-col gap-4">
          <HeroPlayer className="shadow-[0_24px_70px_-40px_rgba(23,24,28,0.55)]" />
          <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F2F3F5]">
              <RefreshCw className="size-4" strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <p className="text-[14.5px] font-medium">Keep it up to date</p>
              <p className="mt-0.5 text-[13px] text-muted">
                Last recorded Nov 21. Re-run the same steps and see which scenes
                changed.
              </p>
            </div>
            <button
              type="button"
              className="flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-[13px] ring-1 ring-rule transition-colors hover:bg-[#F5F6F8] sm:ml-auto"
            >
              Check for changes
            </button>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card className="p-5">
            <Label>Who can view</Label>
            <div className="mt-3 flex flex-col gap-1.5">
              {VISIBILITY.map(({ value, label, icon: Icon, note }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setVisibility(value)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-[background-color,box-shadow] duration-150",
                    visibility === value
                      ? "bg-[#F5F6F8] shadow-[0_0_0_1.5px_#F2542D]"
                      : "hover:bg-[#FFFFFF]",
                  )}
                >
                  <Icon className="size-4 text-muted" strokeWidth={1.75} />
                  <span>
                    <span className="block text-[13.5px] font-medium">
                      {label}
                    </span>
                    <span className="block text-[12px] text-muted">{note}</span>
                  </span>
                  <span
                    className={cn(
                      "ml-auto flex size-4 items-center justify-center rounded-full ring-1 transition-colors",
                      visibility === value
                        ? "bg-signal ring-signal"
                        : "ring-[#CDD0D6]",
                    )}
                  >
                    {visibility === value && (
                      <span className="size-1.5 rounded-full bg-paper" />
                    )}
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#F5F6F8] py-1 pr-1 pl-3.5 ring-1 ring-[#E5E7EA]">
              <Users className="size-3.5 shrink-0 text-muted" />
              <span className="truncate font-mono text-[12px] text-muted">
                /d/lumen-create-task
              </span>
              <span className="ml-auto">
                <CopyButton value="/d/lumen-create-task" label="Copy link" />
              </span>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <Label>Embed</Label>
              <Segmented
                value={embed}
                options={[
                  { value: "iframe", label: "iframe" },
                  { value: "script", label: "Script" },
                ]}
                onChange={setEmbed}
                mono
              />
            </div>
            <div className="relative mt-3">
              <pre className="overflow-x-auto rounded-xl bg-[#0E0F12] p-4 font-mono text-[11.5px] leading-[1.7] text-white/80">
                {code}
              </pre>
              <span className="absolute top-2.5 right-2.5">
                <CopyButton value={code} />
              </span>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <Label>Download</Label>
              <Segmented
                value={resolution}
                options={[
                  { value: "720p", label: "720p" },
                  { value: "1080p", label: "1080p" },
                ]}
                onChange={setResolution}
                mono
              />
            </div>
            <div className="mt-3 flex flex-col divide-y divide-[#EDEEF1]">
              {[
                {
                  icon: Film,
                  title: "MP4 video",
                  meta: `${resolution} · 60 fps · about 4 MB`,
                },
                {
                  icon: ImageIcon,
                  title: "GIF",
                  meta: "720p · 15 fps · for READMEs",
                },
                {
                  icon: FileText,
                  title: "Markdown guide",
                  meta: "5 steps with screenshots",
                },
              ].map(({ icon: Icon, title, meta }) => (
                <div key={title} className="flex items-center gap-3 py-3">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-[#F2F3F5]">
                    <Icon className="size-4" strokeWidth={1.75} />
                  </span>
                  <span>
                    <span className="block text-[13.5px] font-medium">
                      {title}
                    </span>
                    <span className="block font-mono text-[11px] text-muted">
                      {meta}
                    </span>
                  </span>
                  <button
                    type="button"
                    aria-label={`Download ${title}`}
                    className="ml-auto flex size-8 items-center justify-center rounded-full ring-1 ring-rule transition-colors hover:bg-[#F5F6F8]"
                  >
                    <Download className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
