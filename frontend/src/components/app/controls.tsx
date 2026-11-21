"use client";

import { motion } from "motion/react";
import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("rounded-[20px] bg-white ring-1 ring-rule", className)}>
      {children}
    </div>
  );
}

export function Label({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: string;
}) {
  return (
    <span className="flex items-baseline justify-between text-[13px] font-medium text-ink">
      {children}
      {hint && (
        <span className="text-[12px] font-normal text-muted">{hint}</span>
      )}
    </span>
  );
}

const fieldClass =
  "w-full rounded-xl bg-[#F5F6F8] px-3.5 text-[14.5px] text-ink ring-1 ring-[#E5E7EA] outline-none transition-[box-shadow,background-color] duration-150 placeholder:text-[#A0A4AC] hover:ring-[#D9DCE1] focus:bg-white focus:ring-2 focus:ring-focus/40";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(fieldClass, "h-11", className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        fieldClass,
        "min-h-24 resize-none py-3 leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-2", className)}>
      <Label hint={hint}>{label}</Label>
      {children}
    </label>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex h-6 w-10 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200",
        checked ? "bg-signal" : "bg-[#D6D9DE]",
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
        className={cn(
          "size-5 rounded-full bg-white shadow-sm",
          checked && "ml-auto",
        )}
      />
    </button>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  className,
  mono = false,
}: {
  value: T;
  options: readonly { value: T; label: ReactNode }[];
  onChange: (value: T) => void;
  className?: string;
  mono?: boolean;
}) {
  const id = useId();
  return (
    <div
      className={cn("inline-flex rounded-full bg-[#EEEFF2] p-0.5", className)}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "relative rounded-full px-3 py-1.5 text-[12.5px] transition-colors duration-150",
            mono && "font-mono text-[11.5px]",
            value === option.value ? "text-ink" : "text-muted hover:text-ink",
          )}
        >
          {value === option.value && (
            <motion.span
              layoutId={`seg-${id}`}
              className="absolute inset-0 rounded-full bg-white shadow-[0_1px_2px_rgba(23,24,28,0.08),0_0_0_1px_rgba(23,24,28,0.04)]"
              transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
            />
          )}
          <span className="relative">{option.label}</span>
        </button>
      ))}
    </div>
  );
}

export function Slider({
  value,
  min,
  max,
  step,
  onChange,
  format,
  label,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format: (value: number) => string;
  label: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <span className="font-mono text-[11.5px] text-muted tabular-nums">
          {format(value)}
        </span>
      </div>
      <div className="relative flex h-5 items-center">
        <div className="h-1 w-full rounded-full bg-[#E5E7EA]">
          <div
            className="h-full rounded-full bg-signal"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span
          className="pointer-events-none absolute size-4 -translate-x-1/2 rounded-full bg-white shadow-[0_1px_3px_rgba(23,24,28,0.25),0_0_0_1px_rgba(23,24,28,0.08)]"
          style={{ left: `${pct}%` }}
        />
        <input
          type="range"
          aria-label={label}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
}

const STATUS = {
  ready: { label: "Ready", className: "bg-[#E9F7EE] text-[#1C7C43]" },
  recording: { label: "Recording", className: "bg-[#FFEBE4] text-[#B93A17]" },
  draft: { label: "Draft", className: "bg-[#F0F1F4] text-muted" },
  waiting: { label: "Needs you", className: "bg-[#FEF4D7] text-[#92650B]" },
} as const;

export type Status = keyof typeof STATUS;

export function StatusBadge({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] font-medium",
        STATUS[status].className,
        className,
      )}
    >
      {status === "recording" ? (
        <span className="relative flex size-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-70" />
          <span className="relative size-1.5 rounded-full bg-signal" />
        </span>
      ) : (
        <span className="size-1.5 rounded-full bg-current opacity-70" />
      )}
      {STATUS[status].label}
    </span>
  );
}
