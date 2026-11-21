"use client";

import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
} from "motion/react";
import { ArrowRight, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type RefObject } from "react";
import { EASE } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";
import { glide, type Point } from "@/lib/timeline";
import { HeroPlayer } from "./hero-player";
import { RecordForm } from "./record-form";

const DEMO_URL = "https://app.lumen.so";
const DEMO_GOAL = "Show how to create a task and assign it";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, ease: EASE, delay },
});

function AgentCursor({
  x,
  y,
  opacity,
  pressed,
}: {
  x: MotionValue<number>;
  y: MotionValue<number>;
  opacity: MotionValue<number>;
  pressed: boolean;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute top-0 left-0 z-30"
      style={{ x, y, opacity }}
    >
      <motion.svg
        viewBox="0 0 24 24"
        width={34}
        height={34}
        animate={{ scale: pressed ? 0.82 : 1 }}
        transition={{ duration: 0.1 }}
        style={{
          originX: "4px",
          originY: "3px",
          marginLeft: -4,
          marginTop: -3,
        }}
        className="drop-shadow-[0_4px_8px_rgba(11,11,15,0.25)]"
      >
        <path
          d="M3 2v17.6l4.7-4.3 3.1 6.9 3.2-1.4-3.1-6.8h6.5z"
          fill="#0B0B0F"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </motion.svg>
      <span className="absolute top-[26px] left-[18px] flex items-center gap-1.5 rounded-full rounded-tl-[4px] bg-signal py-1 pr-2.5 pl-2 text-[12px] font-medium whitespace-nowrap text-white shadow-[0_6px_16px_-4px_rgba(242,84,45,0.6)]">
        <span className="size-1.5 rounded-full bg-white" />
        Flick agent
      </span>
    </motion.div>
  );
}

function HeroForm({
  url,
  goal,
  focused,
  recording,
  onUrl,
  onGoal,
  onTouch,
  onSubmit,
  urlRef,
  goalRef,
  buttonRef,
}: {
  url: string;
  goal: string;
  focused: "url" | "goal" | null;
  recording: boolean;
  onUrl: (value: string) => void;
  onGoal: (value: string) => void;
  onTouch: () => void;
  onSubmit: () => void;
  urlRef: RefObject<HTMLLabelElement | null>;
  goalRef: RefObject<HTMLLabelElement | null>;
  buttonRef: RefObject<HTMLButtonElement | null>;
}) {
  const field = (active: boolean) =>
    cn(
      "flex h-[52px] items-center gap-3 rounded-[16px] px-4 transition-[background-color,box-shadow] duration-200",
      active
        ? "bg-[#F3F5FF] shadow-[inset_0_0_0_1.5px_rgba(47,91,255,0.55)]"
        : "focus-within:bg-[#F5F6F8]",
    );
  return (
    <form
      onPointerDown={onTouch}
      onFocusCapture={onTouch}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className="w-full max-w-[660px] rounded-[24px] bg-white p-1.5 text-left shadow-[0_2px_4px_rgba(11,11,15,0.04),0_24px_60px_-20px_rgba(11,11,15,0.22)] ring-1 ring-black/6"
    >
      <label ref={urlRef} className={field(focused === "url")}>
        <Globe className="size-4 shrink-0 text-muted" strokeWidth={1.75} />
        <span className="sr-only">Your app&apos;s URL</span>
        <input
          value={url}
          onChange={(event) => onUrl(event.target.value)}
          type="url"
          inputMode="url"
          placeholder="https://your-app.com"
          className="w-full bg-transparent text-[15.5px] text-ink outline-none placeholder:text-[#A0A4AC]"
        />
      </label>
      <div className="mx-4 h-px bg-[#EDEEF1]" />
      <div className="flex items-center gap-1.5">
        <label
          ref={goalRef}
          className={cn(field(focused === "goal"), "min-w-0 flex-1")}
        >
          <span className="sr-only">What should the demo show?</span>
          <input
            value={goal}
            onChange={(event) => onGoal(event.target.value)}
            placeholder="Show how to create a task and assign it"
            className="w-full bg-transparent text-[15.5px] text-ink outline-none placeholder:text-[#A0A4AC]"
          />
        </label>
        <button
          ref={buttonRef}
          type="submit"
          className={cn(
            "group flex h-12 shrink-0 items-center gap-2 rounded-[16px] pr-4 pl-3.5 text-[14.5px] font-medium text-white transition-[background-color,transform,box-shadow] duration-200 active:scale-[0.97]",
            recording
              ? "bg-ink shadow-[0_10px_30px_-10px_rgba(11,11,15,0.5)]"
              : "bg-signal shadow-[0_10px_30px_-10px_rgba(242,84,45,0.6)] hover:bg-[#DB4622]",
          )}
        >
          <span className="relative flex size-2.5">
            <span
              className={cn(
                "absolute inset-0 animate-ping rounded-full opacity-70",
                recording ? "bg-signal" : "bg-white",
              )}
            />
            <span
              className={cn(
                "relative size-2.5 rounded-full",
                recording ? "bg-signal" : "bg-white",
              )}
            />
          </span>
          {recording ? "Recording" : "Record demo"}
          {!recording && (
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          )}
        </button>
      </div>
    </form>
  );
}

