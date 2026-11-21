import { ArrowRight, Globe } from "lucide-react";
import { cn } from "@/lib/cn";

export function RecordForm({
  className,
  onAccent = false,
}: {
  className?: string;
  onAccent?: boolean;
}) {
  return (
    <form
      action="/new"
      method="get"
      className={cn(
        "group/form w-full max-w-[640px] rounded-[22px] bg-white p-1.5 text-left shadow-[0_1px_2px_rgba(23,24,28,0.04),0_12px_40px_-12px_rgba(23,24,28,0.14)] ring-1 ring-rule transition-shadow duration-200 focus-within:ring-[#CDD0D6]",
        className,
      )}
    >
      <label className="flex h-12 items-center gap-3 rounded-[16px] px-4 transition-colors duration-150 focus-within:bg-[#F5F6F8]">
        <Globe className="size-4 shrink-0 text-muted" strokeWidth={1.75} />
        <span className="sr-only">Your app&apos;s URL</span>
        <input
          name="url"
          type="url"
          inputMode="url"
          autoComplete="url"
          placeholder="https://your-app.com"
          className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-[#A0A4AC]"
        />
      </label>
      <div className="mx-4 h-px bg-[#EDEEF1]" />
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
        <label className="flex h-12 flex-1 items-center gap-3 rounded-[16px] px-4 transition-colors duration-150 focus-within:bg-[#F5F6F8]">
          <span className="sr-only">What should the demo show?</span>
          <input
            name="goal"
            placeholder="Show how to create a task and assign it"
            className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-[#A0A4AC]"
          />
        </label>
        <button
          type="submit"
          className={cn(
            "flex h-11 items-center justify-center gap-2 rounded-[15px] pr-4 pl-3.5 text-[14px] font-medium text-white transition-[background-color,transform] duration-150 ease-out active:scale-[0.97] sm:mr-0.5",
            onAccent
              ? "bg-ink hover:bg-[#24252C]"
              : "bg-signal hover:bg-[#DB4622]",
          )}
        >
          <span className="relative flex size-2">
            <span
              className={cn(
                "absolute inset-0 animate-ping rounded-full opacity-60",
                onAccent ? "bg-signal" : "bg-white",
              )}
            />
            <span
              className={cn(
                "relative size-2 rounded-full",
                onAccent ? "bg-signal" : "bg-white",
              )}
            />
          </span>
          Record demo
          <ArrowRight className="size-4 transition-transform duration-200 group-hover/form:translate-x-0.5" />
        </button>
      </div>
    </form>
  );
}
