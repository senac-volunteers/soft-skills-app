"use client";
import Link from "next/link";
import { ExternalLink, Play } from "lucide-react";
import { BADGES, DAILY_GOAL, answeredCount, dayKey, useGame } from "@/game/store";
import { TRAILS } from "@/game/trails";
import { cn } from "@/lib/utils";
import { CheckIcon, FlameIcon, MedalIcon, TrailEmblem } from "./icons";
import { ProgressBar } from "./progress-bar";
import { Tooltip } from "./tooltip";
import { TRAIL_STYLE } from "./trail-card";

const panel = "rounded-2xl border-2 border-rule p-5";
const panelTitle = "text-xs font-black uppercase tracking-wider text-soft";

/** Meta do dia: anel que enche com as respostas de hoje. */
export function DailyGoal() {
  const { state, ready } = useGame();
  const today = dayKey(new Date());
  const count = ready && state.daily.day === today ? state.daily.count : 0;
  const pct = Math.min(1, count / DAILY_GOAL);
  const done = count >= DAILY_GOAL;
  return (
    <section className={cn(panel, "flex items-center gap-4")} aria-label={`Meta do dia: ${Math.min(count, DAILY_GOAL)} de ${DAILY_GOAL} situações`}>
      <div className="relative grid size-16 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(var(--color-orange-500) ${pct * 360}deg, var(--panel2) 0)` }}>
        <span className="grid size-12 place-items-center rounded-full bg-canvas font-display text-lg font-semibold">
          {done ? <CheckIcon className="size-9" /> : `${count}/${DAILY_GOAL}`}
        </span>
      </div>
      <div className="min-w-0">
        <p className={panelTitle}>Meta do dia</p>
        <p className="font-display text-lg font-semibold leading-tight">{done ? "Meta batida!" : `Responda ${DAILY_GOAL} situações`}</p>
        <p className="text-sm font-semibold text-soft">{done ? "Volte amanhã para manter a sequência." : `Faltam ${DAILY_GOAL - count}.`}</p>
      </div>
    </section>
  );
}

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

/** Sequência da semana: os últimos 7 dias, com fogo nos dias em que houve resposta. */
export function WeekStreak() {
  const { state, ready } = useGame();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { key: dayKey(d), label: WEEKDAYS[d.getDay()], today: i === 6 };
  });
  return (
    <section className={panel} aria-label={`Sequência de ${state.streak.count} dias`}>
      <div className="mb-3 flex items-center justify-between">
        <p className={panelTitle}>Sua semana</p>
        <span className="flex items-center gap-1 font-display font-semibold text-coral-600 dark:text-coral">
          <FlameIcon className="size-5" /> {ready ? state.streak.count : "–"} {state.streak.count === 1 ? "dia" : "dias"}
        </span>
      </div>
      <ol className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const active = ready && state.activeDays.includes(d.key);
          return (
            <li key={d.key} className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  "grid size-9 place-items-center rounded-full border-2",
                  active ? "border-transparent bg-coral-100" : "border-rule",
                  d.today && !active && "border-dashed border-coral",
                )}
              >
                {active ? <FlameIcon className="size-6" /> : null}
              </span>
              <span className={cn("text-[11px] font-black", d.today ? "text-ink" : "text-soft")}>{d.label}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/** Próxima insígnia a desbloquear e a coleção em miniatura. */
export function NextBadge() {
  const { state, ready } = useGame();
  const next = BADGES.find((b) => !state.badges.includes(b.id));
  return (
    <section className={panel}>
      <div className="mb-3 flex items-center justify-between">
        <p className={panelTitle}>Insígnias</p>
        <span className="font-display font-semibold text-pop">
          {ready ? state.badges.length : "–"}/{BADGES.length}
        </span>
      </div>
      {next ? (
        <div className="mb-4 flex items-center gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-full border-[3px] border-dashed border-rule text-2xl grayscale">{next.emoji}</span>
          <div className="min-w-0">
            <p className="font-display font-semibold leading-tight">Próxima: {next.title}</p>
            <p className="line-clamp-2 text-sm font-semibold text-soft">{next.description}</p>
          </div>
        </div>
      ) : (
        <p className="mb-4 flex items-center gap-2 font-display font-semibold">
          <MedalIcon className="size-8" /> Coleção completa!
        </p>
      )}
      <ul className="grid grid-cols-8 gap-1.5" aria-label="Coleção de insígnias">
        {BADGES.map((b, i) => {
          const earned = ready && state.badges.includes(b.id);
          return (
            <li key={b.id}>
              <Tooltip
                side="top"
                align={i === 0 ? "start" : i === BADGES.length - 1 ? "end" : "center"}
                text={<><b>{b.title}</b> · {earned ? "conquistada" : b.description}</>}
                className="w-full"
              >
                <span
                  tabIndex={0}
                  className={cn("grid aspect-square w-full place-items-center rounded-full text-sm", earned ? "bg-sun-100" : "bg-panel opacity-50 grayscale")}
                >
                  <span aria-hidden="true">{b.emoji}</span>
                  <span className="sr-only">
                    {b.title}: {earned ? "conquistada" : "bloqueada"}
                  </span>
                </span>
              </Tooltip>
            </li>
          );
        })}
      </ul>
      <Link href="/conquistas" className="mt-4 block text-sm font-extrabold uppercase tracking-wider text-pop hover:underline">
        Ver conquistas
      </Link>
    </section>
  );
}

