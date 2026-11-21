export type Point = { x: number; y: number };
export type Move<T> = { at: number; dur: number; to: T };

export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const progress = (t: number, start: number, end: number) =>
  end <= start ? (t >= end ? 1 : 0) : clamp((t - start) / (end - start));

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

export const easeOutCubic = (p: number) => 1 - (1 - p) ** 3;

export const easeInOutCubic = (p: number) =>
  p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;

export const easeOutBack = (p: number) => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * (p - 1) ** 3 + c1 * (p - 1) ** 2;
};

export function spring(p: number, stiffness = 7.5) {
  const settle = 1 - (1 + stiffness) * Math.exp(-stiffness);
  const value = 1 - (1 + stiffness * p) * Math.exp(-stiffness * p);
  return value / settle;
}

export function track<T>(
  start: T,
  moves: readonly Move<T>[],
  t: number,
  mix: (from: T, to: T, p: number) => T,
): T {
  let value = start;
  for (const move of moves) {
    if (t <= move.at) return value;
    const p = progress(t, move.at, move.at + move.dur);
    if (p < 1) return mix(value, move.to, p);
    value = move.to;
  }
  return value;
}

export function glide(from: Point, to: Point, p: number, arc = 0.12): Point {
  const e = spring(p, 8);
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy) || 1;
  const bend = Math.sin(Math.PI * clamp(e)) * distance * arc;
  return {
    x: lerp(from.x, to.x, e) + (-dy / distance) * bend,
    y: lerp(from.y, to.y, e) + (dx / distance) * bend,
  };
}

export function timecode(seconds: number) {
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  const secs = whole % 60;
  const tenths = Math.floor((seconds - whole) * 10);
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${tenths}`;
}
