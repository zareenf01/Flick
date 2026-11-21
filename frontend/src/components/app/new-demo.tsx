"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ChevronDown,
  Eye,
  EyeOff,
  Globe,
  KeyRound,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";
import {
  Card,
  Field,
  Input,
  Label,
  Segmented,
  Textarea,
  Toggle,
} from "./controls";
import { DemoThumb, PICKER_PLATES, PLATES, type Plate } from "./demo-thumb";

const AUDIENCES = [
  { value: "new", label: "New users" },
  { value: "customers", label: "Customers" },
  { value: "team", label: "My team" },
] as const;

const RATIOS = [
  { value: "16:9", label: "16:9" },
  { value: "1:1", label: "1:1" },
  { value: "9:16", label: "9:16" },
] as const;

type Ratio = (typeof RATIOS)[number]["value"];

const RATIO_CLASS: Record<Ratio, string> = {
  "16:9": "aspect-video w-full",
  "1:1": "aspect-square w-[62%]",
  "9:16": "aspect-[9/16] w-[40%]",
};

const STEPS = ["Details", "Storyboard", "Record"];

export function NewDemo() {
  const [login, setLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [audience, setAudience] =
    useState<(typeof AUDIENCES)[number]["value"]>("new");
  const [ratio, setRatio] = useState<Ratio>("16:9");
  const [plate, setPlate] = useState<Plate>("ember");
  const [advanced, setAdvanced] = useState(false);

  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-8 sm:py-10">
      <ol className="flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
        {STEPS.map((step, i) => (
          <li key={step} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-full text-[10px]",
                i === 0 ? "bg-signal text-paper" : "bg-[#E5E7EA]",
              )}
            >
              {i + 1}
            </span>
            <span className={i === 0 ? "text-ink" : undefined}>{step}</span>
            {i < STEPS.length - 1 && <span className="mx-1 h-px w-6 bg-rule" />}
          </li>
        ))}
      </ol>
      <h1 className="mt-6 text-[26px] font-medium tracking-[-0.03em] sm:text-[30px]">
        New demo
      </h1>
      <p className="mt-1.5 text-[14.5px] text-muted">
        Tell the agent where to go and what to show. You&apos;ll review its plan
        before anything is recorded.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <form
          className="flex min-w-0 flex-col gap-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <Card className="flex flex-col gap-5 p-5 sm:p-6">
            <Field label="App URL">
              <div className="relative">
                <Globe
                  className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted"
                  strokeWidth={1.75}
                />
                <Input
                  defaultValue="https://app.lumen.so"
                  type="url"
                  className="pl-10"
                />
              </div>
            </Field>
            <Field
              label="What should the demo show?"
              hint="One flow works best"
            >
              <Textarea defaultValue="Show a new teammate how to create a task, assign it to someone and mark it as done." />
            </Field>
            <div className="flex flex-col gap-2">
              <Label>Who is it for?</Label>
              <Segmented
                value={audience}
                options={AUDIENCES}
                onChange={setAudience}
                className="self-start"
              />
              <p className="text-[12.5px] text-muted">
                Changes how much the captions explain.
              </p>
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#F2F3F5]">
                <KeyRound className="size-4" strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="text-[14.5px] font-medium">
                  Sign in with a test account
                </p>
                <p className="mt-0.5 text-[13px] text-muted">
                  Encrypted, used for this run only, then deleted.
                </p>
              </div>
              <span className="ml-auto pt-1">
                <Toggle
                  checked={login}
                  onChange={setLogin}
                  label="Sign in with a test account"
                />
              </span>
            </div>
            <AnimatePresence initial={false}>
              {login && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-3 pt-5 sm:grid-cols-2">
                    <Field label="Email">
                      <Input
                        defaultValue="demo@lumen.so"
                        type="email"
                        autoComplete="off"
                      />
                    </Field>
                    <Field label="Password">
                      <div className="relative">
                        <Input
                          defaultValue="lumen-demo-2026"
                          type={showPassword ? "text" : "password"}
                          autoComplete="off"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          onClick={() => setShowPassword((value) => !value)}
                          className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-muted hover:text-ink"
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                    </Field>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          <Card className="p-5 sm:p-6">
            <button
              type="button"
              onClick={() => setAdvanced((value) => !value)}
              className="flex w-full items-center text-left text-[14.5px] font-medium"
            >
              Advanced
              <span className="ml-2 text-[13px] font-normal text-muted">
                Length, pages to avoid
              </span>
              <ChevronDown
                className={cn(
                  "ml-auto size-4 text-muted transition-transform duration-300",
                  advanced && "rotate-180",
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {advanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-3 pt-5 sm:grid-cols-2">
                    <Field label="Longest demo" hint="seconds">
                      <Input defaultValue="45" inputMode="numeric" />
                    </Field>
                    <Field label="Never open" hint="comma separated">
                      <Input defaultValue="/billing, /admin" />
                    </Field>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="rounded-full px-4 py-2 text-[14px] text-muted transition-colors hover:text-ink"
            >
              Cancel
            </Link>
            <Link
              href="/demos/lumen-create-task/storyboard"
              className="group ml-auto flex h-11 items-center gap-2 rounded-full bg-signal px-5 text-[14px] font-medium text-paper shadow-[0_1px_0_rgba(255,255,255,0.12)_inset,0_1px_2px_rgba(23,24,28,0.3)] transition-[background-color,transform] duration-150 hover:bg-[#DB4622] active:scale-[0.97]"
            >
              Explore the app
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </form>

        <div className="lg:sticky lg:top-8 lg:self-start">
          <Card className="overflow-hidden">
            <div className="flex h-[260px] items-center justify-center bg-[#F2F3F5] p-5">
              <motion.div
                layout
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                className={cn("overflow-hidden rounded-xl", RATIO_CLASS[ratio])}
              >
                <DemoThumb
                  t={0.6}
                  plate={plate}
                  className="flex h-full items-center"
                  padding={0.09}
                />
              </motion.div>
            </div>
            <div className="flex flex-col gap-5 p-5">
              <div className="flex items-center justify-between">
                <Label>Aspect ratio</Label>
                <Segmented
                  value={ratio}
                  options={RATIOS}
                  onChange={setRatio}
                  mono
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Background</Label>
                <div className="flex gap-1.5">
                  {PICKER_PLATES.map((key) => (
                    <button
                      key={key}
                      type="button"
                      aria-label={`${key} background`}
                      onClick={() => setPlate(key)}
                      className={cn(
                        "size-7 rounded-full ring-1 ring-black/10 transition-[box-shadow,transform] duration-150 active:scale-90",
                        PLATES[key],
                        plate === key &&
                          "ring-2 ring-signal ring-offset-2 ring-offset-white",
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="border-t border-[#EDEEF1] pt-5">
                <p className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
                  What happens next
                </p>
                <ol className="mt-3 flex flex-col gap-3 text-[13.5px]">
                  {[
                    ["The agent explores your app", "About a minute"],
                    [
                      "You review the storyboard",
                      "Edit, reorder or cut scenes",
                    ],
                    ["It records while you watch", "Pause or redirect anytime"],
                  ].map(([title, note], i) => (
                    <li key={title} className="flex gap-3">
                      <span className="font-mono text-[11px] leading-5 text-muted">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <span className="block">{title}</span>
                        <span className="block text-[12.5px] text-muted">
                          {note}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
              <p className="flex items-center gap-2 rounded-xl bg-[#F5F6F8] px-3 py-2.5 text-[12.5px] text-muted">
                <Lock className="size-3.5 shrink-0" />
                Password fields are blurred in every frame.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
