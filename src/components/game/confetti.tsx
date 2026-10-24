"use client";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

const COLORS = ["#FFC83D", "#4CC2FF", "#7B61FF", "#FF6B6B", "#34D399", "#A08CFF"];

// Confete leve em CSS — sem dependências.
export default function Confetti({ pieces = 60 }: { pieces?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 1.8 + Math.random() * 1.6,
        size: 6 + Math.random() * 6,
        rotate: Math.random() * 360,
        color: COLORS[i % COLORS.length],
        round: i % 3 === 0,
      })),
    [pieces],
  );
  // Vai por portal para o body (o main tem transform, que prenderia o "fixed" à coluna) e sai da tela quando termina.
  const [mounted, setMounted] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setDone(true), 4200);
    return () => clearTimeout(t);
  }, []);
  if (!mounted || done) return null;
  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-95 overflow-hidden motion-reduce:hidden" aria-hidden="true">
      {items.map((p, i) => (
        <span
          key={i}
          className="absolute -top-4 animate-confetti"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.round ? p.size : p.size * 0.5,
            background: p.color,
            borderRadius: p.round ? "9999px" : "2px",
            transform: `rotate(${p.rotate}deg)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>,
    document.body,
  );
}