/** Curso gratuito de inteligência emocional. */
export function CourseCard() {
  const course = TRAILS.find((t) => t.courseUrl);
  if (!course?.courseUrl) return null;
  return (
    <a
      href={course.courseUrl}
      target="_blank"
      rel="noreferrer"
      className={cn(panel, "group flex items-center gap-3 transition-colors hover:bg-panel")}
    >
      <TrailEmblem slug={course.slug} className="size-10 shrink-0 transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:-rotate-6 group-hover:scale-110" />
      <div className="min-w-0 flex-1">
        <p className="font-display font-semibold leading-tight">Curso gratuito</p>
        <p className="text-sm font-semibold text-soft">Inteligência Emocional · 1 hora</p>
      </div>
      <ExternalLink className="size-4 shrink-0 text-pop" />
    </a>
  );
}

/** Banner do topo do início: continuar a trilha em andamento ou começar a primeira. */
export function ContinueHero() {
  const { state, ready, progressOf } = useGame();
  if (!ready) return <div className="h-[132px] rounded-[28px] bg-panel" aria-hidden="true" />;

  const inProgress = TRAILS.find((t) => {
    const p = progressOf(t.slug);
    return !p.completed && answeredCount(p) > 0;
  });
  const fresh = TRAILS.find((t) => progressOf(t.slug).completions === 0);
  const trail = inProgress ?? fresh;
  const started = Object.keys(state.trails).length > 0;

  if (!trail) {
    return (
      <section className="card-3d flex items-center gap-4 rounded-[28px] bg-brand p-5 text-purple-50 [--sc:var(--color-brand-700)]">
        <MedalIcon className="size-14 shrink-0" />
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-purple-50/80">Todas as trilhas concluídas</p>
          <p className="font-display text-2xl font-semibold leading-tight">Você explorou todas as soft skills!</p>
        </div>
      </section>
    );
  }

  const p = progressOf(trail.slug);
  const done = answeredCount(p);
  const total = trail.questions.length;
  return (
    <Link href={`/trilha/${trail.slug}/desafio`} className="lift-host group block rounded-[28px]">
      <section className="card-3d relative flex items-center gap-4 overflow-hidden rounded-[28px] bg-brand p-5 text-purple-50 [--sc:var(--color-brand-700)] sm:gap-6 sm:p-6">
        <span className="absolute -right-8 -top-10 size-40 rounded-full bg-purple-50/10" aria-hidden="true" />
        <span className={cn("relative grid size-16 shrink-0 place-items-center rounded-2xl sm:size-20", TRAIL_STYLE[trail.color].card)}>
          <TrailEmblem slug={trail.slug} className="size-11 transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:-rotate-6 group-hover:scale-110 sm:size-14" />
        </span>
        <div className="relative min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-wider text-orange-300">{inProgress ? "Continue de onde parou" : started ? "Próxima trilha" : "Comece por aqui"}</p>
          <p className="truncate font-display text-2xl font-semibold leading-tight">{trail.title}</p>
          <div className="mt-2 flex items-center gap-3">
            <ProgressBar value={done} max={total} className="h-3 bg-purple-50/25" />
            <span className="whitespace-nowrap font-display font-semibold tabular-nums">
              {done}/{total}
            </span>
          </div>
        </div>
        <span className="relative hidden size-12 shrink-0 place-items-center rounded-full bg-purple-50 text-orange-500 shadow-[0_4px_0_var(--color-brand-700)] transition-transform duration-300 group-hover:scale-110 sm:grid">
          <Play className="size-6 translate-x-0.5 fill-current" />
        </span>
      </section>
    </Link>
  );
}
