"use client";

import { AnimatePresence, Reorder, useDragControls } from "motion/react";
import {
  AlertTriangle,
  ArrowRight,
  GripVertical,
  MousePointerClick,
  Plus,
  Trash2,
  Type,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { Card, Toggle } from "./controls";
import { DemoThumb } from "./demo-thumb";

type Scene = {
  id: string;
  caption: string;
  action: string;
  kind: "click" | "type";
  seconds: number;
  t: number;
  creates?: boolean;
};

const INITIAL: Scene[] = [
  {
    id: "a",
    caption: "Open a new task",
    action: "click · button “New task”",
    kind: "click",
    seconds: 2.4,
    t: 1.9,
  },
  {
    id: "b",
    caption: "Name it",
    action: "type · “Prepare launch checklist”",
    kind: "type",
    seconds: 2.3,
    t: 4.4,
  },
  {
    id: "c",
    caption: "Assign a teammate",
    action: "click · select “Assignee” → Maya Chen",
    kind: "click",
    seconds: 1.9,
    t: 6.2,
  },
  {
    id: "d",
    caption: "Create the task",
    action: "click · button “Create task”",
    kind: "click",
    seconds: 1.8,
    t: 7.3,
    creates: true,
  },
  {
    id: "e",
    caption: "Mark it done",
    action: "click · checkbox on the new task",
    kind: "click",
    seconds: 3.0,
    t: 9.9,
  },
];

function SceneRow({
  scene,
  index,
  onCaption,
  onRemove,
}: {
  scene: Scene;
  index: number;
  onCaption: (value: string) => void;
  onRemove: () => void;
}) {
  const controls = useDragControls();
  const Icon = scene.kind === "type" ? Type : MousePointerClick;
  return (
    <Reorder.Item
      value={scene}
      dragListener={false}
      dragControls={controls}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      whileDrag={{
        scale: 1.015,
        boxShadow: "0 24px 50px -20px rgba(23,24,28,0.35)",
      }}
      className="relative mb-2.5 rounded-[18px] bg-white ring-1 ring-rule"
    >
      <div className="flex items-center gap-3 p-3 pr-4 sm:gap-4">
        <button
          type="button"
          aria-label="Drag to reorder"
          onPointerDown={(event) => controls.start(event)}
          className="flex h-10 w-6 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-[#B3B7BF] hover:text-ink active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </button>
        <DemoThumb
          t={scene.t}
          className="hidden w-36 shrink-0 rounded-lg ring-1 ring-black/5 sm:block"
          padding={0.05}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
            <input
              value={scene.caption}
              onChange={(event) => onCaption(event.target.value)}
              aria-label={`Caption for scene ${index + 1}`}
              className="min-w-0 flex-1 rounded-md bg-transparent px-1 py-0.5 text-[15px] font-medium outline-none hover:bg-[#F5F6F8] focus:bg-[#F5F6F8]"
            />
          </div>
          <p className="mt-1 flex items-center gap-1.5 truncate pl-6 font-mono text-[11.5px] text-muted">
            <Icon className="size-3 shrink-0" />
            <span className="truncate">{scene.action}</span>
          </p>
          {scene.creates && (
            <p className="mt-2 ml-6 inline-flex items-center gap-1.5 rounded-md bg-[#FEF4D7] px-2 py-1 text-[11.5px] text-[#92650B]">
              <AlertTriangle className="size-3" />
              Adds a task to your app
            </p>
          )}
        </div>
        <span className="hidden font-mono text-[11.5px] text-muted tabular-nums sm:block">
          {scene.seconds.toFixed(1)}s
        </span>
        <button
          type="button"
          aria-label="Remove scene"
          onClick={onRemove}
          className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-[#FBEAEA] hover:text-[#B42318]"
        >
          <Trash2 className="size-4" strokeWidth={1.75} />
        </button>
      </div>
    </Reorder.Item>
  );
}

export function Storyboard() {
  const [scenes, setScenes] = useState(INITIAL);
  const [allowWrites, setAllowWrites] = useState(true);
  const total = scenes.reduce((sum, scene) => sum + scene.seconds, 0);

  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-8 sm:py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <h1 className="text-[24px] font-medium tracking-[-0.03em] sm:text-[28px]">
            Review the storyboard
          </h1>
          <p className="mt-1.5 max-w-xl text-[14.5px] text-muted">
            The agent explored your app and planned {scenes.length} scenes. Drag
            to reorder, edit a caption or remove a scene before recording.
          </p>
          <Reorder.Group
            axis="y"
            values={scenes}
            onReorder={setScenes}
            className="mt-7"
          >
            <AnimatePresence initial={false}>
              {scenes.map((scene, i) => (
                <SceneRow
                  key={scene.id}
                  scene={scene}
                  index={i}
                  onCaption={(caption) =>
                    setScenes((list) =>
                      list.map((item) =>
                        item.id === scene.id ? { ...item, caption } : item,
                      ),
                    )
                  }
                  onRemove={() =>
                    setScenes((list) =>
                      list.filter((item) => item.id !== scene.id),
                    )
                  }
                />
              ))}
            </AnimatePresence>
          </Reorder.Group>
          <button
            type="button"
            onClick={() =>
              setScenes((list) => [
                ...list,
                {
                  id: crypto.randomUUID(),
                  caption: "New scene",
                  action: "describe what the agent should do",
                  kind: "click",
                  seconds: 2,
                  t: 0.5,
                },
              ])
            }
            className="flex h-12 w-full items-center justify-center gap-2 rounded-[18px] border border-dashed border-[#D0D3D9] text-[13.5px] text-muted transition-colors hover:border-[#B6BAC2] hover:bg-white hover:text-ink"
          >
            <Plus className="size-4" />
            Add a scene
          </button>
        </div>

        <div className="flex flex-col gap-4 lg:sticky lg:top-36 lg:self-start">
          <Card className="p-5">
            <p className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
              Summary
            </p>
            <dl className="mt-4 flex flex-col gap-3 text-[13.5px]">
              {[
                ["Scenes", String(scenes.length)],
                ["Estimated length", `${total.toFixed(1)}s`],
                ["Pages visited", "1"],
                ["Explored in", "48s"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <dt className="text-muted">{label}</dt>
                  <dd className="font-mono text-[12.5px] tabular-nums">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card className="p-5">
            <div className="flex items-start gap-3">
              <div>
                <p className="text-[14px] font-medium">
                  Allow changes to my app
                </p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-muted">
                  Scene 4 creates a task. Turn this off to skip any step that
                  saves data.
                </p>
              </div>
              <Toggle
                checked={allowWrites}
                onChange={setAllowWrites}
                label="Allow changes to my app"
              />
            </div>
          </Card>
          <Link
            href="/demos/lumen-create-task/live"
            className={cn(
              "group flex h-12 items-center justify-center gap-2 rounded-full bg-signal text-[14.5px] font-medium text-paper shadow-[0_1px_0_rgba(255,255,255,0.12)_inset,0_1px_2px_rgba(23,24,28,0.3)] transition-[background-color,transform] duration-150 hover:bg-[#DB4622] active:scale-[0.98]",
            )}
          >
            <span className="size-2 rounded-full bg-signal" />
            Start recording
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <p className="text-center text-[12.5px] text-muted">
            You can pause or stop at any point.
          </p>
        </div>
      </div>
    </div>
  );
}
