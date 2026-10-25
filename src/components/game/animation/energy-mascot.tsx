import React, { memo } from "react";

export type EnergyMood = "idle" | "happy" | "thinking" | "error";

export interface TotalEnergyMascotProps
  extends React.HTMLAttributes<HTMLDivElement> {
  mood?: EnergyMood;
  size?: number;
}

/* ==========================================================================
   1. Tokens de Design (Integrados ao tailwind-colors.css) & Labels
   ========================================================================== */

const COLORS = {
  boltCoreGlow: "var(--color-orange-50, #fff6ec)",
  boltLight: "var(--color-orange-200, #ffd7a8)",
  boltMain: "var(--color-orange-400, #feb968)",
  boltAccent: "var(--color-orange-500, #fea842)",
  boltDark: "var(--color-orange-600, #e7993c)",
  boltDeep: "var(--color-orange-700, #b4772f)",
  boltOffMain: "var(--color-blue-100, #b0becb)",
  boltOffDark: "var(--color-blue-200, #8a9eb2)",
  electricBlue: "var(--color-blue-50, #e6eaee)",
  stroke: "var(--color-blue-800, #001930)",
  shadow: "var(--color-blue-500, #002d58)",
  cheek: "#ff4d6d",
  white: "#ffffff",
} as const;

const MOOD_LABELS: Record<EnergyMood, string> = {
  idle: "Raio de energia total eletrizando em alta voltagem",
  happy: "Raio em sobrecarga máxima comemorando com explosão elétrica",
  thinking: "Raio concentrando carga elétrica",
  error: "Raio descarregado e sem bateria",
};

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
  r = 6,
  pupilOffset = { dx: 1.5, dy: -2 },
}) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill={COLORS.stroke} />
    <circle
      cx={cx + pupilOffset.dx}
      cy={cy + pupilOffset.dy}
      r={r * 0.4}
      fill={COLORS.white}
    />
    <circle cx={cx - 2} cy={cy + 2} r={1.2} fill={COLORS.white} />
  </g>
);

const FACE_BY_MOOD: Record<EnergyMood, React.ReactNode> = {
  idle: (
    <>
      {/* Sobrancelhas em ângulo elétrico de potência */}
      <path
        d="M78 82 L91 86"
        stroke={COLORS.stroke}
        strokeWidth="3.8"
        strokeLinecap="round"
      />
      <path
        d="M122 82 L109 86"
        stroke={COLORS.stroke}
        strokeWidth="3.8"
        strokeLinecap="round"
      />
      <g className="energy-eyes-blink">
        <Eye cx={85} cy={94} />
        <Eye cx={115} cy={94} />
      </g>
      {/* Sorriso confiante e energético */}
      <path
        d="M91 105 Q100 114 110 104"
        stroke={COLORS.stroke}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),

  happy: (
    <>
      {/* Olhos em formato de Estrela de Energia Máxima! */}
      <path
        d="M85 85 L87.5 91.5 L94 94 L87.5 96.5 L85 103 L82.5 96.5 L76 94 L82.5 91.5 Z"
        fill={COLORS.stroke}
      />
      <path
        d="M115 85 L117.5 91.5 L124 94 L117.5 96.5 L115 103 L112.5 96.5 L106 94 L112.5 91.5 Z"
        fill={COLORS.stroke}
      />
      <circle cx="85" cy="94" r="2" fill={COLORS.white} />
      <circle cx="115" cy="94" r="2" fill={COLORS.white} />

      {/* Boca aberta de Poder Total */}
      <path d="M89 104 Q100 121 111 104 Z" fill={COLORS.stroke} />
      <path
        d="M94 112 Q100 116 106 112"
        stroke={COLORS.cheek}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </>
  ),

  thinking: (
    <>
      <path
        d="M78 84 L90 85"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M109 80 Q116 75 122 80"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <Eye cx={85} cy={94} r={5.5} pupilOffset={{ dx: 2, dy: -2.5 }} />
      <Eye cx={115} cy={94} r={5.5} pupilOffset={{ dx: 2, dy: -2.5 }} />
      {/* Boca em zigue-zague de estática pensando */}
      <path
        d="M94 107 L98 104 L102 108 L106 105"
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
      {/* Olhos de Bateria Fraca (X X ou fechados cansados) */}
      <path
        d="M79 90 L89 98 M89 90 L79 98"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M111 90 L121 98 M121 90 L111 98"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Boca caída sem energia */}
      <path
        d="M93 111 Q100 104 107 111"
        stroke={COLORS.stroke}
        strokeWidth="3.8"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),
};

