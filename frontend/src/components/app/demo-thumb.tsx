import { LumenApp } from "@/components/demo/lumen-app";
import { lumenState } from "@/components/demo/lumen-script";
import { ScaledBox } from "@/components/demo/scaled-box";
import { cn } from "@/lib/cn";

export const PLATES = {
  ember:
    "bg-[#ECEBE7] bg-[radial-gradient(70%_80%_at_12%_8%,#FFDCCF_0%,transparent_60%),radial-gradient(70%_80%_at_92%_100%,#D7DEFF_0%,transparent_60%)]",
  sky: "bg-[#E8ECF4] bg-[radial-gradient(70%_80%_at_85%_0%,#CFE0FF_0%,transparent_60%),radial-gradient(70%_80%_at_0%_100%,#F1E3FF_0%,transparent_60%)]",
  mint: "bg-[#E6EEE9] bg-[radial-gradient(70%_80%_at_10%_0%,#CDEFD9_0%,transparent_60%),radial-gradient(70%_80%_at_100%_100%,#E0EAFF_0%,transparent_60%)]",
  graphite:
    "bg-[#1B1C21] bg-[radial-gradient(70%_80%_at_15%_0%,#3A3B45_0%,transparent_60%)]",
  paper: "bg-[#F2F3F5]",
  signal:
    "bg-[#F2542D] bg-[radial-gradient(80%_90%_at_15%_0%,#FF9A7A_0%,transparent_60%)]",
  cobalt:
    "bg-[#2F5BFF] bg-[radial-gradient(80%_90%_at_85%_0%,#7B95FF_0%,transparent_60%)]",
  lime: "bg-[#D2F45B] bg-[radial-gradient(80%_90%_at_0%_100%,#F2FFC2_0%,transparent_60%)]",
  lilac:
    "bg-[#B9A7FF] bg-[radial-gradient(80%_90%_at_100%_100%,#E6DEFF_0%,transparent_60%)]",
  aqua: "bg-[#7DD3FC] bg-[radial-gradient(80%_90%_at_10%_10%,#D6F3FF_0%,transparent_60%)]",
} as const;

export type Plate = keyof typeof PLATES;

export const PICKER_PLATES: Plate[] = [
  "ember",
  "signal",
  "cobalt",
  "lime",
  "lilac",
  "graphite",
];

export function DemoThumb({
  t,
  plate = "ember",
  className,
  padding = 0.07,
}: {
  t: number;
  plate?: Plate;
  className?: string;
  padding?: number;
}) {
  return (
    <div className={cn("relative overflow-hidden", PLATES[plate], className)}>
      <div style={{ padding: `${padding * 100}% ${padding * 100 * 1.6}%` }}>
        <div className="overflow-hidden rounded-[6px] shadow-[0_12px_30px_-12px_rgba(23,24,28,0.35),0_0_0_1px_rgba(23,24,28,0.06)]">
          <ScaledBox width={1280} height={800}>
            <LumenApp state={lumenState(t)} />
          </ScaledBox>
        </div>
      </div>
    </div>
  );
}
