"use client";
import { useEffect, useState, type ReactNode } from "react";
import Confetti from "../confetti";
import { BoltIcon } from "../icons";
import { cn } from "@/lib/utils";

export type CelebrationProps = {
  /** "trail" mostra o emoji do perfil; "level" mostra o número do nível novo. */
  kind: "trail" | "level";
  emoji?: ReactNode;
  level?: number;
  eyebrow: string;
  title: string;
  subtitle?: string;
  xp?: number;
  cta: string;
  onContinue: () => void;
};

// Estrelinhas que estouram em volta da insígnia quando ela pousa (posição em px a partir do centro).
const BURST: [number, number, number][] = [[-120, -40, 22], [118, -60, 18], [-96, 70, 16], [104, 64, 20], [0, -128, 16], [-150, 20, 12], [154, 6, 12]];

/**
 * Cerimônia de conquista: a insígnia cai girando, pousa com um quique, raios giram atrás,
 * estrelas e confete estouram e só então aparecem o texto e o botão.
 */
export function Celebration({ kind, emoji, level, eyebrow, title, subtitle, xp, cta, onContinue }: CelebrationProps) {
  const [landed, setLanded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLanded(true), 850);
    return () => clearTimeout(t);
  }, []);

  return (
    <div role="dialog" aria-modal="true" aria-label={`${eyebrow}: ${title}`} className="fixed inset-0 z-90 grid animate-[fade-in_.25s_ease-out_both] place-items-center bg-night/90 px-6">
      {landed && <Confetti pieces={90} />}
      <div className="flex w-full max-w-sm flex-col items-center text-center text-white">
        <div className="relative grid size-72 place-items-center">
          {/* Raios de sol girando atrás da insígnia */}
          <div
            className="absolute inset-0 animate-[cel-rays_9s_linear_infinite] rounded-full opacity-0 [animation-delay:.6s] mask-[radial-gradient(circle,#000_35%,transparent_70%)]"
            style={{ background: "repeating-conic-gradient(var(--color-orange-500) 0 10deg, transparent 10deg 30deg)" }}
            aria-hidden="true"
          />
          {/* Estrelas que estouram no pouso */}
          {BURST.map(([x, y, s], i) => (
            <svg
              key={i}
              viewBox="-10 -10 20 20"
              width={s}
              height={s}
              className="absolute left-1/2 top-1/2 animate-[cel-star_.7s_cubic-bezier(.34,1.56,.64,1)_both]"
              style={{ "--x": `${x}px`, "--y": `${y}px`, animationDelay: `${0.82 + i * 0.04}s` } as React.CSSProperties}
              aria-hidden="true"
            >
              <path d="M0 -10 Q1.6 -1.6 10 0 Q1.6 1.6 0 10 Q-1.6 1.6 -10 0 Q-1.6 -1.6 0 -10Z" fill="#FFE28A" />
            </svg>
          ))}
          {/* A insígnia: cai girando, quica e ganha um brilho que atravessa */}
          <div className="relative grid size-40 animate-[cel-drop_1.05s_cubic-bezier(.3,.7,.4,1)_both] place-items-center overflow-hidden rounded-full border-8 border-sun bg-purple-50 shadow-[0_10px_0_var(--color-orange-700)]">
            {kind === "trail" ? (
              <span className="grid size-full place-items-center p-2" aria-hidden="true">
                {emoji}
              </span>
            ) : (
              <span className="flex flex-col items-center leading-none text-brand" aria-hidden="true">
                <span className="text-xs font-black uppercase tracking-widest">Nível</span>
                <span className="font-display text-7xl font-bold">{level}</span>
              </span>
            )}
            <span
              className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 animate-[cel-shine_.9s_ease-in-out_both] bg-linear-to-r from-transparent via-white/80 to-transparent [animation-delay:1s]"
              aria-hidden="true"
            />
          </div>
        </div>

        <p className="mt-2 animate-[fade-up_.4s_ease-out_both] text-xs font-black uppercase tracking-[.14em] text-sun [animation-delay:1.05s]">{eyebrow}</p>
        <h2 className="mt-1 animate-[fade-up_.45s_ease-out_both] font-display text-4xl font-bold leading-tight [animation-delay:1.15s]">{title}</h2>
        {subtitle && <p className="mt-2 animate-[fade-up_.45s_ease-out_both] font-semibold text-white/80 [animation-delay:1.25s]">{subtitle}</p>}
        {xp ? (
          <span className="mt-4 inline-flex animate-[cel-pop_.5s_cubic-bezier(.34,1.56,.64,1)_both] items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 font-display text-lg font-semibold text-sun [animation-delay:1.35s]">
            <BoltIcon className="size-6" /> +{xp} XP
          </span>
        ) : null}
        <button
          type="button"
          autoFocus
          onClick={onContinue}
          className={cn("btn-3d sun mt-8 w-full animate-[fade-up_.45s_ease-out_both] [animation-delay:1.5s]")}
        >
          {cta}
        </button>
      </div>
    </div>
  );
}
