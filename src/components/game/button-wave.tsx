"use client";
import { useEffect } from "react";

/** Liga a onda de clique em todo .btn-3d da página: reinicia a animação a cada toque. */
export function ButtonWave() {
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const btn = (e.target as Element | null)?.closest<HTMLElement>(".btn-3d");
      if (!btn || btn.matches(":disabled")) return;
      btn.classList.remove("wave");
      void btn.offsetWidth; // força o reflow para a animação recomeçar
      btn.classList.add("wave");
    };
    const onEnd = (e: AnimationEvent) => {
      if (e.animationName === "btn-wave") (e.target as Element).classList.remove("wave");
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("animationend", onEnd);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("animationend", onEnd);
    };
  }, []);
  return null;
}
