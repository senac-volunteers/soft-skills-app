import React, { memo } from "react";

export type EnergizedBrainMood = "idle" | "happy" | "thinking" | "error";

export interface EnergizedBrainMascotProps
  extends React.HTMLAttributes<HTMLDivElement> {
  mood?: EnergizedBrainMood;
  size?: number;
}

/* ==========================================================================
   1. Tokens de Design (Integrados ao tailwind-colors.css) & Geometria
   ========================================================================== */

const COLORS = {
  brainLight: "#ff9eb0",
  brainMain: "#ff7890",
  brainDark: "#d95b72",
  brainOffMain: "var(--color-blue-100, #b0becb)",
  brainOffDark: "var(--color-blue-200, #8a9eb2)",
  energyCore: "var(--color-orange-50, #fff6ec)",
  energyLight: "var(--color-orange-300, #fec580)",
  energyMain: "var(--color-orange-500, #fea842)",
  energyDark: "var(--color-orange-600, #e7993c)",
  synapseCyan: "#38bdf8",
  cheek: "#ff4d6d",
  stroke: "var(--color-blue-800, #001930)",
  shadow: "var(--color-blue-500, #002d58)",
  white: "#ffffff",
} as const;

const MOOD_LABELS: Record<EnergizedBrainMood, string> = {
  idle: "Cérebro energizado disparando sinapses elétricas",
  happy: "Cérebro em sobrecarga máxima de genialidade e energia",
  thinking: "Cérebro processando dados em alta velocidade",
  error: "Cérebro descarregado e sem energia mental",
};

const BASE_CIRCLES = [
  { cx: 62, cy: 118, r: 26 },
  { cx: 138, cy: 118, r: 26 },
  { cx: 82, cy: 128, r: 24 },
  { cx: 118, cy: 128, r: 24 },
  { cx: 54, cy: 92, r: 24 },
  { cx: 146, cy: 92, r: 24 },
];

const BODY_CIRCLES = [
  { cx: 62, cy: 110, r: 26 },
  { cx: 138, cy: 110, r: 26 },
  { cx: 54, cy: 86, r: 24 },
  { cx: 146, cy: 86, r: 24 },
  { cx: 72, cy: 66, r: 25 },
  { cx: 128, cy: 66, r: 25 },
  { cx: 100, cy: 62, r: 24 },
  { cx: 82, cy: 120, r: 24 },
  { cx: 118, cy: 120, r: 24 },
  { cx: 100, cy: 95, r: 35 },
];

const BRAIN_FOLDS = [
  "M100 44 L100 62",
  "M100 132 L100 143",
  "M52 82 C62 78, 70 84, 68 94",
  "M48 110 C58 106, 66 112, 64 122",
  "M76 64 C84 68, 86 76, 80 82",
  "M148 82 C138 78, 130 84, 132 94",
  "M152 110 C142 106, 134 112, 136 122",
  "M124 64 C116 68, 114 76, 120 82",
];

/* ==========================================================================
   2. Subcomponentes Internos e Mapa de Expressões
   ========================================================================== */

interface EyeProps {
  cx: number;
  cy: number;
  r?: number;
  pupilOffset?: { dx: number; dy: number };
}

const Eye: React.FC<EyeProps> = ({
  cx,
  cy,
  r = 8,
  pupilOffset = { dx: -2, dy: -2.5 },
}) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill={COLORS.stroke} />
    {/* Pupila energizada em tom laranja/dourado */}
    <circle
      cx={cx}
      cy={cy}
      r={r * 0.65}
      fill={COLORS.energyMain}
      opacity="0.25"
    />
    <circle
      cx={cx + pupilOffset.dx}
      cy={cy + pupilOffset.dy}
      r={r * 0.38}
      fill={COLORS.white}
    />
    <circle cx={cx + 2.5} cy={cy + 2.5} r={1.6} fill={COLORS.energyCore} />
  </g>
);

