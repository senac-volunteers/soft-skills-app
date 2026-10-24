"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { BADGES, useGame } from "@/game/store";
import { cn } from "@/lib/utils";
import { playThemeSwap } from "./theme-swap";
import { Tooltip } from "./tooltip";
import {
  BoltIcon,
  FlameIcon,
  HomeNavIcon,
  InfoNavIcon,
  MedalIcon,
  TrophyNavIcon,
} from "./icons";
import { ProgressBar } from "./progress-bar";
import { CourseCard, DailyGoal, NextBadge, WeekStreak } from "./widgets";

const NAV = [
  { href: "/", label: "Trilhas", icon: HomeNavIcon },
  { href: "/conquistas", label: "Conquistas", icon: TrophyNavIcon },
  { href: "/sobre", label: "Sobre", icon: InfoNavIcon },
];

function useIsActive() {
  const pathname = usePathname();
  return (href: string) =>
    href === "/"
      ? pathname === "/" || pathname.startsWith("/trilha")
      : pathname.startsWith(href);
}

function Stat({
  icon,
  value,
  label,
  tip,
  align,
  className,
}: {
  icon: React.ReactNode;
  value: React.ReactNode;
  label: string;
  tip: React.ReactNode;
  align: "start" | "center" | "end";
  className?: string;
}) {
  return (
    <Tooltip text={tip} align={align}>
      {/* tabIndex: no toque/teclado o foco também mostra a dica */}
      <div
        tabIndex={0}
        className={cn(
          "group flex h-9 items-center gap-1.5 rounded-lg font-display text-base font-semibold leading-none tabular-nums outline-offset-4",
          className
        )}
        aria-label={label}
      >
        <span className="grid size-6 shrink-0 place-items-center transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110">
          {icon}
        </span>
        <span className="min-w-[1ch]">{value}</span>
      </div>
    </Tooltip>
  );
}

function Stats({ className }: { className?: string }) {
  const { state, ready } = useGame();
  const show = (v: number) => (ready ? v : "–");
  return (
    <div className={cn("flex items-center gap-4 sm:gap-6", className)}>
      <Stat
        icon={<FlameIcon className="size-6" />}
        value={show(state.streak.count)}
        label={`Sequência de ${state.streak.count} dias`}
        tip={
          <>
            <b>Sequência</b> · {state.streak.count}{" "}
            {state.streak.count === 1 ? "dia" : "dias"} seguidos
          </>
        }
        align="start"
        className="text-coral-600 dark:text-coral"
      />
      <Stat
        icon={<BoltIcon className="size-6" />}
        value={show(state.xp)}
        label={`${state.xp} pontos de experiência`}
        tip={
          <>
            <b>XP</b> · {state.xp} pontos de experiência
          </>
        }
        align="center"
        className="text-sun-700 dark:text-sun"
      />
      <Stat
        icon={<MedalIcon className="size-6" />}
        value={show(state.badges.length)}
        label={`${state.badges.length} insígnias`}
        tip={
          <>
            <b>Insígnias</b> · {state.badges.length} de {BADGES.length}
          </>
        }
        align="end"
        className="text-pop"
      />
    </div>
  );
}

function LevelBadge({ withLabel = true }: { withLabel?: boolean }) {
  const { level, ready } = useGame();
  return (
    <Link
      href="/conquistas"
      className="flex h-9 items-center gap-1.5 font-display text-base font-semibold leading-none text-pop transition-transform hover:-translate-y-0.5"
      aria-label={`Nível ${level}. Ver conquistas`}
    >
      <span className="grid size-7 place-items-center rounded-full bg-orange-500 text-sm text-blue-900 shadow-[0_2px_0_var(--color-orange-700)]">
        {ready ? level : "–"}
      </span>
      {withLabel && <span className="hidden min-[400px]:inline">nível</span>}
    </Link>
  );
}

export function ThemeToggle({
  className,
  withLabel = false,
}: {
  className?: string;
  withLabel?: boolean;
}) {
  const [dark, setDark] = useState<boolean | null>(null);
  useEffect(
    () => setDark(document.documentElement.dataset.theme === "dark"),
    []
  );
  function apply(next: "light" | "dark") {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("ssa:theme", next);
    } catch {
      /* armazenamento indisponível: a troca vale só nesta visita */
    }
    setDark(next === "dark");
  }
  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    const next =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return apply(next);
    const r = e.currentTarget.getBoundingClientRect();
    playThemeSwap(
      { x: r.left + r.width / 2, y: r.top + r.height / 2 },
      next,
      () => apply(next)
    );
  }
  const label = dark ? "Usar tema claro" : "Usar tema escuro";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      className={cn(
        "group flex items-center gap-3 rounded-full text-soft transition-colors hover:bg-panel hover:text-ink",
        withLabel
          ? "w-full rounded-2xl px-4 py-3 font-extrabold"
          : "size-9 shrink-0 justify-center",
        className
      )}
    >
      <span key={String(dark)} className="inline-flex animate-theme-spin">
        {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </span>
      {withLabel && <span>{dark ? "Tema claro" : "Tema escuro"}</span>}
    </button>
  );
}

