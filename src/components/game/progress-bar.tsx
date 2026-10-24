"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/** Barra de progresso amarela: enche com mola e um brilho atravessa sempre que avança. */
export function ProgressBar({ value, max, className }: { value: number; max: number; className?: string }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  const ref = useRef<HTMLDivElement>(null);
  const prev = useRef(value);
  useEffect(() => {
    const el = ref.current;
    if (el && value > prev.current) {
      el.classList.remove("progress-shine");
      void el.offsetWidth;
      el.classList.add("progress-shine");
    }
    prev.current = value;
  }, [value]);
  return (
    <div
      ref={ref}
      className={cn("relative h-4 w-full overflow-hidden rounded-full bg-panel2", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <div className="progress-fill absolute inset-y-0 left-0 overflow-hidden rounded-full bg-sun" style={{ width: `${pct}%` }}>
        <div className="absolute left-2 right-2 top-1 h-1 rounded-full bg-white/50" />
      </div>
    </div>
  );
}
