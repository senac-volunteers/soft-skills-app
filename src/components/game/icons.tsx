"use client";
import { useId } from "react";
import { cn } from "@/lib/utils";
import BrainMascot from "./animation/brain-mascot";
import LeaderMascot from "./animation/leader-mascot";
import MountainClimberMascot from "./animation/motivation-mascot";
import LightbulbMascot from "./animation/lightbulb-mascot";

// Ícones ilustrados e animados da identidade visual (animações em globals.css).
// Cada um tem um movimento em repouso; com a classe "fire" no pai, faz a reação de conquista.
type IconProps = { className?: string };

const star4 = (x: number, y: number, s: number, fill: string, cls = "") => (
  <path
    className={cn("twinkle", cls)}
    d={`M${x} ${y - s} Q${x + s * 0.2} ${y - s * 0.2} ${x + s} ${y} Q${
      x + s * 0.2
    } ${y + s * 0.2} ${x} ${y + s} Q${x - s * 0.2} ${y + s * 0.2} ${
      x - s
    } ${y} Q${x - s * 0.2} ${y - s * 0.2} ${x} ${y - s}Z`}
    fill={fill}
  />
);

export function FlameIcon({ className }: IconProps) {
  const g = useId();
  return (
    <svg
      className={cn("ico", className)}
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFB23D" />
          <stop offset="1" stopColor="#FF4D4D" />
        </linearGradient>
      </defs>
      <g className="flame-all">
        <path
          className="fl-o"
          d="M32 4 C38 16 52 24 52 40 A20 20 0 0 1 12 40 C12 30 18 24 22 16 C24 22 27 25 30 25 C30 18 29 11 32 4Z"
          fill={`url(#${g})`}
        />
        <path
          className="fl-m"
          d="M32 22 C36 30 44 34 44 44 A12 12 0 0 1 20 44 C20 37 25 33 27 28 C29 31 30 32 31 32 C31 28 31 25 32 22Z"
          fill="#FFC83D"
        />
        <path
          className="fl-c"
          d="M32 36 C34 40 38 42 38 47 A6 6 0 0 1 26 47 C26 43 30 40 32 36Z"
          fill="#FFF3C4"
        />
        <ellipse
          cx="22"
          cy="34"
          rx="2.5"
          ry="6"
          fill="#fff"
          opacity=".35"
          transform="rotate(20 22 34)"
        />
      </g>
      <circle
        className="ember"
        style={{ ["--ex" as string]: "-6px" }}
        cx="26"
        cy="22"
        r="1.8"
        fill="#FFC83D"
      />
      <circle
        className="ember e2"
        style={{ ["--ex" as string]: "5px" }}
        cx="36"
        cy="18"
        r="1.5"
        fill="#FF8A3D"
      />
      <circle
        className="ember e3"
        style={{ ["--ex" as string]: "-2px" }}
        cx="32"
        cy="14"
        r="1.3"
        fill="#FFC83D"
      />
    </svg>
  );
}