/** Barra superior (celular e tablet): nível, estatísticas e tema, com espaço entre os ícones. */
export function TopBar() {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-rule bg-canvas/90 backdrop-blur-sm xl:hidden">
      <div className="mx-auto flex h-14 max-w-xl items-center justify-between gap-3 px-4 sm:px-6">
        <span className="lg:invisible">
          <LevelBadge />
        </span>
        <div className="flex items-center gap-3 sm:gap-5">
          <Stats />
          <ThemeToggle className="-mr-1 lg:hidden" />
        </div>
      </div>
    </header>
  );
}

/** Navegação inferior (celular e tablet): só ícones, o ativo ganha cor e contorno. */
export function BottomNav() {
  const isActive = useIsActive();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-rule bg-canvas pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Navegação principal"
    >
      <ul className="mx-auto grid max-w-xl grid-cols-3 items-center gap-3 px-4 py-2 sm:px-6">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex h-14 w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 transition-all duration-300 active:scale-95",
                  active
                    ? "border-brand/60 bg-brand/10"
                    : "border-transparent opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
                )}
              >
                <span
                  key={String(active)}
                  className={cn(
                    "grid size-7 place-items-center",
                    active ? "animate-icon-pop" : "group-hover:animate-nudge"
                  )}
                >
                  <Icon className="size-7" />
                </span>
                <span
                  className={cn(
                    "text-[11px] font-extrabold leading-none",
                    active ? "text-pop" : "text-soft"
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Menu lateral (computador): marca, navegação com rótulos e troca de tema. */
function Sidebar() {
  const isActive = useIsActive();
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r-2 border-rule px-4 py-6 lg:flex">
      <Link
        href="/"
        className="mb-8 px-3 font-display text-2xl font-bold leading-tight text-pop"
      >
        Soft Skills
        <br />
        Academy
      </Link>
      <nav aria-label="Navegação principal">
        <ul className="space-y-2">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex items-center gap-4 rounded-2xl border-2 px-4 py-2.5 font-extrabold uppercase tracking-wider transition-all duration-200 active:scale-[.98]",
                    active
                      ? "border-brand/60 bg-brand/10 text-pop"
                      : "border-transparent text-soft hover:bg-panel hover:text-ink"
                  )}
                >
                  <span
                    key={String(active)}
                    className={cn(
                      "grid size-8 place-items-center",
                      active
                        ? "animate-icon-pop"
                        : "opacity-70 grayscale group-hover:animate-nudge group-hover:opacity-100 group-hover:grayscale-0"
                    )}
                  >
                    <Icon className="size-8" />
                  </span>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-auto">
        <ThemeToggle withLabel />
      </div>
    </aside>
  );
}

/** Painel lateral (telas largas): estatísticas, nível, meta do dia, semana, insígnias e curso. */
function StatsPanel() {
  const { state, level } = useGame();
  const xpInLevel = state.xp % 100;
  return (
    <aside className="no-scrollbar sticky top-0 hidden max-h-dvh w-80 shrink-0 space-y-4 self-start overflow-y-auto py-10 xl:block">
      <div className="flex items-center justify-between rounded-2xl border-2 border-rule px-5 py-2">
        <Stats className="w-full justify-between" />
      </div>
      <div className="rounded-2xl border-2 border-rule p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-pop">
              Nível {level}
            </p>
            <p className="font-display text-lg font-semibold">
              {xpInLevel}/100 XP
            </p>
          </div>
          <MedalIcon className="size-12" />
        </div>
        <ProgressBar value={xpInLevel} max={100} className="mt-3" />
      </div>
      <DailyGoal />
      <WeekStreak />
      <NextBadge />
      <CourseCard />
    </aside>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-dvh bg-canvas text-ink lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <TopBar />
        <div className="mx-auto flex max-w-7xl justify-center gap-12 px-4 sm:px-6 lg:px-10">
          {/* Cada página entra com um leve deslize e fade (a chave reinicia a animação a cada rota). */}
          <main
            key={pathname}
            className="w-full max-w-xl animate-page-in self-start pb-32 pt-6 lg:max-w-2xl lg:pb-12 lg:pt-10 2xl:max-w-3xl"
          >
            {children}
          </main>
          <StatsPanel />
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

export { ProgressBar } from "./progress-bar";
