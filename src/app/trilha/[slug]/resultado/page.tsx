"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
import { Shell } from "@/components/game/shell";
import Confetti from "@/components/game/confetti";
import { TRAIL_STYLE } from "@/components/game/trail-card";
import { TrailEmblem, TrophyIcon } from "@/components/game/icons";
import { getTrail } from "@/game/trails";
import { computeResult } from "@/game/scoring";
import { useGame } from "@/game/store";
import { cn } from "@/lib/utils";

export default function ResultPage() {
  const { slug } = useParams<{ slug: string }>();
  const trail = getTrail(slug);
  const { progressOf, ready } = useGame();
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    setCelebrate(new URLSearchParams(window.location.search).has("celebrar"));
  }, []);

  if (!trail) notFound();
  const p = progressOf(trail.slug);
  const hasAnswers = p.answers.every((a) => a !== null);
  const style = TRAIL_STYLE[trail.color];

  if (!ready) return <Shell>{null}</Shell>;

  if (!hasAnswers) {
    return (
      <Shell>
        <div className="space-y-4 py-16 text-center">
          <TrailEmblem slug={trail.slug} className="mx-auto size-24" />
          <p className="font-bold text-soft">Complete o desafio para revelar seu perfil!</p>
          <Link href={`/trilha/${trail.slug}/caminho`} className="btn-3d">
            Ir para o desafio
          </Link>
        </div>
      </Shell>
    );
  }

  const result = computeResult(trail, p.answers as (string | number)[]);

  return (
    <Shell>
      {celebrate && <Confetti />}
      <Link href={`/trilha/${trail.slug}`} className="mb-3 inline-flex items-center gap-1 text-sm font-extrabold text-pop hover:underline">
        <ArrowLeft className="size-4" /> {trail.title}
      </Link>

      <section className={cn("relative overflow-hidden rounded-[28px] px-5 py-6 text-center text-night", style.card, style.shadow)}>
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/40" aria-hidden="true" />
        <p className={cn("text-xs font-black uppercase tracking-widest", style.strong)}>{result.heading}</p>
        <div className={cn("relative mx-auto my-4 grid size-28 place-items-center", celebrate && "fire")} aria-hidden="true">
          <span className="absolute inset-0 animate-pop rounded-full border-[6px] border-sun bg-purple-50 shadow-[0_6px_0_var(--color-orange-700)]" />
          <span className="relative grid size-full place-items-center p-2">{result.emoji}</span>
        </div>
        <h1 className="animate-fade-up font-display text-3xl font-bold leading-tight">{result.title}</h1>
        <p className="mt-2 font-semibold opacity-90">{result.description}</p>
      </section>

      <section className="mt-6 space-y-4" aria-label="Detalhes da pontuação">
        {result.bars.map((b, i) => (
          <div key={b.label} className="animate-fade-up" style={{ animationDelay: `${150 + i * 80}ms` }}>
            <div className="mb-1 flex justify-between text-sm font-extrabold">
              <span>{b.label}</span>
              <span className="text-pop">{b.hint ?? `${Math.round(b.value)}%`}</span>
            </div>
            <div className="h-4 overflow-hidden rounded-full bg-panel2">
              <div className="h-full rounded-full bg-brand transition-[width] duration-1000 ease-out" style={{ width: `${Math.max(4, b.value)}%` }} />
            </div>
          </div>
        ))}
      </section>

      <div className="mt-8 space-y-4">
        <div className={cn("flex items-center gap-3 rounded-2xl border-2 border-rule bg-panel p-4", celebrate && "fire")}>
          <TrophyIcon className="size-12 shrink-0" />
          <p className="font-bold leading-snug">Trilha concluída! Veja o relatório completo ou refaça quando quiser.</p>
        </div>
        <Link href={`/autoavaliacao/${trail.slug}/resultados`} className="btn-3d w-full">
          <FileText className="size-5" /> Relatório completo
        </Link>
        <Link href="/" className="btn-3d ghost w-full">
          Explorar outras trilhas
        </Link>
      </div>
    </Shell>
  );
}
