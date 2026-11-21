import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-signal text-paper shadow-[0_1px_0_rgba(255,255,255,0.12)_inset,0_1px_2px_rgba(23,24,28,0.3)] hover:bg-[#DB4622]",
  secondary:
    "bg-white text-ink ring-1 ring-rule shadow-[0_1px_2px_rgba(23,24,28,0.05)] hover:ring-[#D2D2CD]",
  ghost: "text-muted hover:text-ink",
} as const;

const sizes = {
  sm: "h-8 px-3.5 text-[13px]",
  md: "h-10 px-4.5 text-[14px]",
  lg: "h-12 px-6 text-[15px]",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

export function buttonClass(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
) {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-[background-color,box-shadow,color,transform] duration-150 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({
  variant,
  size,
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return (
    <button className={buttonClass(variant, size, className)} {...props} />
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}
