"use client";
import { useState } from "react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, FileText, MessagesSquare, RotateCcw, Sparkles } from "lucide-react";
import { Shell } from "@/components/game/shell";
import { TrailHero } from "@/components/game/trail-card";
import StageNode from "@/components/game/stage-node";
import { ConfirmDialog } from "@/components/game/confirm-dialog";
import { getTrail } from "@/game/trails";
import { answeredCount, useGame } from "@/game/store";

export default function TrailPage() {
  const { slug } = useParams<{ slug: string }>();
  const trail = getTrail(slug);
  const router = useRouter();
  const { progressOf, restart } = useGame();
  const [confirming, setConfirming] = useState(false);
  if (!trail) notFound();

  const p = progressOf(trail.slug);
  const unlocked = p.completions > 0;
  const inProgress = answeredCount(p) > 0 && !p.completed;

  return (
    <Shell>
      <Link href="/" className="mb-3 inline-flex items-center gap-1 text-sm font-extrabold text-pop hover:underline">
        <ArrowLeft className="size-4" /> Trilhas
      </Link>
      <TrailHero trail={trail} />

      <section className="relative mt-10 grid grid-cols-2 gap-y-6" aria-label="Etapas da trilha">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M50 20 L22 72 M50 20 L78 72" className="stroke-rule" strokeWidth="2" strokeDasharray="4 5" strokeLinecap="round" fill="none" vectorEffect="non-scaling-stroke" />
        </svg>
        <StageNode
          className="relative col-span-2"
          href={`/trilha/${trail.slug}/caminho`}
          state={p.completed ? "done" : "current"}
          icon={<MessagesSquare className="size-10" />}
          label="1 · Desafio"
          sublabel={p.completed ? "Concluído" : inProgress ? "Continuar" : `${trail.questions.length} situações`}
        />
        <StageNode
          className="relative"
          href={`/trilha/${trail.slug}/resultado`}
          state={unlocked ? "open" : "locked"}
          size="md"
          icon={<Sparkles className="size-9" />}
          label="2 · Seu perfil"
          sublabel={unlocked ? "Ver insígnia" : "Conclua o desafio"}
        />
        <StageNode
          className="relative"
          href={`/autoavaliacao/${trail.slug}/resultados`}
          state={unlocked ? "open" : "locked"}
          size="md"
          icon={<FileText className="size-9" />}
          label="3 · Relatório"
          sublabel={unlocked ? "Detalhes e e-mail" : "Conclua o desafio"}
        />
      </section>

      <div className="mt-10 space-y-3">
        {trail.courseUrl && (
          <a
            href={trail.courseUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-2xl border-2 border-rule px-4 py-3 font-extrabold text-ink shadow-[0_4px_0_var(--rule)] transition-colors hover:bg-panel"
          >
            Curso gratuito de Inteligência Emocional
            <ExternalLink className="size-4 text-pop" />
          </a>
        )}
        {/* Recomeçar apaga as respostas desta trilha (insígnias e XP já ganhos ficam): pede confirmação e abre o desafio. */}
        {answeredCount(p) > 0 && (
          <button type="button" onClick={() => setConfirming(true)} className="btn-3d ghost w-full">
            <RotateCcw className="size-4" /> {p.completed ? "Refazer desafio" : "Recomeçar do zero"}
          </button>
        )}
        <ConfirmDialog
          open={confirming}
          icon={<RotateCcw className="size-8" strokeWidth={2.5} />}
          title="Recomeçar a trilha?"
          description="Suas respostas desta trilha serão apagadas. XP e insígnias que você já ganhou continuam."
          confirmLabel="Recomeçar"
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            restart(trail.slug);
            router.push(`/trilha/${trail.slug}/desafio`);
          }}
        />
      </div>
    </Shell>
  );
}
