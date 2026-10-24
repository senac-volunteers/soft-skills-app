"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, Check, Lock, Play } from "lucide-react";
import { Shell } from "@/components/game/shell";
import { TRAIL_STYLE } from "@/components/game/trail-card";
import { TrailEmblem, TrophyIcon } from "@/components/game/icons";
import { getTrail } from "@/game/trails";
import { answeredCount, useGame } from "@/game/store";
import { cn } from "@/lib/utils";

// Deslocamento horizontal (px) que forma o caminho sinuoso.
const OFFSETS = [0, 46, 70, 46, 0, -46, -70, -46];

export default function PathPage() {
  const { slug } = useParams<{ slug: string }>();
  const trail = getTrail(slug);
  const { progressOf, ready } = useGame();
  const bannerRef = useRef<HTMLElement>(null);
  const [bannerHidden, setBannerHidden] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setBannerHidden(!entry.isIntersecting),
      { rootMargin: "-64px 0px 0px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  if (!trail) notFound();

  const p = progressOf(trail.slug);
  const done = answeredCount(p);
  const total = trail.questions.length;
  const currentIndex = p.completed
    ? -1
    : p.answers.findIndex((a) => a === null);
  const style = TRAIL_STYLE[trail.color];
  const cta = {
    href: `/trilha/${trail.slug}/${p.completed ? "resultado" : "desafio"}`,
    label: p.completed ? "Ver perfil" : done > 0 ? "Continuar" : "Começar",
  };

  return (
    <Shell>
      <Link
        href={`/trilha/${trail.slug}`}
        className="mb-3 inline-flex items-center gap-1 text-sm font-extrabold text-pop hover:underline"
      >
        <ArrowLeft className="size-4" /> {trail.title}
      </Link>

      {/* O banner só informa; o "Começar" fica no nó atual do caminho, sem botão repetido. */}
      <section
        ref={bannerRef}
        className={cn(
          "flex items-center justify-between gap-4 rounded-[28px] px-5 py-4 text-night",
          style.card,
          style.shadow,
        )}
      >
        <div className="min-w-0">
          <p
            className={cn(
              "text-xs font-black uppercase tracking-wider",
              style.strong,
            )}
          >
            Etapa 1 · Desafio
          </p>
          <h1 className="font-display text-xl font-semibold leading-tight">
            {trail.title}
          </h1>
          <p className="text-sm font-bold opacity-80">
            {done}/{total} situações
          </p>
        </div>
        <TrailEmblem slug={trail.slug} className="size-14 shrink-0" />
      </section>

      {/* Quando o banner sai da tela, vira uma aba discreta presa na lateral direita.
          Vai por portal para o body: o main tem transform na entrada, o que prenderia o "fixed" à coluna. */}
      {mounted &&
        createPortal(
          <Link
            href={cta.href}
            aria-label={`${cta.label}: ${done} de ${total} situações`}
            aria-hidden={!bannerHidden}
            tabIndex={bannerHidden ? 0 : -1}
            className={cn(
              "group fixed right-0 top-1/2 z-30 flex -translate-y-1/2 origin-right flex-col items-center gap-1 rounded-l-2xl border-2 border-r-0 border-rule bg-canvas py-2.5 pl-2 pr-1.5 shadow-[-4px_4px_0_var(--rule)] transition-[transform,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
              bannerHidden
                ? "translate-x-0 opacity-100"
                : "pointer-events-none scale-75 opacity-0",
            )}
          >
            <span
              className="grid size-10 place-items-center rounded-full p-[3px]"
              style={{
                background: `conic-gradient(var(--color-orange-500) ${(done / total) * 360}deg, var(--panel2) 0)`,
              }}
            >
              <span className="grid size-full place-items-center rounded-full bg-canvas">
                {p.completed ? (
                  <Check className="size-5 text-pop" strokeWidth={3} />
                ) : (
                  <Play className="size-4 translate-x-px fill-current text-pop transition-transform duration-300 group-hover:scale-125" />
                )}
              </span>
            </span>
            <span className="font-display text-xs font-semibold tabular-nums text-soft">
              {done}/{total}
            </span>
          </Link>,
          document.body,
        )}

      <ol
        className="relative mt-12 flex flex-col items-center gap-5 pb-6"
        aria-label="Caminho de perguntas"
      >
        {trail.questions.map((q, i) => {
          const state = !ready
            ? "locked"
            : p.completed || p.answers[i] !== null
              ? "done"
              : i === currentIndex
                ? "current"
                : "locked";
          const x = OFFSETS[i % OFFSETS.length];
          // Emblema da trilha decora o caminho de quatro em quatro nós, do lado oposto à curva.
          const showDecor = i % 4 === 1;
          const decorSide =
            x > 0 ? "right-[calc(50%+56px)]" : "left-[calc(50%+56px)]";

          const node = (
            <span
              className={cn(
                "relative grid size-[76px] place-items-center rounded-full border-[6px] bg-canvas p-1 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
                state === "current"
                  ? "animate-pulse-ring border-sun hover:-translate-y-1"
                  : "border-rule",
              )}
            >
              <span
                className={cn(
                  "grid size-full place-items-center rounded-full shadow-[inset_0_-5px_0_rgba(0,0,0,.1)]",
                  state === "locked"
                    ? "bg-panel2 text-soft"
                    : state === "done"
                      ? "bg-brand text-white"
                      : "bg-brand-100 text-brand-700",
                )}
              >
                {state === "done" ? (
                  <Check className="size-7" strokeWidth={3} />
                ) : state === "current" ? (
                  <Play className="size-7 fill-current" />
                ) : (
                  <Lock className="size-5" />
                )}
              </span>
            </span>
          );

          return (
            <li
              key={q.id}
              className="relative flex w-full animate-fade-up justify-center"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div
                style={{ transform: `translateX(${x}px)` }}
                className="relative"
              >
                {state === "current" ? (
                  <Link
                    href={`/trilha/${trail.slug}/desafio`}
                    aria-label={`Pergunta ${i + 1}: começar`}
                  >
                    {node}
                  </Link>
                ) : (
                  <span
                    aria-label={`Pergunta ${i + 1}: ${state === "done" ? "respondida" : "bloqueada"}`}
                  >
                    {node}
                  </span>
                )}
              </div>
              {showDecor && (
                <div
                  className={cn("absolute top-1 opacity-90", decorSide)}
                  aria-hidden="true"
                >
                  <TrailEmblem
                    slug={trail.slug}
                    className="size-16 animate-float"
                  />
                </div>
              )}
            </li>
          );
        })}
        <li className="mt-2" aria-label="Troféu da trilha">
          <TrophyIcon className="size-20" />
        </li>
      </ol>
    </Shell>
  );
}
