import {
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  glide,
  lerp,
  progress,
  spring,
  track,
  type Point,
} from "@/lib/timeline";

export const SCENE = { width: 1440, height: 900 };
export const WINDOW = { x: 80, y: 50, width: 1280, height: 800 };
export const LUMEN_DURATION = 13;
export const TASK_NAME = "Prepare launch checklist";

export type Camera = { x: number; y: number; s: number };

const CAMERA_START: Camera = { x: 720, y: 450, s: 1 };

const CAMERA_MOVES = [
  { at: 0.8, dur: 1.2, to: { x: 1268, y: 144, s: 1.9 } },
  { at: 2.3, dur: 1.1, to: { x: 720, y: 480, s: 1.55 } },
  { at: 7.5, dur: 1.2, to: { x: 600, y: 300, s: 1.45 } },
  { at: 10.5, dur: 1.4, to: CAMERA_START },
];

const CURSOR_START: Point = { x: 1060, y: 760 };

const CURSOR_MOVES = [
  { at: 0.3, dur: 1.5, to: { x: 1188, y: 94 } },
  { at: 2.6, dur: 0.75, to: { x: 560, y: 340 } },
  { at: 4.75, dur: 0.6, to: { x: 500, y: 422 } },
  { at: 5.8, dur: 0.5, to: { x: 480, y: 516 } },
  { at: 6.65, dur: 0.65, to: { x: 820, y: 526 } },
  { at: 8.4, dur: 1.0, to: { x: 284, y: 196 } },
  { at: 10.6, dur: 1.4, to: { x: 760, y: 600 } },
];

export const CLICKS = [
  { at: 2.0, x: 1188, y: 94 },
  { at: 3.45, x: 560, y: 340 },
  { at: 5.45, x: 500, y: 422 },
  { at: 6.4, x: 480, y: 516 },
  { at: 7.35, x: 820, y: 526 },
  { at: 9.55, x: 284, y: 196 },
];

export const CHAPTERS = [
  { at: 0, title: "Open a new task" },
  { at: 2.4, title: "Name it" },
  { at: 4.7, title: "Assign a teammate" },
  { at: 6.6, title: "Create the task" },
  { at: 8.4, title: "Mark it done" },
];

const CAPTION_START = 0.35;
const CAPTION_END = 11.4;

export function cameraAt(t: number): Camera {
  return track(CAMERA_START, CAMERA_MOVES, t, (from, to, p) => {
    const e = spring(p, 7);
    return {
      x: lerp(from.x, to.x, e),
      y: lerp(from.y, to.y, e),
      s: lerp(from.s, to.s, e),
    };
  });
}

export function cameraTransform(camera: Camera) {
  const { width, height } = SCENE;
  const tx = Math.min(
    0,
    Math.max(width - width * camera.s, width / 2 - camera.x * camera.s),
  );
  const ty = Math.min(
    0,
    Math.max(height - height * camera.s, height / 2 - camera.y * camera.s),
  );
  return `translate3d(${tx}px, ${ty}px, 0) scale(${camera.s})`;
}

export function cursorAt(t: number): Point {
  return track(CURSOR_START, CURSOR_MOVES, t, (from, to, p) =>
    glide(from, to, p),
  );
}

export function pressAt(t: number) {
  return CLICKS.some((click) => t >= click.at && t < click.at + 0.14);
}

export function chapterAt(t: number) {
  if (t < CAPTION_START || t >= CAPTION_END) return -1;
  let index = 0;
  CHAPTERS.forEach((chapter, i) => {
    if (t >= chapter.at) index = i;
  });
  return index;
}

export function lumenState(t: number) {
  const modal =
    easeOutCubic(progress(t, 2.15, 2.45)) *
    (1 - easeInOutCubic(progress(t, 7.45, 7.7)));
  return {
    newPressed: t >= 2.0 && t < 2.14,
    modal,
    typed: TASK_NAME.slice(
      0,
      Math.round(progress(t, 3.6, 4.6) * TASK_NAME.length),
    ),
    titleFocused: t >= 3.45 && t < 4.75,
    typing: t >= 3.6 && t < 4.6,
    caretOn: Math.floor(t * 2.4) % 2 === 0,
    assigneeFocused: t >= 5.45 && t < 6.5,
    dropdown:
      easeOutCubic(progress(t, 5.45, 5.62)) * (1 - progress(t, 6.42, 6.54)),
    mayaHover: t >= 6.15 && t < 6.45,
    assigned: t >= 6.42,
    createPressed: t >= 7.35 && t < 7.48,
    newRow: easeOutCubic(progress(t, 7.7, 8.2)),
    highlight: progress(t, 7.7, 8.0) * (1 - progress(t, 9.2, 10.6)),
    check: easeOutBack(progress(t, 9.55, 9.78)),
    strike: easeInOutCubic(progress(t, 9.65, 10.0)),
    done: t >= 9.6,
  };
}

export type LumenState = ReturnType<typeof lumenState>;

export function fadeAt(t: number) {
  return (
    progress(t, 0, 0.35) *
    (1 - progress(t, LUMEN_DURATION - 0.55, LUMEN_DURATION))
  );
}
