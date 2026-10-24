import Link from "next/link";
import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export type NodeState = "done" | "current" | "locked" | "open";

interface Props {
  href?: string;
  state: NodeState;
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  size?: "md" | "lg";
  className?: string;
  external?: boolean;
}

// Botão circular do caminho: anel na cor da linha (amarelo quando é a vez), miolo violeta claro.
export default function StageNode({ href, state, icon, label, sublabel, size = "lg", className, external }: Props) {
  const dims = size === "lg" ? "size-32" : "size-24";
  const locked = state === "locked";

  const circle = (
    <span
      className={cn(
        "relative grid place-items-center rounded-full border-[7px] bg-canvas p-1.5 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
        dims,
        locked ? "border-rule" : "border-rule group-hover:-translate-y-1 group-active:translate-y-0.5",
        state === "current" && "border-sun animate-pulse-ring",
      )}
    >
      <span
        className={cn(
          "grid size-full place-items-center rounded-full shadow-[inset_0_-6px_0_rgba(0,0,0,.08)]",
          locked ? "bg-panel2 text-soft" : "bg-brand-100 text-brand-700",
        )}
      >
        {locked ? <Lock className="size-8" /> : icon}
      </span>
      {state === "done" && (
        <span className="absolute -right-1 -top-1 grid size-8 place-items-center rounded-full bg-mint-700 text-white ring-4 ring-canvas animate-pop">
          <Check className="size-5" strokeWidth={3} />
        </span>
      )}
    </span>
  );

  const content = (
    <>
      {circle}
      <span className={cn("mt-2 font-display text-base font-semibold leading-tight", locked ? "text-soft" : "text-ink")}>{label}</span>
      {sublabel && <span className="text-xs font-semibold text-soft">{sublabel}</span>}
    </>
  );

  const base = cn("group flex flex-col items-center text-center", className);

  if (locked || !href) {
    return (
      <div className={base} aria-disabled="true" aria-label={`${label} — bloqueado`}>
        {content}
      </div>
    );
  }
  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={base}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={base}>
      {content}
    </Link>
  );
}