/* ==========================================================================
   3. Estilos de Animação (Eletrização, Arcos de Plasma e Tremor de Voltagem)
   ========================================================================== */

const ANIMATION_STYLES = `
  /* Corpo do Raio com flutuação + tremor de alta voltagem */
  .energy-svg .bolt-core {
    transform-origin: 100px 100px;
  }
  .energy-svg[data-mood="idle"] .bolt-core {
    animation: bolt-electrify 1.6s ease-in-out infinite;
    filter: drop-shadow(0 0 14px rgba(254, 168, 66, 0.55));
  }
  .energy-svg[data-mood="happy"] .bolt-core {
    animation: bolt-overcharge 0.45s ease-in-out infinite;
    filter: drop-shadow(0 0 24px rgba(254, 168, 66, 0.9));
  }
  .energy-svg[data-mood="thinking"] .bolt-core {
    animation: bolt-charge-pulse 2.2s ease-in-out infinite;
  }
  .energy-svg[data-mood="error"] .bolt-core {
    animation: bolt-drain 0.6s ease-out forwards;
  }

  /* Ondas de choque concêntricas (Campo Eletromagnético) */
  .energy-svg .energy-shockwave {
    transform-origin: 100px 98px;
    animation: shockwave-expand 1.6s ease-out infinite;
  }
  .energy-svg .energy-shockwave-2 {
    transform-origin: 100px 98px;
    animation: shockwave-expand 1.6s ease-out infinite 0.8s;
  }
  .energy-svg[data-mood="happy"] .energy-shockwave,
  .energy-svg[data-mood="happy"] .energy-shockwave-2 {
    animation-duration: 0.9s;
  }

  /* ARCOS ELÉTRICOS SE ELETRIZANDO AO REDOR DO CORPO */
  .energy-svg .electric-arc-1 {
    stroke-dasharray: 26 44;
    animation: arc-zap 0.38s linear infinite;
  }
  .energy-svg .electric-arc-2 {
    stroke-dasharray: 22 48;
    animation: arc-zap 0.46s linear infinite reverse;
  }
  .energy-svg .electric-arc-3 {
    stroke-dasharray: 18 40;
    animation: arc-zap 0.32s linear infinite 0.15s;
  }

  /* Faíscas disparando nas extremidades */
  .energy-svg .spark-burst-1 {
    transform-origin: 36px 54px;
    animation: spark-flash 0.7s ease-in-out infinite;
  }
  .energy-svg .spark-burst-2 {
    transform-origin: 166px 76px;
    animation: spark-flash 0.7s ease-in-out infinite 0.35s;
  }
  .energy-svg .spark-burst-3 {
    transform-origin: 44px 138px;
    animation: spark-flash 0.7s ease-in-out infinite 0.5s;
  }

  /* Sombra no chão */
  .energy-svg .floor-shadow {
    transform-origin: center;
    animation: energy-shadow 1.6s ease-in-out infinite;
  }

  /* Piscar de olhos */
  .energy-svg .energy-eyes-blink {
    transform-origin: 100px 94px;
    animation: energy-blink 3.2s infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .energy-svg * { animation: none !important; }
  }

  /* Inclui micro-vibrações nos 45%-55% para simular descarga elétrica */
  @keyframes bolt-electrify {
    0%, 100% { transform: translate(0px, 0px) scale(1.02, 0.98) rotate(0deg); }
    40% { transform: translate(0px, -12px) scale(0.98, 1.03) rotate(-1deg); }
    45% { transform: translate(-2.5px, -13px) rotate(1.5deg); }
    50% { transform: translate(2.5px, -12px) rotate(-1.5deg); }
    55% { transform: translate(-1.5px, -13px) rotate(1deg); }
    60% { transform: translate(0px, -11px) scale(0.99, 1.02) rotate(0deg); }
  }

  @keyframes bolt-overcharge {
    0%, 100% { transform: translate(-2px, 0px) scale(1.06, 0.94) rotate(-2deg); }
    25% { transform: translate(2px, -10px) scale(0.96, 1.05) rotate(2deg); }
    50% { transform: translate(-2px, -18px) scale(1.04, 1.04) rotate(-3deg); }
    75% { transform: translate(2px, -8px) scale(0.98, 1.02) rotate(2deg); }
  }

  @keyframes bolt-charge-pulse {
    0%, 100% { transform: translateY(0px) scale(0.98); }
    50% { transform: translateY(-7px) scale(1.03); }
  }

  @keyframes bolt-drain {
    0% { transform: translateY(0px) rotate(0deg); }
    100% { transform: translateY(8px) rotate(-5deg) scale(0.95); }
  }

  @keyframes shockwave-expand {
    0% { transform: scale(0.55); opacity: 0.85; stroke-width: 5px; }
    100% { transform: scale(1.38); opacity: 0; stroke-width: 1px; }
  }

  @keyframes arc-zap {
    0% { stroke-dashoffset: 70; opacity: 0.95; }
    50% { opacity: 0.4; }
    100% { stroke-dashoffset: 0; opacity: 1; }
  }

  @keyframes spark-flash {
    0%, 100% { transform: scale(0.4) rotate(0deg); opacity: 0.2; }
    50% { transform: scale(1.3) rotate(35deg); opacity: 1; }
  }

  @keyframes energy-shadow {
    0%, 100% { transform: scale(1); opacity: 0.24; }
    50% { transform: scale(0.74); opacity: 0.12; }
  }

  @keyframes energy-blink {
    0%, 92%, 100% { transform: scaleY(1); }
    96% { transform: scaleY(0.08); }
  }
`;

