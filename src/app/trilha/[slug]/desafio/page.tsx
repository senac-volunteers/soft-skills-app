"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { Volume2, VolumeX, X } from "lucide-react";
import { ProgressBar } from "@/components/game/shell";
import {
  BoltIcon,
  FlameIcon,
  MedalIcon,
  SoundIcon,
} from "@/components/game/icons";
import { Narrator } from "@/components/game/characters";
import {
  Celebration,
  type CelebrationProps,
} from "@/components/game/animation/celebration";
import { computeResult } from "@/game/scoring";
import { getTrail } from "@/game/trails";
import {
  answeredCount,
  BADGES,
  useGame,
  type TrailProgress,
} from "@/game/store";
import { useSpeech } from "@/game/use-speech";
import { cn } from "@/lib/utils";

const CHEERS = [
  "Boa escolha!",
  "Resposta registrada!",
  "Mandou bem!",
  "Anotado!",
  "Isso aí!",
];

export default function ChallengePage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const trail = getTrail(slug);
  const { ready, progressOf, answer, state, toggleVoice } = useGame();
  const { supported, speaking, speak, stop } = useSpeech();

  const [index, setIndex] = useState<number | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    xp: number;
    cheer: string;
    finished: boolean;
    badges: string[];
    level?: number;
  } | null>(null);
  // Cerimônia (insígnia caindo) ao concluir a trilha ou subir de nível, antes de seguir.
  const [celebration, setCelebration] = useState<CelebrationProps | null>(null);

  if (!trail) notFound();
  const total = trail.questions.length;

  // Retoma de onde parou.
  useEffect(() => {
    if (!ready || index !== null) return;
    const p = progressOf(trail.slug);
    if (p.completed) {
      router.replace(`/trilha/${trail.slug}/resultado`);
      return;
    }
    const first = p.answers.findIndex((a) => a === null);
    setIndex(first < 0 ? 0 : first);
  }, [ready, index, progressOf, trail.slug, router]);

  const question = index !== null ? trail.questions[index] : null;
  const narration = question
    ? [question.prompt, question.statement].filter(Boolean).join(" ")
    : "";

  // Leitura automática da pergunta quando a voz está ligada.
  useEffect(() => {
    if (question && state.voice) speak(narration, "q");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question?.id, state.voice]);

  // Atalhos: números escolhem a resposta, Enter confirma (ou continua depois do feedback).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!question || celebration || e.metaKey || e.ctrlKey || e.altKey)
        return;
      const target = e.target instanceof Element ? e.target : null;
      if (target?.closest("input, textarea, [contenteditable]")) return;
      const n = Number(e.key);
      if (!feedback && n >= 1 && n <= question.options.length) {
        e.preventDefault();
        choose(question.options[n - 1].key);
      } else if (e.key === "Enter" && !(target instanceof HTMLButtonElement)) {
        e.preventDefault();
        if (feedback) next();
        else confirm();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!question || index === null) {
    return (
      <div className="grid min-h-dvh place-items-center bg-canvas font-bold text-pop">
        Carregando…
      </div>
    );
  }

  const selectedOption =
    question.options.find((o) => o.key === selected) ?? null;
  const done = answeredCount(progressOf(trail.slug));

  function choose(key: string) {
    if (feedback) return;
    setSelected(key);
    const opt = question!.options.find((o) => o.key === key)!;
    if (state.voice) speak(opt.text, key);
  }

  function confirm() {
    if (!selectedOption) return;
    stop();
    const levelBefore = Math.floor(state.xp / 100) + 1;
    const r = answer(trail!.slug, index!, selectedOption.value);
    const levelAfter = Math.floor((state.xp + r.xpGained) / 100) + 1;
    setFeedback({
      xp: r.xpGained,
      cheer: CHEERS[index! % CHEERS.length],
      finished: r.finished,
      badges: r.newBadges,
      level: levelAfter > levelBefore ? levelAfter : undefined,
    });
  }

  function next() {
    if (!feedback) return;
    if (feedback.finished) {
      const p: TrailProgress = progressOf(trail!.slug);
      const result = computeResult(trail!, p.answers as (string | number)[]);
      setCelebration({
        kind: "trail",
        emoji: result.emoji,
        eyebrow: "Trilha concluída!",
        title: result.title,
        subtitle: feedback.level
          ? `${result.heading} · e você subiu para o nível ${feedback.level}!`
          : result.heading,
        xp: feedback.xp,
        cta: "Ver meu perfil",
        onContinue: () => router.push(`/trilha/${trail!.slug}/resultado`),
      });
      return;
    }
    if (feedback.level) {
      setCelebration({
        kind: "level",
        level: feedback.level,
        eyebrow: "Subiu de nível!",
        title: `Nível ${feedback.level}`,
        subtitle: "Continue respondendo para ganhar mais XP.",
        cta: "Continuar",
        onContinue: () => {
          setCelebration(null);
          advance();
        },
      });
      return;
    }
    advance();
  }

  function advance() {
    const p = progressOf(trail!.slug);
    const nextIndex = p.answers.findIndex((a) => a === null);
    setFeedback(null);
    setSelected(null);
    setIndex(nextIndex < 0 ? Math.min(index! + 1, total - 1) : nextIndex);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-ink">
      {/* Cabeçalho: sair (o progresso fica salvo), barra de progresso, sequência e voz */}
      <header className="mx-auto flex h-16 w-full max-w-xl items-center gap-3 px-4 sm:px-6 lg:h-20 lg:max-w-5xl lg:gap-5">
        <Link
          href={`/trilha/${trail.slug}/caminho`}
          aria-label="Sair (seu progresso fica salvo)"
          className="grid size-9 shrink-0 place-items-center rounded-full text-soft transition-colors hover:bg-panel hover:text-ink"
          onClick={stop}
        >
          <X className="size-6" />
        </Link>
        <ProgressBar value={done} max={total} />
        <span
          className="flex h-9 shrink-0 items-center gap-1.5 font-display text-base font-semibold leading-none tabular-nums text-coral-600 dark:text-coral"
          aria-label={`Sequência de ${state.streak.count} dias`}
        >
          <FlameIcon className="size-6" />
          {state.streak.count}
        </span>
        <button
          type="button"
          onClick={() => {
            if (state.voice) stop();
            toggleVoice();
          }}
          aria-pressed={state.voice}
          aria-label={
            state.voice
              ? "Desligar leitura automática por voz"
              : "Ligar leitura automática por voz"
          }
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-full border-2 transition-colors",
            state.voice
              ? "border-sea bg-sea text-night"
              : "border-rule text-soft"
          )}
          disabled={!supported}
        >
          {state.voice ? (
            <Volume2 className="size-5" />
          ) : (
            <VolumeX className="size-5" />
          )}
        </button>
      </header>

      {/* Cada pergunta entra deslizando da direita */}
      {/* No computador: situação e narrador à esquerda, respostas à direita, centralizados na altura. */}
      <main
        key={question.id}
        className="mx-auto w-full max-w-xl flex-1 animate-slide-in px-4 pb-40 sm:px-6 lg:grid lg:max-w-5xl lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:content-center lg:items-center lg:gap-16 lg:pb-36"
      >
        <div>
          <p className="mb-2 mt-3 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-pop lg:mt-0">
            <span className="hidden lg:inline">{trail.title} ·</span> Situação{" "}
            {index + 1} de {total}
          </p>
          <h1 className="font-display text-2xl font-semibold leading-tight lg:text-3xl">
            {question.prompt}
          </h1>

          {/* O narrador apresenta a situação; o avatar anima a fala durante a leitura em voz. */}
          <Narrator talking={speaking === "q"} stack className="mt-4 lg:mt-6">
            <div className="flex items-start gap-3" aria-live="polite">
              <p className="min-w-0 flex-1 font-bold leading-snug">
                {question.statement
                  ? `“${question.statement}”`
                  : "Escolha a resposta que mais combina com você. Não existe resposta errada."}
              </p>
              <button
                type="button"
                onClick={() => speak(narration, "q")}
                aria-label="Ouvir a pergunta"
                className={cn(
                  "shrink-0 transition-transform hover:scale-110",
                  speaking === "q" && "speaking"
                )}
              >
                <SoundIcon className="size-8" />
              </button>
            </div>
          </Narrator>
        </div>

        <section
          role="radiogroup"
          aria-label="Respostas"
          className="mt-6 space-y-3 lg:mt-0"
        >
          {question.options.map((opt, i) => {
            const isSel = opt.key === selected;
            return (
              <button
                key={opt.key}
                type="button"
                role="radio"
                aria-checked={isSel}
                onClick={() => choose(opt.key)}
                className="answer-card flex min-h-17 animate-fade-up items-center gap-3"
                style={{ animationDelay: `${80 + i * 50}ms` }}
              >
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-lg border-2 font-display text-sm font-semibold transition-colors",
                    isSel
                      ? "border-sea-700 bg-sea text-night"
                      : "border-rule text-soft"
                  )}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="leading-snug">{opt.text}</span>
              </button>
            );
          })}
        </section>
      </main>

      {celebration && <Celebration {...celebration} />}

      {/* Rodapé: confirmar, depois o painel de feedback sobe */}
      <footer className="fixed inset-x-0 bottom-0 z-30 pb-[env(safe-area-inset-bottom)]">
        {feedback ? (
          <div className="animate-slide-up border-t-2 border-brand/30 bg-brand-100 text-brand-700 dark:bg-blue-800 dark:text-blue-100">
            <div className="mx-auto max-w-xl px-4 pb-6 pt-4 sm:px-6 lg:flex lg:max-w-5xl lg:items-center lg:justify-between lg:gap-8 lg:py-6">
              <div className="mb-4 flex items-center gap-3 lg:mb-0">
                <span className="fire grid size-14 shrink-0 place-items-center">
                  <BoltIcon className="size-12" />
                </span>
                <div>
                  <p className="font-display text-2xl font-semibold">
                    {feedback.cheer}
                  </p>
                  <p className="text-sm font-extrabold">
                    {feedback.xp > 0
                      ? `+${feedback.xp} XP`
                      : "Não existe resposta certa ou errada"}
                  </p>
                  {feedback.badges.map((b) => {
                    const badge = BADGES.find((x) => x.id === b);
                    return badge ? (
                      <p
                        key={b}
                        className="flex animate-pop items-center gap-1 text-sm font-extrabold"
                      >
                        <MedalIcon className="size-5" /> Nova insígnia:{" "}
                        {badge.title}
                      </p>
                    ) : null;
                  })}
                </div>
              </div>
              <button
                autoFocus
                onClick={next}
                className="btn-3d sun w-full lg:w-64"
              >
                {feedback.finished ? "Ver meu perfil" : "Continuar"}
              </button>
            </div>
          </div>
        ) : (
          <div className="border-t-2 border-rule bg-canvas">
            <div className="mx-auto max-w-xl px-4 pb-6 pt-4 sm:px-6 lg:flex lg:max-w-5xl lg:items-center lg:justify-between lg:gap-8 lg:py-6">
              {/* Atalhos só fazem sentido com teclado: a dica aparece no computador. */}
              <p className="hidden text-sm font-bold text-soft lg:block">
                Teclas <Kbd>1</Kbd>–<Kbd>{question.options.length}</Kbd> para
                escolher · <Kbd>Enter</Kbd> para confirmar
              </p>
              <button
                onClick={confirm}
                disabled={!selectedOption}
                className="btn-3d w-full lg:w-64"
              >
                {selectedOption ? "Confirmar" : "Escolha uma resposta"}
              </button>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="mx-0.5 rounded-md border-2 border-b-4 border-rule px-1.5 py-0.5 font-display text-xs font-semibold text-ink">
      {children}
    </kbd>
  );
}
