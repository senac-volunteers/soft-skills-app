"use client";
import { useState } from "react";
import { Lock, RotateCcw } from "lucide-react";
import { ConfirmDialog } from "@/components/game/confirm-dialog";
import { Shell, ProgressBar } from "@/components/game/shell";
import { BoltIcon, FlameIcon, MedalIcon } from "@/components/game/icons";
import { BADGES, useGame } from "@/game/store";
import { cn } from "@/lib/utils";

export default function AchievementsPage() {
  const { state, level, resetAll } = useGame();
  const xpInLevel = state.xp % 100;
  const [confirming, setConfirming] = useState(false);
  const [cleared, setCleared] = useState(false);

  return (
    <Shell>
      <h1 className="mb-4 font-display text-3xl font-bold">Conquistas</h1>

      <section className="rounded-[28px] bg-brand-100 p-5 text-night shadow-[0_6px_0_var(--color-blue-100)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-brand-700">Nível atual</p>
            <p className="font-display text-5xl font-bold">{level}</p>
          </div>
          <MedalIcon className="size-16" />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <ProgressBar value={xpInLevel} max={100} className="bg-purple-50/70" />
          <span className="whitespace-nowrap text-sm font-black">{xpInLevel}/100 XP</span>
        </div>
      </section>

      <section className="mt-4 grid auto-rows-fr grid-cols-2 gap-3">
        <div className="rounded-2xl border-2 border-rule p-4 shadow-[0_4px_0_var(--rule)]">
          <FlameIcon className="size-9" />
          <p className="mt-1 font-display text-3xl font-semibold">{state.streak.count}</p>
          <p className="text-xs font-bold text-soft">dias seguidos</p>
        </div>
        <div className="rounded-2xl border-2 border-rule p-4 shadow-[0_4px_0_var(--rule)]">
          <BoltIcon className="size-9" />
          <p className="mt-1 font-display text-3xl font-semibold">{state.xp}</p>
          <p className="text-xs font-bold text-soft">XP total</p>
        </div>
      </section>

      <h2 className="mb-3 mt-8 font-display text-xl font-semibold">
        Insígnias <span className="text-soft">{state.badges.length}/{BADGES.length}</span>
      </h2>
      <ul className="grid grid-cols-3 gap-x-3 gap-y-4 sm:grid-cols-4">
        {BADGES.map((b, i) => {
          const earned = state.badges.includes(b.id);
          return (
            <li key={b.id} className="flex animate-fade-up flex-col items-center text-center" style={{ animationDelay: `${i * 50}ms` }}>
              <div
                className={cn(
                  "lift relative grid size-20 place-items-center rounded-full border-[5px] text-3xl",
                  earned ? "border-sun bg-orange-50 shadow-[0_4px_0_var(--color-orange-700)]" : "border-rule bg-panel opacity-60 grayscale",
                )}
              >
                <span aria-hidden="true">{b.emoji}</span>
                {!earned && <Lock className="absolute -bottom-1 -right-1 size-6 rounded-full bg-canvas p-1 text-soft" />}
              </div>
              <p className={cn("mt-1.5 line-clamp-2 min-h-8 text-xs font-black leading-tight", earned ? "text-ink" : "text-soft")}>{b.title}</p>
              <p className="mt-0.5 line-clamp-2 text-[11px] font-semibold leading-tight text-soft" aria-hidden="true">{b.description}</p>
              <p className="sr-only">
                {earned ? "Conquistada" : "Bloqueada"}. {b.description}
              </p>
            </li>
          );
        })}
      </ul>

      <div className="mt-10">
        {cleared ? (
          <p className="animate-pop text-center text-sm font-extrabold text-pop" role="status">
            Progresso apagado. Bora começar de novo!
          </p>
        ) : (
          <button type="button" onClick={() => setConfirming(true)} className="w-full text-sm font-bold text-soft hover:text-coral-600">
            Reiniciar progresso
          </button>
        )}
      </div>
      <ConfirmDialog
        open={confirming}
        icon={<RotateCcw className="size-8" strokeWidth={2.5} />}
        title="Apagar todo o progresso?"
        description="Respostas, XP, sequência e insígnias voltam do zero. Não dá para desfazer."
        confirmLabel="Apagar tudo"
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          resetAll();
          setConfirming(false);
          setCleared(true);
        }}
      />
    </Shell>
  );
}