function Headline() {
  return (
    <h1 className="mx-auto font-display text-[clamp(3rem,6.6vw,6rem)] leading-[0.98] font-medium tracking-[-0.045em] text-balance md:text-nowrap">
      Product demos that <br className="hidden md:block" />
      record <FocusLock>themselves</FocusLock>
    </h1>
  );
}

function FocusLock({ children }: { children: React.ReactNode }) {
  const corners = [
    "top-0 left-0 border-t-2 border-l-2 rounded-tl-[6px]",
    "top-0 right-0 border-t-2 border-r-2 rounded-tr-[6px]",
    "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-[6px]",
    "right-0 bottom-0 border-r-2 border-b-2 rounded-br-[6px]",
  ];
  return (
    <span className="relative inline-block px-[0.1em]">
      {children}
      <motion.span
        aria-hidden
        className="absolute -inset-x-[0.02em] -top-[0.02em] -bottom-[0.06em]"
        initial={{ opacity: 0, scale: 1.25 }}
        animate={{ opacity: 1, scale: [1.25, 0.96, 1.02, 1] }}
        transition={{
          duration: 0.9,
          delay: 1.1,
          times: [0, 0.55, 0.8, 1],
          ease: "easeOut",
        }}
      >
        {corners.map((corner) => (
          <span
            key={corner}
            className={cn("absolute size-[0.16em] border-signal", corner)}
          />
        ))}
      </motion.span>
    </span>
  );
}