export function BoltIcon({ className }: IconProps) {
  const g = useId();
  const c = useId();
  const d = "M37 4 L12 36 H29 L25 60 L52 26 H35 L41 4Z";
  return (
    <svg
      className={cn("ico", className)}
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE07A" />
          <stop offset="1" stopColor="#FFB020" />
        </linearGradient>
        <clipPath id={c}>
          <path d={d} />
        </clipPath>
      </defs>
      <g className="bolt-g">
        <path
          d={d}
          fill={`url(#${g})`}
          stroke="#E0A100"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <g clipPath={`url(#${c})`}>
          <rect
            className="ico-shine"
            x="10"
            y="0"
            width="9"
            height="64"
            fill="#fff"
            opacity=".7"
          />
        </g>
      </g>
      <path
        className="spark"
        d="M8 18 L2 14 M56 46 L62 50 M54 12 L60 6 M10 50 L4 56"
        stroke="#FFC83D"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MedalIcon({ className }: IconProps) {
  return (
    <svg
      className={cn("ico", className)}
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <g className="medal-g">
        <path d="M18 2h12l6 18H24z" fill="#5B43D6" />
        <path d="M46 2H34l-6 18h12z" fill="#7B61FF" />
        <circle
          cx="32"
          cy="40"
          r="17"
          fill="#FFC83D"
          stroke="#E0A100"
          strokeWidth="3.5"
        />
        <circle cx="32" cy="40" r="11" fill="#FFE07A" />
        <path
          d="m32 31.5 2.7 5.4 6 .9-4.4 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.4-4.2 6-.9z"
          fill="#E0A100"
        />
      </g>
      {star4(52, 24, 6, "#FFC83D")}
      {star4(10, 34, 4.5, "#A08CFF", "t2")}
      {star4(50, 54, 4, "#4CC2FF", "t3")}
    </svg>
  );
}

export function TrophyIcon({ className }: IconProps) {
  const c = useId();
  return (
    <svg
      className={cn("ico", className)}
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={c}>
          <path d="M17 6h30v18a15 15 0 0 1-30 0z" />
        </clipPath>
      </defs>
      <g className="cup-g">
        <path
          d="M17 11H8v5a10 10 0 0 0 10 10M47 11h9v5a10 10 0 0 1-10 10"
          stroke="#E0A100"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M17 6h30v18a15 15 0 0 1-30 0z" fill="#FFC83D" />
        <g clipPath={`url(#${c})`}>
          <rect
            className="ico-shine"
            x="10"
            y="0"
            width="8"
            height="64"
            fill="#fff"
            opacity=".6"
          />
        </g>
        <path d="M27 38h10v9H27z" fill="#E0A100" />
        <rect x="18" y="47" width="28" height="10" rx="4" fill="#7B61FF" />
        <rect x="24" y="50" width="16" height="3.5" rx="1.7" fill="#A996FF" />
      </g>
      {star4(54, 8, 4.5, "#FFC83D", "t2")}
    </svg>
  );
}

export function SoundIcon({ className }: IconProps) {
  return (
    <svg
      className={cn("ico", className)}
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <g className="spk-g">
        <path
          d="M8 24h10l16-13v42L18 40H8a3 3 0 0 1-3-3V27a3 3 0 0 1 3-3z"
          fill="#4CC2FF"
        />
        <path
          d="M12 29h6"
          stroke="#fff"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity=".6"
        />
        <path
          className="wave"
          d="M42 22a14 14 0 0 1 0 20"
          stroke="#4CC2FF"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          className="wave w2"
          d="M49 14a25 25 0 0 1 0 36"
          stroke="#4CC2FF"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg
      className={cn("ico", className)}
      viewBox="0 0 64 64"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="24" fill="#34D399" />
      <path
        d="M32 56a24 24 0 0 1-24-24c0-1.7.2-3.3.5-4.9C10.7 38 20 46 32 46s21.3-8 23.5-18.9c.3 1.6.5 3.2.5 4.9a24 24 0 0 1-24 24z"
        fill="#1FA578"
      />
      <path
        className="chk"
        d="M20 32l8 8 16-17"
        stroke="#fff"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Navegação: ícones soltos e coloridos (cinza quando inativos, via CSS do item).
export function HomeNavIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M6 22 24 6l18 16v18a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3z"
        fill="#7B61FF"
      />
      <path
        d="M3 23 24 5l21 18"
        stroke="#4B2FC9"
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M19 43V31a5 5 0 0 1 10 0v12z" fill="#FFC83D" />
    </svg>
  );
}

export function TrophyNavIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M12 8H5v5a8 8 0 0 0 8 8M36 8h7v5a8 8 0 0 1-8 8"
        stroke="#E0A100"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M12 4h24v14a12 12 0 0 1-24 0z" fill="#FFC83D" />
      <path d="M20 30h8v7h-8z" fill="#E0A100" />
      <rect x="13" y="37" width="22" height="7" rx="3" fill="#7B61FF" />
    </svg>
  );
}

export function InfoNavIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="20" fill="#4CC2FF" />
      <circle cx="24" cy="15" r="3.5" fill="#fff" />
      <rect x="20.5" y="21" width="7" height="16" rx="3.5" fill="#fff" />
    </svg>
  );
}

// Emblemas das trilhas (no lugar das ilustrações antigas).
export function TrailEmblem({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  if (slug === "inteligencia-emocional")
    return <BrainMascot className={className} />;
  if (slug === "estilos-de-lideranca")
    return <LeaderMascot className={className} />;
  if (slug === "motivacao-no-trabalho")
    return <MountainClimberMascot className={className} />;
  return <LightbulbMascot className={className} />;
}
