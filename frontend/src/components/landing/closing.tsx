"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { EyeOff, KeyRound, Plus, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/logo";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";
import { RecordForm } from "./record-form";
import { Section, SectionLabel, SectionTitle } from "./section";

const SAFETY = [
  {
    icon: EyeOff,
    title: "Sensitive fields are hidden",
    body: "Password, card and token fields are masked in every frame before anything is saved.",
  },
  {
    icon: KeyRound,
    title: "Test logins don't stick around",
    body: "Credentials are encrypted, used for one run, then deleted. They never appear in logs.",
  },
  {
    icon: ShieldCheck,
    title: "It asks before risky clicks",
    body: "The agent skips delete, payment and send actions unless you approve that scene.",
  },
];

export function Safety() {
  return (
    <Section tone="canvas" className="grid gap-2.5 p-2.5 sm:p-3 md:grid-cols-3">
      {SAFETY.map(({ icon: Icon, title, body }, i) => (
        <Reveal
          key={title}
          delay={i * 0.06}
          className="rounded-[24px] bg-white"
        >
          <div className="h-full px-5 py-10 sm:px-10 sm:py-12">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-signal text-white">
              <Icon className="size-4" strokeWidth={1.75} />
            </span>
            <h3 className="mt-5 text-[16px] font-medium tracking-[-0.01em]">
              {title}
            </h3>
            <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">
              {body}
            </p>
          </div>
        </Reveal>
      ))}
    </Section>
  );
}

