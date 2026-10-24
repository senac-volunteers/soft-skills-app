"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

/**
 * Popup de confirmação centralizado, no estilo do site. Fecha com Esc, clique fora ou Cancelar.
 * Vai por portal para o body: o main tem transform na entrada, o que prenderia o "fixed" à coluna.
 */
export function ConfirmDialog({ open, icon, title, description, confirmLabel, cancelLabel = "Cancelar", tone = "danger", onConfirm, onCancel }: {
  open: boolean;
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const cancelButton = useRef<HTMLButtonElement>(null);
  // onCancel costuma vir como função nova a cada render: guardar em ref evita refazer o efeito (e roubar o foco).
  const cancelRef = useRef(onCancel);
  cancelRef.current = onCancel;
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    cancelButton.current?.focus(); // ação destrutiva: o foco começa no "Cancelar"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cancelRef.current();
    window.addEventListener("keydown", onKey);
    // Trava a rolagem da página por baixo do popup.
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [open]);

  if (!mounted || !open) return null;
  return createPortal(
    <div className="fixed inset-0 z-80 grid animate-[fade-in_.2s_ease-out_both] place-items-center bg-night/60 p-4" onClick={onCancel}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby={description ? "confirm-desc" : undefined}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm animate-pop rounded-[28px] border-2 border-rule bg-canvas p-6 text-center text-ink shadow-[0_8px_0_var(--rule)]"
      >
        {icon && (
          <div className={cn("mx-auto mb-4 grid size-16 place-items-center rounded-full", tone === "danger" ? "bg-coral-100 text-coral-600" : "bg-brand-100 text-brand-700")}>
            {icon}
          </div>
        )}
        <h2 id="confirm-title" className="font-display text-2xl font-semibold leading-tight">
          {title}
        </h2>
        {description && (
          <p id="confirm-desc" className="mt-2 font-semibold text-soft">
            {description}
          </p>
        )}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={onConfirm} className={cn("btn-3d sm:order-2", tone === "danger" && "coral")}>
            {confirmLabel}
          </button>
          <button ref={cancelButton} type="button" onClick={onCancel} className="btn-3d ghost sm:order-1">
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