/* ==========================================================================
   4. Componente Principal
   ========================================================================== */

export const TotalEnergyMascot: React.FC<TotalEnergyMascotProps> = memo(
  ({ mood = "idle", size = 220, className = "", onClick, ...rest }) => {
    const isCharged = mood !== "error";
    const bodyMain = isCharged ? COLORS.boltMain : COLORS.boltOffMain;
    const bodyDark = isCharged ? COLORS.boltDark : COLORS.boltOffDark;

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
        <style>{ANIMATION_STYLES}</style>

        <svg
          width={size}
          height={size}
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="energy-svg overflow-visible"
          data-mood={mood}
        >
          {/* Sombra no Chão */}
          <ellipse
            className="floor-shadow"
            cx="98"
            cy="184"
            rx="40"
            ry="7.5"
            fill={COLORS.shadow}
          />

          {/* ==============================================================
              1. CAMPO ELETROMAGNÉTICO E ONDAS DE CHOQUE AO FUNDO
              ============================================================== */}
          {isCharged && (
            <g>
              {/* Aura Central de Energia */}
              <circle
                cx="100"
                cy="98"
                r="58"
                fill={COLORS.boltCoreGlow}
                opacity="0.55"
              />
              {/* Ondas de Choque Expansivas */}
              <circle
                className="energy-shockwave"
                cx="100"
                cy="98"
                r="52"
                stroke={COLORS.boltAccent}
                fill="none"
              />
              <circle
                className="energy-shockwave-2"
                cx="100"
                cy="98"
                r="52"
                stroke={COLORS.boltLight}
                fill="none"
              />
            </g>
          )}

          {/* ==============================================================
              2. CORPO DO RAIO 3D (Sombra + Corpo + Brilho + Rosto)
              ============================================================== */}
          <g className="bolt-core">
            {/* Camada 3D Traseira Mais Escura (Relevo Estilo Duolingo) */}
            <path
              d="M116 22 L52 104 H94 L76 172 L150 86 H108 L116 22 Z"
              fill={isCharged ? COLORS.boltDeep : COLORS.boltOffDark}
              stroke={isCharged ? COLORS.boltDeep : COLORS.boltOffDark}
              strokeWidth="12"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Camada Intermediária Laranja Vibrante */}
            <path
              d="M116 16 L52 98 H94 L76 166 L150 80 H108 L116 16 Z"
              fill={bodyDark}
              stroke={bodyDark}
              strokeWidth="12"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Camada Frontal Iluminada do Raio */}
            <path
              d="M116 14 L54 95 H95 L78 162 L148 79 H107 L116 14 Z"
              fill={bodyMain}
              stroke={bodyMain}
              strokeWidth="8"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Núcleo Super-Aquecido no Centro do Raio */}
            {isCharged && (
              <polygon
                points="108,34 68,88 98,88 88,136 134,84 102,84"
                fill={COLORS.boltCoreGlow}
                opacity="0.65"
              />
            )}

            {/* Brilho Specular Superior Esquerdo (Acabamento Glossy) */}
            <path
              d="M106 26 L70 74"
              stroke={COLORS.white}
              strokeWidth="5.5"
              strokeLinecap="round"
              opacity="0.85"
            />
            <circle cx="63" cy="83" r="3" fill={COLORS.white} opacity="0.85" />

            {/* Bochechas Elétricas */}
            {isCharged && (
              <g
                fill={COLORS.cheek}
                opacity={mood === "happy" ? "0.75" : "0.45"}
              >
                <ellipse cx="73" cy="102" rx="6" ry="3.8" />
                <ellipse cx="127" cy="102" rx="6" ry="3.8" />
              </g>
            )}

            {/* Expressão Facial Dinâmica */}
            {FACE_BY_MOOD[mood]}

            {/* ============================================================
                3. ARCOS ELÉTRICOS SE ELETRIZANDO AO REDOR DO RAIO
                ============================================================ */}
            {isCharged && (
              <g fill="none" strokeLinecap="round" strokeLinejoin="round">
                {/* Arco Elétrico 1: Descarga Esquerda em Zigue-Zague */}
                <path
                  className="electric-arc-1"
                  d="M84 32 L54 44 L64 58 L36 78 L54 92"
                  stroke={COLORS.boltCoreGlow}
                  strokeWidth="4"
                />
                <path
                  className="electric-arc-1"
                  d="M84 32 L54 44 L64 58 L36 78 L54 92"
                  stroke={COLORS.boltAccent}
                  strokeWidth="2"
                />

                {/* Arco Elétrico 2: Descarga Direita em Zigue-Zague */}
                <path
                  className="electric-arc-2"
                  d="M126 42 L156 54 L144 70 L168 92 L138 112"
                  stroke={COLORS.electricBlue}
                  strokeWidth="4"
                />

                {/* Arco Elétrico 3: Descarga na Ponta Inferior */}
                <path
                  className="electric-arc-3"
                  d="M64 118 L44 134 L62 146 L52 164"
                  stroke={COLORS.boltAccent}
                  strokeWidth="3.8"
                />
              </g>
            )}
          </g>

          {/* ==============================================================
              4. FAÍSCAS EXTERNAS E CENTELHAS DE VOLTAGEM
              ============================================================== */}
          {isCharged && (
            <g fill={COLORS.boltAccent}>
              {/* Faísca 1 (Topo Esquerdo) */}
              <path
                className="spark-burst-1"
                d="M36 44 L38.5 51.5 L46 54 L38.5 56.5 L36 64 L33.5 56.5 L26 54 L33.5 51.5 Z"
              />
              {/* Faísca 2 (Direita) */}
              <path
                className="spark-burst-2"
                d="M166 66 L168.5 73.5 L176 76 L168.5 78.5 L166 86 L163.5 78.5 L156 76 L163.5 73.5 Z"
              />
              {/* Mini Raio Extra (Esquerda Inferior) */}
              <path
                className="spark-burst-3"
                d="M46 128 L34 140 H43 L38 152 L52 138 H43 Z"
                fill={COLORS.boltDark}
              />
            </g>
          )}
        </svg>
      </div>
    );
  }
);

TotalEnergyMascot.displayName = "TotalEnergyMascot";

export default TotalEnergyMascot;
