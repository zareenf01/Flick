"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useLoopTime(
  duration: number,
  { playing, start = 0 }: { playing: boolean; start?: number },
) {
  const [t, setT] = useState(start);
  const ref = useRef(start);

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const delta = Math.min(0.25, (now - last) / 1000);
      last = now;
      ref.current = (ref.current + delta) % duration;
      setT(ref.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, duration]);

  const seek = useCallback(
    (value: number) => {
      ref.current = ((value % duration) + duration) % duration;
      setT(ref.current);
    },
    [duration],
  );

  return [t, seek] as const;
}
