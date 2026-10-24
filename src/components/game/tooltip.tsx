import { cn } from "@/lib/utils";

type Side = "bottom" | "top" | "left";
type Align = "center" | "start" | "end";

const PLACE: Record<Side, Record<Align, string>> = {
  bottom: { center: "top-full left-1/2 mt-2 -translate-x-1/2", start: "top-full left-0 mt-2", end: "top-full right-0 mt-2" },
  top: { center: "bottom-full left-1/2 mb-2 -translate-x-1/2", start: "bottom-full left-0 mb-2", end: "bottom-full right-0 mb-2" },
  left: { center: "right-full top-1/2 mr-3 -translate-y-1/2", start: "right-full top-0 mr-3", end: "right-full bottom-0 mr-3" },
};
const ARROW: Record<Side, Record<Align, string>> = {
  bottom: { center: "-top-1 left-1/2 -translate-x-1/2", start: "-top-1 left-4", end: "-top-1 right-4" },
  top: { center: "-bottom-1 left-1/2 -translate-x-1/2", start: "-bottom-1 left-4", end: "-bottom-1 right-4" },
  left: { center: "-right-1 top-1/2 -translate-y-1/2", start: "-right-1 top-3", end: "-right-1 bottom-3" },
};

/**
 * Dica no estilo do site (no lugar do title nativo do navegador): aparece no hover e no foco do teclado/toque,
 * com as cores invertidas do tema. Quem usa leitor de tela recebe o texto pelo aria-label do próprio elemento.
 */
export function Tooltip({ text, side = "bottom", align = "center", className, children }: {
  text: React.ReactNode;
  side?: Side;
  align?: Align;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={cn("group/tip relative inline-flex", className)}>
      {children}
      <span
        role="presentation"
        className={cn(
          "pointer-events-none absolute z-50 w-max max-w-[16rem] scale-95 rounded-xl bg-ink px-3 py-1.5 text-left font-sans text-xs font-bold normal-case leading-snug tracking-normal text-canvas opacity-0 shadow-[0_4px_0_rgb(0_0_0/.15)] transition duration-200 ease-out",
          "group-hover/tip:scale-100 group-hover/tip:opacity-100 group-hover/tip:delay-150 group-focus-within/tip:scale-100 group-focus-within/tip:opacity-100",
          PLACE[side][align],
        )}
      >
        <span className={cn("absolute size-2.5 rotate-45 rounded-[2px] bg-ink", ARROW[side][align])} />
        <span className="relative">{text}</span>
      </span>
    </span>
  );
}
