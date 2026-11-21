"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#motion", label: "Motion" },
  { href: "#outputs", label: "Outputs" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (value) => setScrolled(value > 24));

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-7"
    >
      <div
        className={cn(
          "flex h-[52px] w-full max-w-[880px] items-center rounded-full pr-1.5 pl-4 transition-[background-color,box-shadow] duration-300",
          scrolled
            ? "bg-white/80 shadow-[0_1px_2px_rgba(11,11,15,0.05),0_12px_32px_-12px_rgba(11,11,15,0.18)] ring-1 ring-black/6 backdrop-blur-xl"
            : "bg-white/40 ring-1 ring-black/4 backdrop-blur-md",
        )}
      >
        <Logo />
        <nav className="mx-auto hidden items-center gap-0.5 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-1.5 text-[14px] text-muted transition-colors duration-150 hover:bg-black/4 hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link
            href="/new"
            className="flex h-10 items-center gap-2 rounded-full bg-signal px-4.5 text-[14px] font-medium text-white shadow-[0_8px_20px_-8px_rgba(242,84,45,0.6)] transition-[background-color,transform] duration-150 hover:bg-[#DB4622] active:scale-[0.97]"
          >
            <span className="size-1.5 rounded-full bg-white" />
            Record a demo
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