const FACE_BY_MOOD: Record<EnergizedBrainMood, React.ReactNode> = {
  idle: (
    <>
      {/* Sobrancelhas confiantes e elétricas */}
      <path
        d="M72 88 L88 92"
        stroke={COLORS.stroke}
        strokeWidth="3.8"
        strokeLinecap="round"
      />
      <path
        d="M128 88 L112 92"
        stroke={COLORS.stroke}
        strokeWidth="3.8"
        strokeLinecap="round"
      />
      <g className="ebrain-eyes-blink">
        <Eye cx={82} cy={101} />
        <Eye cx={118} cy={101} />
      </g>
      <path
        d="M92 110 Q100 118 108 110"
        stroke={COLORS.stroke}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),

  happy: (
    <>
      {/* Olhos de Super Potência Mental (Estrelas Elétricas) */}
      <circle cx={82} cy={100} r={8.5} fill={COLORS.stroke} />
      <circle cx={118} cy={100} r={8.5} fill={COLORS.stroke} />
      <path
        d="M82 92 L84 98 L90 100 L84 102 L82 108 L80 102 L74 100 L80 98 Z"
        fill={COLORS.energyMain}
      />
      <path
        d="M118 92 L120 98 L126 100 L120 102 L118 108 L116 102 L110 100 L116 98 Z"
        fill={COLORS.energyMain}
      />
      {/* Sorriso aberto radiante */}
      <path d="M90 109 Q100 125 110 109 Z" fill={COLORS.stroke} />
      <path
        d="M95 116 Q100 120 105 116"
        stroke={COLORS.brainMain}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </>
  ),

  thinking: (
    <>
      <path
        d="M73 88 Q82 84 89 89"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M111 86 Q118 81 127 86"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <Eye cx={82} cy={100} r={7.5} pupilOffset={{ dx: 2, dy: -3.5 }} />
      <Eye cx={118} cy={100} r={7.5} pupilOffset={{ dx: 2, dy: -3.5 }} />
      {/* Boca em onda de processamento neural */}
      <path
        d="M93 113 L97 110 L102 114 L107 111"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </>
  ),

  error: (
    <>
      <path
        d="M74 92 L88 96"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M126 92 L112 96"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M76 102 L86 108 M86 102 L76 108"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M114 102 L124 108 M124 102 L114 108"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M93 116 Q100 109 107 116"
        stroke={COLORS.stroke}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),
};

/* ==========================================================================
   3. Estilos de Animação (Sinapses, Arcos de Plasma e Pulso Eletromagnético)
   ========================================================================== */

