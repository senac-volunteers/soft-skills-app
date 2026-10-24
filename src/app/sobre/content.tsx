"use client";
import Link from "next/link";
import { Shell, ThemeToggle } from "@/components/game/shell";
import { TRAIL_STYLE } from "@/components/game/trail-card";
import { BoltIcon, CheckIcon, FlameIcon, MedalIcon, SoundIcon, TrailEmblem, TrophyIcon } from "@/components/game/icons";
import { CAST, CharacterTile } from "@/components/game/characters";
import { SiteFooter } from "@/components/game/site-footer";
import { TRAILS } from "@/game/trails";
import Github from "@/assets/icons/github";
import { cn } from "@/lib/utils";

const STEPS = [
  { title: "Escolha uma trilha", text: "Cada trilha é uma soft skill: inteligência emocional, liderança, motivação ou criatividade." },
  { title: "Responda às situações", text: "São cenas do dia a dia de trabalho. Escolha o que você faria. Não existe resposta errada." },
  { title: "Descubra seu perfil", text: "No fim você ganha uma insígnia com o seu perfil e pode receber o relatório completo por e-mail." },
];

const REWARDS = [
  { icon: BoltIcon, title: "XP", text: "Cada situação respondida pela primeira vez vale 10 XP. Concluir a trilha vale mais 50." },
  { icon: FlameIcon, title: "Sequência", text: "Responda pelo menos uma situação por dia para manter o fogo aceso." },
  { icon: MedalIcon, title: "Insígnias", text: "Primeiro passo, uma por trilha concluída, constância e mais." },
  { icon: TrophyIcon, title: "Níveis", text: "A cada 100 XP você sobe um nível." },
];

export default function AboutContent() {
  return (
    <Shell>
      <header className="mb-8">
        <p className="text-xs font-black uppercase tracking-[.12em] text-pop">Sobre</p>
        <h1 className="mt-1 font-display text-3xl font-bold leading-tight md:text-4xl">Soft Skills Academy</h1>
        <p className="mt-2 max-w-prose font-semibold text-soft">
          Autoavaliação de habilidades comportamentais em formato de jogo: trilhas curtas, situações reais e um perfil no final. Feito por voluntários da Faculdade de Tecnologia e Inovação Senac DF.
        </p>
      </header>

      <section aria-labelledby="como" className="mb-10">
        <h2 id="como" className="mb-4 font-display text-xl font-semibold">Como funciona</h2>
        <ol className="grid auto-rows-fr gap-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="grid animate-fade-up grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-x-4 rounded-2xl border-2 border-rule px-5 py-4 shadow-[0_4px_0_var(--rule)] min-h-[112px]" style={{ animationDelay: `${i * 70}ms` }}>
              <span className="grid size-10 place-items-center rounded-full bg-brand font-display text-lg font-semibold text-purple-50 shadow-[0_3px_0_var(--color-brand-700)]">{i + 1}</span>
              <div className="min-w-0 pt-0.5">
                <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                <p className="line-clamp-3 text-sm font-semibold text-soft">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="turma" className="mb-10">
        <h2 id="turma" className="mb-1 font-display text-xl font-semibold">A turma</h2>
        <p className="mb-4 text-sm font-semibold text-soft">A Duda narra as situações. O resto da turma chega em breve.</p>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CAST.map((m, i) => (
            <li key={m.id} className="animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
              <CharacterTile member={m} />
              <p className={cn("mt-2 font-display font-semibold leading-tight", !m.Avatar && "text-soft")}>{m.name}</p>
              <p className="text-xs font-black uppercase tracking-wider text-soft">{m.role}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="trilhas" className="mb-10">
        <h2 id="trilhas" className="mb-4 font-display text-xl font-semibold">As trilhas</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {TRAILS.map((t) => (
            <Link
              key={t.slug}
              href={`/trilha/${t.slug}`}
              className={cn("group flex h-40 flex-col items-center justify-center gap-2 rounded-2xl p-4 text-center text-night", TRAIL_STYLE[t.color].card, TRAIL_STYLE[t.color].shadow)}
            >
              <TrailEmblem slug={t.slug} className="size-12 transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:rotate-[-8deg] group-hover:scale-110" />
              <span className="line-clamp-2 font-display font-semibold leading-tight">{t.title}</span>
              <span className="text-xs font-bold opacity-80">{t.questions.length} situações</span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="recompensas" className="mb-10">
        <h2 id="recompensas" className="mb-4 font-display text-xl font-semibold">Recompensas</h2>
        <ul className="grid auto-rows-fr gap-3 sm:grid-cols-2">
          {REWARDS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="group grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-x-4 rounded-2xl bg-panel px-5 py-4 min-h-[112px]">
              <Icon className="size-10 transition-transform duration-500 ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:-translate-y-1" />
              <div className="min-w-0 pt-0.5">
                <h3 className="font-display text-lg font-semibold">{title}</h3>
                <p className="line-clamp-3 text-sm font-semibold text-soft">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="acesso" className="mb-10">
        <h2 id="acesso" className="mb-4 font-display text-xl font-semibold">Acessibilidade e privacidade</h2>
        <ul className="space-y-3">
          <li className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-x-4">
            <SoundIcon className="size-9" />
            <p className="pt-1 font-semibold"><b className="font-extrabold">Leitura em voz alta.</b> <span className="text-soft">Toque no alto-falante para ouvir a pergunta, ou ligue a leitura automática dentro do desafio.</span></p>
          </li>
          <li className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-x-4">
            <ThemeToggle className="bg-panel text-ink" />
            <p className="pt-1 font-semibold"><b className="font-extrabold">Tema claro e escuro.</b> <span className="text-soft">Segue o seu sistema; toque no ícone para trocar.</span></p>
          </li>
          <li className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-x-4">
            <CheckIcon className="size-9" />
            <p className="pt-1 font-semibold"><b className="font-extrabold">Seus dados ficam com você.</b> <span className="text-soft">O progresso é salvo só neste aparelho. Nada é enviado, a não ser o relatório por e-mail, se você pedir. <Link href="/privacidade" className="font-extrabold text-pop hover:underline">Política de privacidade</Link></span></p>
          </li>
        </ul>
      </section>

      <SiteFooter>
        <a
          href="https://github.com/senac-volunteers/soft-skills-app"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border-2 border-rule px-3 py-1.5 font-extrabold text-ink transition-colors hover:bg-panel"
        >
          <Github className="size-4" /> Código no GitHub
        </a>
      </SiteFooter>
    </Shell>
  );
}
