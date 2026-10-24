/**
 * Animação da troca de tema: um círculo na cor do tema novo cresce a partir do botão e, enquanto cobre a tela,
 * o astro que sai desce em arco e o que entra sobe (sol ↔ lua), com estrelas surgindo à noite.
 * Tudo anima só transform e opacity (roda na GPU), então segue liso no celular.
 */
type Theme = "light" | "dark";

const SUN = `<svg viewBox="0 0 120 120" width="112" height="112">
  <g class="rays" fill="#FFC83D">${Array.from({ length: 8 }, (_, i) =>
    `<rect x="56" y="4" width="8" height="20" rx="4" transform="rotate(${i * 45} 60 60)"/>`).join("")}</g>
  <circle cx="60" cy="60" r="30" fill="#FFB020"/>
  <circle cx="60" cy="60" r="26" fill="#FFC83D"/>
  <ellipse cx="50" cy="48" rx="8" ry="5" fill="#fff" opacity=".45" transform="rotate(-30 50 48)"/>
</svg>`;

const MOON = `<svg viewBox="0 0 120 120" width="104" height="104">
  <defs><mask id="ts-moon"><rect width="120" height="120" fill="#fff"/><circle cx="80" cy="44" r="30" fill="#000"/></mask></defs>
  <g mask="url(#ts-moon)">
    <circle cx="58" cy="62" r="36" fill="#E6E0FF"/>
    <circle cx="44" cy="74" r="6" fill="#CFC5F7"/><circle cx="56" cy="90" r="4" fill="#CFC5F7"/><circle cx="34" cy="56" r="3.5" fill="#CFC5F7"/>
  </g>
</svg>`;

const star = (s: number) =>
  `<svg viewBox="-10 -10 20 20" width="${s}" height="${s}"><path d="M0 -10 Q1.6 -1.6 10 0 Q1.6 1.6 0 10 Q-1.6 1.6 -10 0 Q-1.6 -1.6 0 -10Z" fill="#FFE28A"/></svg>`;

// Posição das estrelas em relação ao centro do céu (px) e tamanho.
const STARS: [number, number, number][] = [[-150, -70, 18], [130, -110, 14], [170, 10, 20], [-110, 40, 12], [60, -170, 12], [-60, -150, 16], [210, -60, 10]];
// Brilhos em volta do sol de manhã.
const SPARKS: [number, number, number][] = [[-120, -90, 14], [120, -80, 12], [140, 30, 10], [-140, 20, 10]];

const EASE_IN = "cubic-bezier(.55,0,.75,.4)";
const EASE_BACK = "cubic-bezier(.22,1.25,.36,1)";

export function playThemeSwap(origin: { x: number; y: number }, next: Theme, apply: () => void) {
  if (document.querySelector("[data-theme-disc]")) return; // já tem uma troca em andamento
  const { x, y } = origin;
  const radius = Math.ceil(Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)));

  const disc = document.createElement("div");
  disc.dataset.theme = next; // pega as variáveis do tema novo: bg-canvas já é a cor certa
  disc.setAttribute("data-theme-disc", "");
  disc.setAttribute("aria-hidden", "true");
  disc.className = "pointer-events-none fixed z-100 rounded-full bg-canvas";
  Object.assign(disc.style, {
    left: `${x - radius}px`, top: `${y - radius}px`, width: `${radius * 2}px`, height: `${radius * 2}px`,
    transform: "scale(0)", willChange: "transform, opacity",
  });

  // Céu: o arco gira em torno de um ponto abaixo do centro, então o astro desce/sobe em curva.
  const sky = document.createElement("div");
  sky.setAttribute("aria-hidden", "true");
  sky.className = "pointer-events-none fixed inset-0 z-101 opacity-0";
  const orbit = (svg: string) =>
    `<div class="orbit" style="position:absolute;left:50%;top:42%;width:0;height:0;transform-origin:0 240px;will-change:transform,opacity">
       <div style="position:absolute;transform:translate(-50%,-50%)">${svg}</div></div>`;
  const out = next === "dark" ? SUN : MOON;
  const inn = next === "dark" ? MOON : SUN;
  const extras = (next === "dark" ? STARS : SPARKS)
    .map(([dx, dy, s]) => `<div class="star" style="position:absolute;left:calc(50% + ${dx}px);top:calc(42% + ${dy}px);transform:scale(0);will-change:transform,opacity">${star(s)}</div>`)
    .join("");
  sky.innerHTML = orbit(out) + orbit(inn) + extras;
  document.body.append(disc, sky);

  const [outEl, inEl] = Array.from(sky.querySelectorAll<HTMLElement>(".orbit"));
  const opts = (delay: number, duration: number, easing = "ease-out") => ({ delay, duration, easing, fill: "both" as const });

  disc.animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], opts(0, 440, "cubic-bezier(.65,0,.35,1)")).onfinish = apply;
  sky.animate([{ opacity: 0 }, { opacity: 1 }], opts(160, 200));
  // Sai: desce em arco para a direita. Entra: sobe da esquerda com um leve passar do ponto.
  outEl.animate([{ transform: "rotate(0)", opacity: 1 }, { transform: "rotate(70deg)", opacity: 0 }], opts(160, 620, EASE_IN));
  inEl.animate([{ transform: "rotate(-70deg)", opacity: 0 }, { transform: "rotate(0)", opacity: 1 }], opts(380, 760, EASE_BACK));
  sky.querySelectorAll<HTMLElement>(".rays").forEach((r) => {
    r.style.transformOrigin = "60px 60px";
    r.animate([{ transform: "rotate(0)" }, { transform: "rotate(90deg)" }], { duration: 1800, easing: "linear", iterations: Infinity });
  });
  sky.querySelectorAll<HTMLElement>(".star").forEach((s, i) => {
    s.animate(
      [{ transform: "scale(0) rotate(-45deg)", opacity: 0 }, { transform: "scale(1.25) rotate(0)", opacity: 1, offset: 0.6 }, { transform: "scale(1)", opacity: 1 }],
      opts(560 + i * 70, 420, "ease-out"),
    );
  });

  // Tudo some junto e sai do DOM.
  // fill "forwards" (não "both"): antes do atraso ela não pode sobrepor a entrada do céu.
  const fadeOut = (el: HTMLElement) =>
    el.animate([{ opacity: 1 }, { opacity: 0 }], { delay: 1200, duration: 300, easing: "ease-out", fill: "forwards" });
  fadeOut(sky);
  fadeOut(disc).onfinish = () => {
    disc.remove();
    sky.remove();
  };
}
