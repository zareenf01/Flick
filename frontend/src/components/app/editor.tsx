"use client";

import {
  Captions,
  MousePointer2,
  RefreshCw,
  Scissors,
  ZoomIn,
} from "lucide-react";
import { useState } from "react";
import { HeroPlayer } from "@/components/landing/hero-player";
import { CHAPTERS, LUMEN_DURATION } from "@/components/demo/lumen-script";
import { cn } from "@/lib/cn";
import {
  Card,
  Field,
  Label,
  Segmented,
  Slider,
  Textarea,
  Toggle,
} from "./controls";
import { DemoThumb, PICKER_PLATES, PLATES, type Plate } from "./demo-thumb";

const SCENE_TIMES = [1.9, 4.4, 6.2, 7.3, 9.9];
const DURATIONS = CHAPTERS.map(
  (chapter, i) => (CHAPTERS[i + 1]?.at ?? 11.4) - chapter.at,
);
const TOTAL = DURATIONS.reduce((a, b) => a + b, 0);

const INSPECTOR_TABS = [
  { value: "scene", label: "Scene" },
  { value: "style", label: "Style" },
] as const;

export function Editor() {
  const [selected, setSelected] = useState(2);
  const [tab, setTab] = useState<"scene" | "style">("scene");
  const [captions, setCaptions] = useState(
    CHAPTERS.map((chapter) => chapter.title),
  );
  const [zoom, setZoom] = useState(1.6);
  const [hold, setHold] = useState(0.8);
  const [cursorSpeed, setCursorSpeed] = useState(1);
  const [ripples, setRipples] = useState(true);
  const [plate, setPlate] = useState<Plate>("ember");
  const [padding, setPadding] = useState(8);
  const [radius, setRadius] = useState(14);
  const [ratio, setRatio] = useState<"16:9" | "1:1" | "9:16">("16:9");

  return (
    <div className="mx-auto w-full max-w-[1400px] px-5 py-6 sm:px-8">
      <div className="grid gap-5 xl:grid-cols-[220px_1fr_320px]">
        <div className="order-2 min-w-0 xl:order-1">
          <p className="mb-3 font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
            Scenes
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 xl:flex-col xl:overflow-visible">
            {CHAPTERS.map((chapter, i) => (
              <button
                key={chapter.title}
                type="button"
                onClick={() => setSelected(i)}
                className={cn(
                  "group w-44 shrink-0 rounded-[14px] p-1.5 text-left transition-[background-color,box-shadow] duration-150 xl:w-full",
                  selected === i
                    ? "bg-white shadow-[0_0_0_1.5px_#F2542D]"
                    : "hover:bg-white hover:shadow-[0_0_0_1px_#E3E5E8]",
                )}
              >
                <DemoThumb
                  t={SCENE_TIMES[i] ?? 0}
                  className="rounded-[10px]"
                  padding={0.05}
                />
                <span className="mt-1.5 flex items-center gap-2 px-1 pb-0.5">
                  <span className="font-mono text-[10.5px] text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate text-[12.5px]">{captions[i]}</span>
                  <span className="ml-auto font-mono text-[10.5px] text-muted">
                    {DURATIONS[i]?.toFixed(1)}s
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="order-1 flex min-w-0 flex-col gap-4 xl:order-2">
          <HeroPlayer className="shadow-[0_24px_70px_-40px_rgba(23,24,28,0.55)]" />
          <Card className="p-4">
            <div className="flex items-center gap-2 pb-3">
              <p className="font-mono text-[11px] tracking-[0.12em] text-muted uppercase">
                Timeline
              </p>
              <span className="ml-auto font-mono text-[11px] text-muted tabular-nums">
                {TOTAL.toFixed(1)}s of {LUMEN_DURATION.toFixed(1)}s
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              {[
                { label: "Scenes", icon: Scissors },
                { label: "Zoom", icon: ZoomIn },
                { label: "Captions", icon: Captions },
              ].map((track, row) => (
                <div key={track.label} className="flex items-center gap-3">
                  <span className="flex w-20 shrink-0 items-center gap-1.5 text-[12px] text-muted">
                    <track.icon className="size-3.5" strokeWidth={1.75} />
                    {track.label}
                  </span>
                  <div className="relative flex h-8 min-w-0 flex-1 gap-1">
                    {DURATIONS.map((duration, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelected(i)}
                        style={{ flexGrow: duration }}
                        className={cn(
                          "relative min-w-0 basis-0 overflow-hidden rounded-md px-2 text-left text-[11px] transition-colors duration-150",
                          row === 0 &&
                            (selected === i
                              ? "bg-signal text-paper"
                              : "bg-[#E8EAED] text-ink hover:bg-[#E2E2DD]"),
                          row === 1 &&
                            (selected === i
                              ? "bg-[#FFE1D7] text-[#B93A17]"
                              : "bg-[#FBF0EC] text-[#B93A17]/70"),
                          row === 2 &&
                            (selected === i
                              ? "bg-[#DFE5FF] text-[#3149C7]"
                              : "bg-[#F0F2FB] text-[#3149C7]/70"),
                        )}
                      >
                        <span className="block truncate">
                          {row === 0
                            ? captions[i]
                            : row === 1
                              ? `${i === 0 ? "1.9" : i === 4 ? "1.0" : "1.6"}×`
                              : captions[i]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="order-3 flex flex-col self-start p-5">
          <div className="flex items-center justify-between">
            <Segmented value={tab} options={INSPECTOR_TABS} onChange={setTab} />
            <span className="font-mono text-[11px] text-muted">
              Scene {selected + 1}
            </span>
          </div>
          {tab === "scene" ? (
            <div className="mt-5 flex flex-col gap-5">
              <Field label="Caption">
                <Textarea
                  value={captions[selected]}
                  onChange={(event) =>
                    setCaptions((list) =>
                      list.map((item, i) =>
                        i === selected ? event.target.value : item,
                      ),
                    )
                  }
                  className="min-h-16"
                />
              </Field>
              <Slider
                label="Zoom"
                value={zoom}
                min={1}
                max={2.5}
                step={0.05}
                onChange={setZoom}
                format={(v) => `${v.toFixed(2)}×`}
              />
              <Slider
                label="Hold after click"
                value={hold}
                min={0}
                max={2}
                step={0.1}
                onChange={setHold}
                format={(v) => `${v.toFixed(1)}s`}
              />
              <Slider
                label="Cursor speed"
                value={cursorSpeed}
                min={0.5}
                max={1.5}
                step={0.05}
                onChange={setCursorSpeed}
                format={(v) => `${v.toFixed(2)}×`}
              />
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <MousePointer2
                    className="size-4 text-muted"
                    strokeWidth={1.75}
                  />
                  <Label>Click ripples</Label>
                </span>
                <Toggle
                  checked={ripples}
                  onChange={setRipples}
                  label="Click ripples"
                />
              </div>
              <button
                type="button"
                className="flex h-10 items-center justify-center gap-2 rounded-full text-[13.5px] ring-1 ring-rule transition-colors hover:bg-[#F5F6F8]"
              >
                <RefreshCw className="size-3.5" />
                Retake this scene
              </button>
            </div>
          ) : (
            <div className="mt-5 flex flex-col gap-5">
              <div className="flex flex-col gap-2.5">
                <Label>Background</Label>
                <div className="flex gap-1.5">
                  {PICKER_PLATES.map((key) => (
                    <button
                      key={key}
                      type="button"
                      aria-label={`${key} background`}
                      onClick={() => setPlate(key)}
                      className={cn(
                        "size-8 rounded-full ring-1 ring-black/10 transition-transform duration-150 active:scale-90",
                        PLATES[key],
                        plate === key &&
                          "ring-2 ring-signal ring-offset-2 ring-offset-white",
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label>Aspect ratio</Label>
                <Segmented
                  value={ratio}
                  options={[
                    { value: "16:9", label: "16:9" },
                    { value: "1:1", label: "1:1" },
                    { value: "9:16", label: "9:16" },
                  ]}
                  onChange={setRatio}
                  mono
                />
              </div>
              <Slider
                label="Padding"
                value={padding}
                min={0}
                max={16}
                step={1}
                onChange={setPadding}
                format={(v) => `${v}%`}
              />
              <Slider
                label="Corner radius"
                value={radius}
                min={0}
                max={28}
                step={1}
                onChange={setRadius}
                format={(v) => `${v}px`}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