const FAQ = [
  {
    q: "Does it work with apps behind a login?",
    a: "Yes. Add a test account when you create the demo. Flick encrypts it, signs in at the start of the run and deletes the credentials when the run ends.",
  },
  {
    q: "What happens if the agent gets stuck?",
    a: "It stops and tells you what it was trying to do. From the live view you can point it at the right element, skip the step or end the run.",
  },
  {
    q: "Can I edit the result?",
    a: "You can change captions, zoom level, pacing, background and aspect ratio, and retake a single scene without recording the whole demo again.",
  },
  {
    q: "Which formats do I get?",
    a: "An interactive demo you can share or embed, an MP4 at 1080p and 60 fps, and a Markdown guide with a screenshot for each step.",
  },
  {
    q: "Will it work on localhost?",
    a: "Not yet. The first version needs a URL the browser can reach. A command line tool for local apps is planned.",
  },
  {
    q: "How much does it cost?",
    a: "Flick is free during early access, with a monthly limit on demos per account.",
  },
];

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <Section
      id="faq"
      className="grid gap-12 px-5 py-20 sm:px-10 sm:py-28 lg:grid-cols-[1fr_1.4fr]"
    >
      <div>
        <SectionLabel index="04">FAQ</SectionLabel>
        <SectionTitle className="mt-5">Questions people ask first</SectionTitle>
      </div>
      <div className="border-t border-rule">
        {FAQ.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="border-b border-rule">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center gap-6 py-5 text-left text-[16px] font-medium tracking-[-0.01em] transition-colors duration-150 hover:text-ink/70"
              >
                {item.q}
                <Plus
                  className={cn(
                    "ml-auto size-4 shrink-0 text-muted transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]",
                    isOpen && "rotate-45",
                  )}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-[36rem] pb-5 text-[15px] leading-relaxed text-muted">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

export function FinalCta() {
  return (
    <Section tone="signal" className="px-5 py-24 sm:px-10 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.22)_1px,transparent_1.3px)] [mask-image:radial-gradient(ellipse_60%_70%_at_50%_50%,black,transparent)] bg-[size:24px_24px]"
      />
      <Reveal className="relative flex flex-col items-center text-center">
        <span className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 font-mono text-[11px] tracking-[0.12em] text-white ring-1 ring-white/25">
          <span className="size-1.5 animate-[blink_1.1s_steps(1)_infinite] rounded-full bg-white" />
          READY WHEN YOU ARE
        </span>
        <h2 className="mt-7 max-w-[13ch] font-display text-[clamp(2.8rem,7vw,6rem)] leading-[0.98] font-medium tracking-[-0.045em] text-balance">
          Make the demo you keep putting off
        </h2>
        <p className="mt-6 max-w-[28rem] text-[17px] leading-relaxed text-white/85">
          Your first walkthrough takes a couple of minutes. All you need is a
          link.
        </p>
        <RecordForm
          onAccent
          className="mt-10 shadow-[0_30px_80px_-30px_rgba(11,11,15,0.5)] ring-0"
        />
      </Reveal>
    </Section>
  );
}

function FollowingAgent({
  area,
}: {
  area: React.RefObject<HTMLDivElement | null>;
}) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 120, damping: 20, mass: 0.8 });
  const sy = useSpring(y, { stiffness: 120, damping: 20, mass: 0.8 });
  const [hovering, setHovering] = useState(false);
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  useEffect(() => {
    const el = area.current;
    if (!el) return;
    let inside = false;
    let frame = 0;
    const start = performance.now();
    const idle = (now: number) => {
      if (!inside) {
        const rect = el.getBoundingClientRect();
        const t = (now - start) / 1000;
        x.set(rect.width * (0.5 + 0.17 * Math.sin(t * 0.5)));
        y.set(rect.height * (0.55 + 0.2 * Math.sin(t * 0.8 + 1)));
      }
      if (!reduceMotion) frame = requestAnimationFrame(idle);
    };
    frame = requestAnimationFrame(idle);
    const local = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const p = local(event);
      rawX.set(p.x);
      rawY.set(p.y);
      x.set(p.x);
      y.set(p.y);
      if (!inside) {
        inside = true;
        setHovering(true);
      }
    };
    const onLeave = () => {
      inside = false;
      setHovering(false);
    };
    const onDown = (event: PointerEvent) => {
      const p = local(event);
      setRipples((list) => [
        ...list.slice(-4),
        { id: performance.now(), ...p },
      ]);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    el.addEventListener("pointerdown", onDown);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      el.removeEventListener("pointerdown", onDown);
    };
  }, [area, reduceMotion, x, y, rawX, rawY]);

  return (
    <>
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ opacity: 0.8, scale: 0.2 }}
            animate={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            onAnimationComplete={() =>
              setRipples((list) => list.filter((item) => item.id !== ripple.id))
            }
            className="pointer-events-none absolute size-20 rounded-full border-2 border-signal"
            style={{ left: ripple.x - 40, top: ripple.y - 40 }}
          />
        ))}
      </AnimatePresence>
      <motion.div
        className="pointer-events-none absolute top-0 left-0 z-10"
        style={{ x: hovering ? rawX : sx, y: hovering ? rawY : sy }}
      >
        <motion.svg
          viewBox="0 0 24 24"
          width={30}
          height={30}
          initial={false}
          animate={{ opacity: hovering ? 0 : 1 }}
          transition={{ duration: 0.15 }}
          className="-mt-0.5 -ml-1 drop-shadow-[0_4px_8px_rgba(11,11,15,0.2)]"
        >
          <path
            d="M3 2v17.6l4.7-4.3 3.1 6.9 3.2-1.4-3.1-6.8h6.5z"
            fill="#0B0B0F"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </motion.svg>
        <span className="absolute top-[22px] left-[15px] flex items-center gap-1.5 rounded-full rounded-tl-[4px] bg-signal py-1 pr-2.5 pl-2 text-[12px] font-medium whitespace-nowrap text-white shadow-[0_8px_20px_-8px_rgba(242,84,45,0.8)]">
          <span className="size-1.5 rounded-full bg-white" />
          Flick agent
        </span>
      </motion.div>
    </>
  );
}

export function Footer() {
  const area = useRef<HTMLDivElement>(null);
  const links = [
    { label: "How it works", href: "/#how" },
    { label: "Motion", href: "/#motion" },
    { label: "Outputs", href: "/#outputs" },
    { label: "FAQ", href: "/#faq" },
  ];
  return (
    <footer className="px-2.5 pt-2 pb-8 sm:px-4">
      <div className="relative mx-auto max-w-[1440px]">
        <div
          ref={area}
          className="relative h-[440px] overflow-hidden rounded-[28px] bg-canvas sm:rounded-[44px]"
        >
          <div className="relative mx-auto flex h-full max-w-[1240px] flex-col justify-between px-6 py-10 sm:px-10 sm:py-14">
            <Logo />
            <h2 className="max-w-[17ch] text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.04] font-medium tracking-[-0.04em] select-none">
              Walkthroughs of your web app, recorded by an agent.
            </h2>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[14.5px] text-ink/60 transition-colors duration-150 hover:text-signal"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <span className="flex items-center gap-2 font-mono text-[11px] text-muted sm:ml-auto">
                <span className="size-1.5 rounded-full bg-signal" />© 2026 Flick
                · Early access
              </span>
            </div>
          </div>
          <FollowingAgent area={area} />
        </div>
      </div>
    </footer>
  );
}
