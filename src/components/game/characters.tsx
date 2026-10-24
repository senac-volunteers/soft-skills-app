"use client";
import { cn } from "@/lib/utils";
import { DudaAvatar } from "./duda-avatar";

export interface CastMember {
  id: string;
  name: string;
  role: string;
  /** Desenho do personagem; sem ele o cartão mostra a silhueta de "em breve". */
  Avatar?: (props: { talking?: boolean; className?: string }) => JSX.Element;
  tile: string;
}

// Elenco: o primeiro personagem é o narrador; os que ainda não têm desenho aparecem como silhueta.
export const CAST: CastMember[] = [
  { id: "duda", name: "Duda", role: "Narradora", Avatar: DudaAvatar, tile: "bg-[#FFCB80]" },
  { id: "p2", name: "Em breve", role: "Personagem", tile: "bg-panel2" },
  { id: "p3", name: "Em breve", role: "Personagem", tile: "bg-panel2" },
  { id: "p4", name: "Em breve", role: "Personagem", tile: "bg-panel2" },
];
export const NARRATOR = CAST[0];

/** Cartão quadrado com o busto do personagem (ou a silhueta, se ainda não existe). */
export function CharacterTile({ member, className, talking }: { member: CastMember; className?: string; talking?: boolean }) {
  const { Avatar } = member;
  return (
    <div
      role="img"
      aria-label={Avatar ? `${member.name}, ${member.role.toLowerCase()}` : "Personagem em breve"}
      className={cn("relative grid aspect-square items-end overflow-hidden rounded-[22%]", member.tile, className)}
    >
      {Avatar ? (
        <Avatar talking={talking} className="block w-full" />
      ) : (
        // Silhueta de busto: cabeça e ombros num tom acima do fundo.
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full text-rule" aria-hidden="true">
          <rect x="31" y="22" width="38" height="36" rx="11" fill="currentColor" />
          <path d="M18 100 C20 74 32 64 50 64 C68 64 80 74 82 100 Z" fill="currentColor" />
        </svg>
      )}
    </div>
  );
}

/**
 * Narrador: avatar à esquerda e balão de fala com o conteúdo recebido em children.
 * Com `stack`, em telas grandes o avatar cresce e o balão desce para baixo dele.
 */
export function Narrator({ children, talking, stack, className }: { children: React.ReactNode; talking?: boolean; stack?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-end gap-3", stack && "lg:flex-col lg:items-start lg:gap-5", className)}>
      <CharacterTile member={NARRATOR} talking={talking} className={cn("w-20 shrink-0 sm:w-24", stack && "lg:w-44")} />
      <div className={cn("relative mb-2 min-w-0 flex-1 rounded-2xl border-2 border-rule bg-canvas p-4", stack && "lg:mb-0 lg:w-full lg:p-5")}>
        {/* ponta do balão voltada para o avatar */}
        <span
          className={cn(
            "absolute left-[-9px] bottom-5 size-4 rotate-45 border-b-2 border-l-2 border-rule bg-canvas",
            stack && "lg:top-[-9px] lg:bottom-auto lg:left-16 lg:border-b-0 lg:border-t-2",
          )}
          aria-hidden="true"
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