function HeroStage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const urlRef = useRef<HTMLLabelElement>(null);
  const goalRef = useRef<HTMLLabelElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [url, setUrl] = useState("");
  const [goal, setGoal] = useState("");
  const [focused, setFocused] = useState<"url" | "goal" | null>(null);
  const [recording, setRecording] = useState(false);
  const [autopilot, setAutopilot] = useState(true);
  const [pressed, setPressed] = useState(false);
  const [ripple, setRipple] = useState<(Point & { id: number }) | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const cursorOpacity = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const contentY = useTransform(scrollYProgress, [0, 0.5], ["0vh", "-16vh"]);
  const contentOpacity = useTransform(scrollYProgress, [0.05, 0.38], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.92]);
  const contentFilter = useTransform(
    scrollYProgress,
    [0.05, 0.38],
    ["blur(0px)", "blur(12px)"],
  );
  const playerY = useTransform(
    scrollYProgress,
    [0, 0.62],
    ["max(70vh, 600px)", "3vh"],
  );
  const playerRotate = useTransform(scrollYProgress, [0, 0.62], [28, 0]);
  const playerScale = useTransform(scrollYProgress, [0, 0.62], [0.82, 1]);

  const still = Boolean(reduceMotion) && autopilot;
  const shownUrl = still ? DEMO_URL : url;
  const shownGoal = still ? DEMO_GOAL : goal;
  const isRecording = recording || still;

  useEffect(() => {
    if (!autopilot || reduceMotion) return;
    let cancelled = false;
    const running: AnimationPlaybackControls[] = [];
    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    const point = (el: Element | null, offsetX?: number): Point => {
      const layer = layerRef.current?.getBoundingClientRect();
      const rect = el?.getBoundingClientRect();
      if (!layer || !rect) return { x: 0, y: 0 };
      return {
        x: rect.left - layer.left + (offsetX ?? rect.width / 2),
        y: rect.top - layer.top + rect.height / 2,
      };
    };
    const move = (to: Point, duration: number) =>
      new Promise<void>((resolve) => {
        const from = { x: x.get(), y: y.get() };
        running.push(
          animate(0, 1, {
            duration,
            ease: "linear",
            onUpdate: (p) => {
              const next = glide(from, to, p, 0.14);
              x.set(next.x);
              y.set(next.y);
            },
            onComplete: resolve,
          }),
        );
      });
    const click = async (at: Point) => {
      setPressed(true);
      setRipple({ ...at, id: performance.now() });
      await sleep(130);
      setPressed(false);
    };
    const type = async (
      text: string,
      set: (value: string) => void,
      speed: number,
    ) => {
      for (let i = 1; i <= text.length; i++) {
        if (cancelled) return;
        set(text.slice(0, i));
        await sleep(speed + Math.random() * 35);
      }
    };

    (async () => {
      await sleep(1500);
      const layer = layerRef.current?.getBoundingClientRect();
      if (cancelled || !layer) return;
      x.set(layer.width * 0.82);
      y.set(layer.height * 0.95);
      running.push(animate(cursorOpacity, 1, { duration: 0.5 }));
      const u = point(urlRef.current, 230);
      await move(u, 1.15);
      if (cancelled) return;
      await click(u);
      setFocused("url");
      await type(DEMO_URL, setUrl, 42);
      if (cancelled) return;
      await sleep(250);
      const g = point(goalRef.current, 330);
      await move(g, 0.7);
      if (cancelled) return;
      await click(g);
      setFocused("goal");
      await type(DEMO_GOAL, setGoal, 30);
      if (cancelled) return;
      await sleep(300);
      const b = point(buttonRef.current);
      await move(b, 0.75);
      if (cancelled) return;
      await click(b);
      setFocused(null);
      setRecording(true);
      await sleep(700);
      if (cancelled) return;
      await move({ x: layer.width * 0.6, y: layer.height * 1.02 }, 1.3);
      running.push(animate(cursorOpacity, 0, { duration: 0.5 }));
    })();

    return () => {
      cancelled = true;
      running.forEach((control) => control.stop());
    };
  }, [autopilot, reduceMotion, x, y, cursorOpacity]);

  const takeOver = () => {
    if (!autopilot) return;
    if (still) {
      setUrl(DEMO_URL);
      setGoal(DEMO_GOAL);
    }
    setAutopilot(false);
    setFocused(null);
    setRecording(true);
    animate(cursorOpacity, 0, { duration: 0.25 });
  };

  return (
    <section ref={sectionRef} className="relative hidden h-[240vh] md:block">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          ref={layerRef}
          style={{
            y: contentY,
            opacity: contentOpacity,
            scale: contentScale,
            filter: contentFilter,
          }}
          className="relative z-10 flex h-full flex-col items-center px-8 pt-[max(19vh,150px)] text-center"
        >
          <motion.div {...rise(0.1)} className="mt-6 w-full max-w-[1100px]">
            <Headline />
          </motion.div>
          <motion.p
            {...rise(0.2)}
            className="mt-6 max-w-[35rem] text-[18px] leading-relaxed text-pretty text-muted"
          >
            Paste a link and say what to show. An agent clicks through your app
            in a real browser, and Flick cuts the run into a walkthrough with
            camera moves and captions.
          </motion.p>
          <motion.div
            {...rise(0.28)}
            className="mt-9 flex w-full justify-center"
          >
            <HeroForm
              url={shownUrl}
              goal={shownGoal}
              focused={focused}
              recording={isRecording}
              onUrl={setUrl}
              onGoal={setGoal}
              onTouch={takeOver}
              onSubmit={() => {
                if (!autopilot) router.push("/new");
              }}
              urlRef={urlRef}
              goalRef={goalRef}
              buttonRef={buttonRef}
            />
          </motion.div>
          <AnimatePresence>
            {ripple && (
              <motion.span
                key={ripple.id}
                initial={{ opacity: 0.9, scale: 0.2 }}
                animate={{ opacity: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                onAnimationComplete={() => setRipple(null)}
                className="pointer-events-none absolute z-20 size-20 rounded-full border-2 border-signal bg-signal/15"
                style={{ left: ripple.x - 40, top: ripple.y - 40 }}
              />
            )}
          </AnimatePresence>
          <AgentCursor x={x} y={y} opacity={cursorOpacity} pressed={pressed} />
        </motion.div>
        <div className="absolute inset-0 z-10 flex items-center justify-center [perspective:1800px]">
          <motion.div
            style={{ y: playerY, rotateX: playerRotate, scale: playerScale }}
            className="w-[min(1160px,86vw,calc((100vh_-_250px)*1.6))] origin-top"
          >
            <HeroPlayer
              started={isRecording}
              className="shadow-[0_60px_140px_-50px_rgba(11,11,15,0.6),0_0_0_1px_rgba(11,11,15,0.9)]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HeroMobile() {
  return (
    <section className="relative overflow-hidden px-5 pt-32 pb-6 md:hidden">
      <div className="relative flex flex-col items-center text-center">
        <motion.div {...rise(0.1)}>
          <Headline />
        </motion.div>
        <motion.p
          {...rise(0.2)}
          className="mt-5 text-[16.5px] leading-relaxed text-muted"
        >
          Paste a link and say what to show. An agent clicks through your app in
          a real browser, and Flick cuts the run into a walkthrough with camera
          moves and captions.
        </motion.p>
        <motion.div {...rise(0.28)} className="mt-8 w-full">
          <RecordForm />
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.4 }}
        className="relative mt-12"
      >
        <HeroPlayer />
      </motion.div>
    </section>
  );
}

export function Hero() {
  return (
    <>
      <HeroStage />
      <HeroMobile />
    </>
  );
}