const ANIMATION_STYLES = `
  /* Flutuação com micro-vibração de energia no pico */
  .ebrain-svg .ebrain-body {
    transform-origin: 100px 140px;
  }
  .ebrain-svg[data-mood="idle"] .ebrain-body {
    animation: ebrain-hover-buzz 1.8s ease-in-out infinite;
    filter: drop-shadow(0 0 14px rgba(254, 168, 66, 0.5));
  }
  .ebrain-svg[data-mood="happy"] .ebrain-body {
    animation: ebrain-overdrive 0.48s ease-in-out infinite;
    filter: drop-shadow(0 0 24px rgba(254, 168, 66, 0.85));
  }
  .ebrain-svg[data-mood="thinking"] .ebrain-body {
    animation: ebrain-pulse-think 1.4s ease-in-out infinite;
    filter: drop-shadow(0 0 16px rgba(56, 189, 248, 0.55));
  }
  .ebrain-svg[data-mood="error"] .ebrain-body {
    animation: ebrain-powerdown 0.5s ease-out forwards;
  }

  /* Aura Eletromagnética e Ondas de Choque ao Fundo */
  .ebrain-svg .energy-aura {
    transform-origin: 100px 95px;
    animation: aura-throb 1.5s ease-in-out infinite alternate;
  }
  .ebrain-svg .shockwave-ring-1 {
    transform-origin: 100px 95px;
    animation: ring-expand 1.8s ease-out infinite;
  }
  .ebrain-svg .shockwave-ring-2 {
    transform-origin: 100px 95px;
    animation: ring-expand 1.8s ease-out infinite 0.9s;
  }
  .ebrain-svg[data-mood="happy"] .shockwave-ring-1,
  .ebrain-svg[data-mood="happy"] .shockwave-ring-2 {
    animation-duration: 0.9s;
  }

  /* SINAPSES PULSANDO DENTRO DO CÉREBRO */
  .ebrain-svg .synapse-spark {
    stroke-dasharray: 18 36;
    animation: synapse-fire 0.55s linear infinite;
  }
  .ebrain-svg[data-mood="happy"] .synapse-spark {
    animation-duration: 0.3s;
  }

  /* ARCOS ELÉTRICOS EXTERNOS AO REDOR DO CÉREBRO */
  .ebrain-svg .outer-arc-1 {
    stroke-dasharray: 24 46;
    animation: arc-crackle 0.42s linear infinite;
  }
  .ebrain-svg .outer-arc-2 {
    stroke-dasharray: 20 42;
    animation: arc-crackle 0.36s linear infinite reverse;
  }
  .ebrain-svg .outer-arc-3 {
    stroke-dasharray: 16 38;
    animation: arc-crackle 0.48s linear infinite 0.2s;
  }

  /* Raio de Energia no Topo da Cabeça */
  .ebrain-svg .crown-bolt {
    transform-origin: 100px 42px;
    animation: bolt-pop 0.9s ease-in-out infinite alternate;
  }

  /* Sombra no chão */
  .ebrain-svg .floor-shadow {
    transform-origin: center;
    animation: ebrain-shadow 1.8s ease-in-out infinite;
  }

  /* Piscar de olhos */
  .ebrain-svg .ebrain-eyes-blink {
    transform-origin: 100px 101px;
    animation: ebrain-blink 3.4s infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .ebrain-svg * { animation: none !important; }
  }

  @keyframes ebrain-hover-buzz {
    0%, 100% { transform: translate(0px, 0px) scale(1.03, 0.97); }
    42% { transform: translate(0px, -13px) scale(0.98, 1.02); }
    46% { transform: translate(-2px, -14px) rotate(-1.2deg); }
    50% { transform: translate(2px, -13px) rotate(1.2deg); }
    54% { transform: translate(-1.5px, -14px) rotate(-0.8deg); }
    58% { transform: translate(0px, -12px) scale(0.99, 1.02); }
  }

  @keyframes ebrain-overdrive {
    0%, 100% { transform: translate(-1.5px, 0px) scale(1.07, 0.93) rotate(-1.5deg); }
    50% { transform: translate(1.5px, -20px) scale(0.95, 1.06) rotate(2deg); }
  }

  @keyframes ebrain-pulse-think {
    0%, 100% { transform: translateY(-2px) scale(0.99); }
    50% { transform: translateY(-10px) scale(1.04); }
  }

  @keyframes ebrain-powerdown {
    0% { transform: translateY(0); }
    100% { transform: translateY(8px) scale(0.96); }
  }

  @keyframes aura-throb {
    0% { transform: scale(0.92); opacity: 0.4; }
    100% { transform: scale(1.1); opacity: 0.75; }
  }

  @keyframes ring-expand {
    0% { transform: scale(0.75); opacity: 0.85; stroke-width: 4.5px; }
    100% { transform: scale(1.38); opacity: 0; stroke-width: 1px; }
  }

  @keyframes synapse-fire {
    from { stroke-dashoffset: 54; }
    to { stroke-dashoffset: 0; }
  }

  @keyframes arc-crackle {
    0% { stroke-dashoffset: 68; opacity: 0.95; }
    50% { opacity: 0.35; }
    100% { stroke-dashoffset: 0; opacity: 1; }
  }

  @keyframes bolt-pop {
    0% { transform: translateY(0px) scale(0.94); }
    100% { transform: translateY(-5px) scale(1.12); }
  }

  @keyframes ebrain-shadow {
    0%, 100% { transform: scale(1); opacity: 0.24; }
    50% { transform: scale(0.74); opacity: 0.11; }
  }

  @keyframes ebrain-blink {
    0%, 92%, 100% { transform: scaleY(1); }
    96% { transform: scaleY(0.08); }
  }
`;

/* ==========================================================================
   4. Componente Principal
   ========================================================================== */

