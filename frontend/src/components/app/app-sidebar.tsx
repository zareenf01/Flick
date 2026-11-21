"use client";

import { motion } from "motion/react";
import { ChevronsUpDown, LayoutGrid, Menu, Plus, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Logo, LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/cn";

const NAV = [
  {
    href: "/dashboard",
    label: "Demos",
    icon: LayoutGrid,
    match: ["/dashboard", "/demos"],
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    match: ["/settings"],
  },
];

function NavList({ active }: { active: string | null }) {
  return (
    <nav className="mt-5 flex flex-col gap-0.5">
      {NAV.map(({ href, label, icon: Icon }) => {
        const isActive = active === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "relative flex h-9 items-center gap-2.5 rounded-lg px-3 text-[13.5px] transition-colors duration-150",
              isActive ? "text-ink" : "text-muted hover:text-ink",
            )}
          >
            {isActive && (
              <motion.span
                layoutId="app-nav"
                className="absolute inset-0 rounded-lg bg-white shadow-[0_1px_2px_rgba(23,24,28,0.06),0_0_0_1px_rgba(23,24,28,0.06)]"
                transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
              />
            )}
            <Icon className="relative size-4" strokeWidth={1.75} />
            <span className="relative">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarNav() {
  const pathname = usePathname();
  const active = NAV.find(({ match }) =>
    match.some((path) => pathname.startsWith(path)),
  );
  return <NavList active={active?.href ?? null} />;
}

export function AppSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-rule bg-[#F2F3F5] px-3 py-4 lg:flex">
      <div className="px-2">
        <Logo />
      </div>
      <Link
        href="/new"
        className="mt-6 flex h-10 items-center gap-2 rounded-xl bg-signal px-3.5 text-[13.5px] font-medium text-paper shadow-[0_1px_0_rgba(255,255,255,0.12)_inset,0_1px_2px_rgba(23,24,28,0.3)] transition-[background-color,transform] duration-150 hover:bg-[#DB4622] active:scale-[0.98]"
      >
        <Plus className="size-4" />
        New demo
        <span className="ml-auto rounded bg-white/12 px-1.5 py-0.5 font-mono text-[10px] text-white/60">
          N
        </span>
      </Link>
      <Suspense fallback={<NavList active={null} />}>
        <SidebarNav />
      </Suspense>
      <div className="mt-auto flex flex-col gap-3">
        <div className="rounded-xl bg-white p-3.5 ring-1 ring-rule">
          <div className="flex items-center justify-between text-[12.5px]">
            <span className="font-medium">Early access</span>
            <span className="font-mono text-[11px] text-muted">6 / 20</span>
          </div>
          <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-[#EDEEF1]">
            <div className="h-full w-[30%] rounded-full bg-signal" />
          </div>
          <p className="mt-2 text-[12px] text-muted">
            Demos recorded this month
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors duration-150 hover:bg-white/70"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-[#DCD9F7] text-[12px] font-semibold text-[#4B3FB8]">
            SC
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-medium">
              Sam Carter
            </span>
            <span className="block truncate text-[12px] text-muted">
              sam@lumen.so
            </span>
          </span>
          <ChevronsUpDown className="ml-auto size-3.5 text-muted" />
        </button>
      </div>
    </aside>
  );
}

export function MobileBar() {
  return (
    <div className="sticky top-0 z-40 flex h-14 items-center border-b border-rule bg-paper/85 px-4 backdrop-blur-xl lg:hidden">
      <Link href="/dashboard" aria-label="Demos">
        <LogoMark />
      </Link>
      <Link
        href="/new"
        className="ml-auto flex h-8 items-center gap-1.5 rounded-full bg-signal px-3 text-[13px] font-medium text-paper"
      >
        <Plus className="size-3.5" />
        New demo
      </Link>
      <button
        type="button"
        aria-label="Menu"
        className="ml-2 flex size-8 items-center justify-center rounded-full text-muted"
      >
        <Menu className="size-4.5" />
      </button>
    </div>
  );
}
