"use client";
import { Shell } from "@/components/game/shell";
import { SiteFooter } from "@/components/game/site-footer";
import TrailCard from "@/components/game/trail-card";
import { ContinueHero, DailyGoal, WeekStreak } from "@/components/game/widgets";
import { TRAILS } from "@/game/trails";
import { useGame } from "@/game/store";

const STEPS = [
  { title: "Escolha", text: "Uma trilha por soft skill." },
  { title: "Responda", text: "Situações do dia a dia, sem resposta errada." },
  { title: "Descubra", text: "Seu perfil, uma insígnia e o relatório." },
];

export default function Home() {
  const { state, ready } = useGame();
  const started = ready && Object.keys(state.trails).length > 0;

  return (
    <Shell>
      <header className="mb-6">
        <p className="text-xs font-black uppercase tracking-[.12em] text-pop">
          Soft Skills Academy
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold leading-tight lg:text-4xl">
          {started ? "Bora continuar?" : "Escolha uma trilha"}
        </h1>
        <p className="mt-1 font-semibold text-soft">
          {started
            ? "Seu progresso fica salvo. Volte de onde parou."
            : "Cada trilha tem situações do dia a dia. Não existe resposta errada."}
        </p>
      </header>

      <ContinueHero />

      <h2 className="mb-4 mt-8 font-display text-xl font-semibold">Trilhas</h2>
      <div className="grid auto-rows-fr gap-5 md:grid-cols-2">
        {TRAILS.map((t, i) => (
          <TrailCard key={t.slug} trail={t} index={i} />
        ))}
      </div>

      {/* Sem o painel lateral (celular e tablet), meta do dia e semana ficam aqui. */}
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:hidden">
        <DailyGoal />
        <WeekStreak />
      </div>

      <section aria-labelledby="como" className="mt-10">
        <h2 id="como" className="mb-4 font-display text-xl font-semibold">
          Como funciona
        </h2>
        <ol className="grid auto-rows-fr gap-3 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-x-3 rounded-2xl bg-panel p-4 sm:flex sm:flex-col sm:items-start sm:gap-2"
            >
              <span className="row-span-2 grid size-9 place-items-center rounded-full bg-brand font-display font-semibold text-purple-50 shadow-[0_3px_0_var(--color-brand-700)]">
                {i + 1}
              </span>
              <p className="font-display text-lg font-semibold leading-tight">
                {s.title}
              </p>
              <p className="text-sm font-semibold text-soft">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <SiteFooter />
    </Shell>
  );
}
