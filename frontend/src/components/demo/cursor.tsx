import { progress } from "@/lib/timeline";

export function Cursor({
  x,
  y,
  pressed,
  scale = 1,
}: {
  x: number;
  y: number;
  pressed: boolean;
  scale?: number;
}) {
  return (
    <div
      className="pointer-events-none absolute top-0 left-0"
      style={{
        transform: `translate3d(${x - 3}px, ${y - 2}px, 0) scale(${scale})`,
        transformOrigin: "3px 2px",
        willChange: "transform",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width={30}
        height={30}
        className="block drop-shadow-[0_2px_3px_rgba(0,0,0,0.25)]"
        style={{
          transform: `scale(${pressed ? 0.84 : 1})`,
          transformOrigin: "3px 2px",
          transition: "transform 90ms ease-out",
        }}
      >
        <path
          d="M3 2v17.6l4.7-4.3 3.1 6.9 3.2-1.4-3.1-6.8h6.5z"
          fill="#fff"
          stroke="#17181C"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function Ripples({
  t,
  clicks,
  color = "#F2542D",
}: {
  t: number;
  clicks: readonly { at: number; x: number; y: number }[];
  color?: string;
}) {
  return (
    <>
      {clicks.map((click) => {
        const p = progress(t, click.at, click.at + 0.55);
        if (p <= 0 || p >= 1) return null;
        const size = 14 + p * 54;
        return (
          <span
            key={click.at}
            className="pointer-events-none absolute top-0 left-0 rounded-full"
            style={{
              width: size,
              height: size,
              transform: `translate3d(${click.x - size / 2}px, ${click.y - size / 2}px, 0)`,
              border: `2px solid ${color}`,
              background: `${color}22`,
              opacity: (1 - p) * 0.9,
            }}
          />
        );
      })}
    </>
  );
}
