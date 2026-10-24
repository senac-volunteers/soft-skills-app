"use client";
import Link from "next/link";
import { Trail, TrailColor } from "@/game/trails";
import { answeredCount, useGame } from "@/game/store";
import { ProgressBar } from "./progress-bar";
import { CheckIcon, TrailEmblem } from "./icons";
import { cn } from "@/lib/utils";

// Cada trilha tem sua cor: fundo claro da cor (igual nos dois temas) com texto escuro.
export const TRAIL_STYLE: Record<
  TrailColor,
  { card: string; shadow: string; strong: string }
> = {
  coral: {
    card: "bg-coral-100",
    shadow: "card-3d [--sc:#FFC2C2]",
    strong: "text-coral-700",
  },
  sea: {
    card: "bg-sea-100",
    shadow: "card-3d [--sc:#B5E4FF]",
    strong: "text-sea-700",
  },
  sun: {
    card: "bg-sun-100",
    shadow: "card-3d [--sc:var(--color-orange-200)]",
    strong: "text-sun-700",
  },
  mint: {
    card: "bg-mint-100",
    shadow: "card-3d [--sc:#A9EDCF]",
    strong: "text-mint-700",
  },
};

export function TrailHero({
  trail,
  className,
}: {
  trail: Trail;
  className?: string;
}) {
  const { progressOf, ready } = useGame();
  const p = progressOf(trail.slug);
  const done = ready ? answeredCount(p) : 0;
  const total = trail.questions.length;
  const style = TRAIL_STYLE[trail.color];

  return (
    <div
      className={cn(
        "relative flex min-h-44 flex-col overflow-hidden rounded-[28px] p-5 text-night",
        style.card,
        style.shadow,
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="line-clamp-2 font-display text-2xl font-semibold leading-tight">
            {trail.title}
          </h2>
          <p
            className={cn(
              "mt-0.5 line-clamp-2 text-sm font-bold",
              style.strong
            )}
          >
            {trail.tagline}
          </p>
        </div>
        <TrailEmblem
          slug={trail.slug}
          className="size-16 shrink-0 transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:-translate-y-1 group-hover:-rotate-6"
        />
      </div>
      <div className="mt-auto flex items-center gap-3 pt-5">
        <ProgressBar value={done} max={total} className="bg-white/70" />
        <span
          className="whitespace-nowrap font-display text-lg font-semibold tabular-nums"
          aria-label={`${done} de ${total} perguntas`}
        >
          {done}/{total}
        </span>
        {/* Espaço reservado: concluída ou não, a barra tem o mesmo tamanho em todos os cartões. */}
        <span className="grid size-7 shrink-0 place-items-center">
          {p.completions > 0 && <CheckIcon className="size-7" />}
        </span>
      </div>
    </div>
  );
}

export default function TrailCard({
  trail,
  index,
}: {
  trail: Trail;
  index: number;
}) {
  return (
    // A entrada anima o invólucro; o hover anima o cartão de dentro (sem as duas animações brigarem pelo transform).
    <div
      className="h-full animate-fade-up"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <Link
        href={`/trilha/${trail.slug}`}
        className="lift-host group block h-full rounded-[28px]"
        aria-label={`Abrir trilha ${trail.title}`}
      >
        {/* Na grade do início todos os cartões esticam até a mesma altura. */}
        <TrailHero trail={trail} className="h-full" />
      </Link>
    </div>
  );
}