export const EnergizedBrainMascot: React.FC<EnergizedBrainMascotProps> = memo(
  ({ mood = "idle", size = 90, className = "", onClick, ...rest }) => {
    const isEnergized = mood !== "error";
    const mainColor = isEnergized ? COLORS.brainMain : COLORS.brainOffMain;
    const darkColor = isEnergized ? COLORS.brainDark : COLORS.brainOffDark;

    return (
      <div
        role="img"
        aria-label={MOOD_LABELS[mood]}
        onClick={onClick}
        className={`inline-flex items-center justify-center select-none ${
          onClick ? "cursor-pointer" : ""
        } ${className}`}
        data-mood={mood}
        {...rest}
      >
        <style dangerouslySetInnerHTML={{ __html: ANIMATION_STYLES }} />

        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="ebrain-svg overflow-visible"
          data-mood={mood}
        >
          {/* Sombra no Chão */}
          <ellipse
            className="floor-shadow"
            cx="100"
            cy="180"
            rx="48"
            ry="8.5"
            fill={COLORS.shadow}
          />

          {/* ==============================================================
              1. CAMPO DE ENERGIA E ONDAS DE CHOQUE AO FUNDO
              ============================================================== */}
          {isEnergized && (
            <g>
              {/* Aura Luminosa Central */}
              <circle
                className="energy-aura"
                cx="100"
                cy="95"
                r="66"
                fill={COLORS.energyCore}
              />
              {/* Anéis de Onda de Choque Eletromagnética */}
              <circle
                className="shockwave-ring-1"
                cx="100"
                cy="95"
                r="56"
                stroke={
                  mood === "thinking" ? COLORS.synapseCyan : COLORS.energyMain
                }
                fill="none"
              />
              <circle
                className="shockwave-ring-2"
                cx="100"
                cy="95"
                r="56"
                stroke={COLORS.energyLight}
                fill="none"
              />
            </g>
          )}

          {/* ==============================================================
              2. CORPO DO CÉREBRO + SINAPSES ENERGIZADAS + ARCOS DE PLASMA
              ============================================================== */}
          <g className="ebrain-body">
            {/* Relevo 3D Inferior */}
            <g fill={darkColor}>
              {BASE_CIRCLES.map((c, i) => (
                <circle key={`base-${i}`} {...c} />
              ))}
            </g>

            {/* Massa Principal do Cérebro */}
            <g fill={mainColor}>
              {BODY_CIRCLES.map((c, i) => (
                <circle key={`body-${i}`} {...c} />
              ))}
            </g>

            {/* Brilhos Superiores */}
            {isEnergized && (
              <g
                stroke={COLORS.brainLight}
                strokeWidth="5"
                strokeLinecap="round"
              >
                <path d="M62 56 C70 48, 84 48, 90 54" />
                <path d="M112 54 C120 48, 132 48, 138 56" />
              </g>
            )}

            {/* Sulcos Naturais do Cérebro */}
            <g
              stroke={darkColor}
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            >
              {BRAIN_FOLDS.map((d, i) => (
                <path key={`fold-${i}`} d={d} />
              ))}
            </g>

            {/* ============================================================
                SINAPSES ELÉTRICAS CORRENDO POR DENTRO DOS SULCOS DO CÉREBRO
                ============================================================ */}
            {isEnergized && (
              <g
                className="synapse-spark"
                stroke={
                  mood === "thinking" ? COLORS.synapseCyan : COLORS.energyCore
                }
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              >
                <path d="M48 84 C60 76, 74 82, 82 70 C88 60, 96 64, 100 54" />
                <path d="M152 84 C140 76, 126 82, 118 70 C112 60, 104 64, 100 54" />
                <path d="M50 112 C62 106, 70 114, 76 124" />
                <path d="M150 112 C138 106, 130 114, 124 124" />
              </g>
            )}

            {/* Bochechas Energizadas */}
            {isEnergized && (
              <g fill={COLORS.cheek} opacity={mood === "happy" ? "0.8" : "0.5"}>
                <ellipse cx="66" cy="110" rx="7" ry="4.5" />
                <ellipse cx="134" cy="110" rx="7" ry="4.5" />
              </g>
            )}

            {/* Expressão Facial Dinâmica */}
            {FACE_BY_MOOD[mood]}

            {/* ============================================================
                COROA DE RAIO NO TOPO DO CÉREBRO (Ícone de Energia Mental)
                ============================================================ */}
            {isEnergized && (
              <g className="crown-bolt">
                <path
                  d="M106 10 L88 32 H101 L94 52 L116 28 H102 L106 10 Z"
                  fill={COLORS.energyDark}
                  stroke={COLORS.stroke}
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                <path
                  d="M105 12 L90 31 H101 L96 48 L114 29 H102 L105 12 Z"
                  fill={COLORS.energyMain}
                />
              </g>
            )}

            {/* ============================================================
                ARCOS DE PLASMA / RAIOS EXTERNOS RODEANDO O CÉREBRO
                ============================================================ */}
            {isEnergized && (
              <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                {/* Arco Elétrico Esquerdo */}
                <path
                  className="outer-arc-1"
                  d="M52 54 L28 68 L40 84 L20 104 L42 122"
                  stroke={COLORS.energyMain}
                  strokeWidth="4"
                />
                <path
                  className="outer-arc-1"
                  d="M52 54 L28 68 L40 84 L20 104 L42 122"
                  stroke={COLORS.energyCore}
                  strokeWidth="1.8"
                />

                {/* Arco Elétrico Direito */}
                <path
                  className="outer-arc-2"
                  d="M148 54 L172 68 L160 84 L180 104 L158 122"
                  stroke={
                    mood === "thinking" ? COLORS.synapseCyan : COLORS.energyMain
                  }
                  strokeWidth="4"
                />

                {/* Arco Elétrico Superior */}
                <path
                  className="outer-arc-3"
                  d="M68 38 L82 26 L94 34 M132 38 L118 26 L106 34"
                  stroke={COLORS.energyLight}
                  strokeWidth="3.5"
                />
              </g>
            )}
          </g>
        </svg>
      </div>
    );
  }
);

EnergizedBrainMascot.displayName = "EnergizedBrainMascot";

export default EnergizedBrainMascot;
