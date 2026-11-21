import Link from "next/link";
import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-7", className)} aria-hidden>
      <rect width="32" height="32" rx="9" fill="#F2542D" />
      <path
        d="M7.5 23c3 0 4.2-6.2 7.6-8.9 2.2-1.8 4.3-2.3 6.1-2.3"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="24.4" cy="9.4" r="3.1" fill="#fff" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2 text-[18px] font-semibold tracking-[-0.03em]",
        className,
      )}
    >
      <LogoMark />
      flick
    </Link>
  );
}
