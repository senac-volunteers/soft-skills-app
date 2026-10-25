import React, { memo } from "react";

export type MotivationMood = "idle" | "happy" | "thinking" | "error";

export interface MotivationMascotProps
  extends React.HTMLAttributes<HTMLDivElement> {
  mood?: MotivationMood;
  size?: number;
}

/* ==========================================================================
   1. Tokens de Design (Integrados ao tailwind-colors.css) & Labels
   ========================================================================== */

const COLORS = {
  skinLight: "var(--color-orange-100, #ffe4c4)",
  skinShadow: "var(--color-orange-200, #ffd7a8)",
  suitLight: "var(--color-blue-400, #335779)",
  suitMain: "var(--color-blue-500, #002d58)",
  suitDark: "var(--color-blue-700, #00203e)",
  stroke: "var(--color-blue-800, #001930)",
  accentLight: "var(--color-orange-300, #fec580)",
  accentMain: "var(--color-orange-500, #fea842)",
  accentDark: "var(--color-orange-600, #e7993c)",
  windMain: "var(--color-blue-100, #b0becb)",
  windSoft: "var(--color-blue-50, #e6eaee)",
  dust: "var(--color-purple-600, #d5dbe4)",
  cheek: "#ff6b6b",
  white: "#ffffff",
} as const;

const MOOD_LABELS: Record<MotivationMood, string> = {
  idle: "Personagem correndo com rajadas de vento nas costas",
  happy: "Personagem em sprint máximo comemorando com turbo de vento",
  thinking: "Personagem correndo em ritmo constante e focado",
  error: "Personagem exausto recuperando o fôlego",
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
  r = 5.2,
  pupilOffset = { dx: 2, dy: -1 },
}) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill={COLORS.stroke} />
    <circle
      cx={cx + pupilOffset.dx}
      cy={cy + pupilOffset.dy}
      r={r * 0.38}
      fill={COLORS.white}
    />
  </g>
);

const FACE_BY_MOOD: Record<MotivationMood, React.ReactNode> = {
  idle: (
    <>
      {/* Sobrancelhas determinadas inclinadas para a corrida */}
      <path
        d="M114 57 Q120 55 125 58"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M132 56 Q137 54 142 57"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <g className="runner-eyes-blink">
        <Eye cx={120} cy={66} />
        <Eye cx={137} cy={66} />
      </g>
      {/* Sorriso confiante de corredor */}
      <path
        d="M122 76 Q130 83 137 75"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),

  happy: (
    <>
      {/* Olhos fechados de alegria em alta velocidade (> <) */}
      <path
        d="M114 66 Q120 58 126 66"
        stroke={COLORS.stroke}
        strokeWidth="3.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M131 66 Q137 58 143 66"
        stroke={COLORS.stroke}
        strokeWidth="3.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Boca aberta de celebração */}
      <path d="M121 74 Q130 88 139 74 Z" fill={COLORS.stroke} />
      <path
        d="M125 80 Q130 84 135 80"
        stroke={COLORS.cheek}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </>
  ),

  thinking: (
    <>
      <path
        d="M114 58 L125 59"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M131 54 Q137 50 142 55"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <Eye cx={120} cy={66} pupilOffset={{ dx: 2.5, dy: -2 }} />
      <Eye cx={137} cy={66} pupilOffset={{ dx: 2.5, dy: -2 }} />
      <circle cx={131} cy={77} r={3.2} fill={COLORS.stroke} />
    </>
  ),

  error: (
    <>
      {/* Sobrancelhas de cansaço */}
      <path
        d="M114 60 L125 56"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M142 60 L131 56"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <Eye cx={120} cy={68} pupilOffset={{ dx: 0, dy: 1.5 }} />
      <Eye cx={137} cy={68} pupilOffset={{ dx: 0, dy: 1.5 }} />
      {/* Boca arqueada tentando puxar ar */}
      <path
        d="M123 80 Q130 74 137 80"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Gotinha de suor na testa */}
      <path
        d="M110 52 C107 57, 107 61, 110 61 C113 61, 113 57, 110 52 Z"
        fill="#38bdf8"
      />
    </>
  ),
};

/* ==========================================================================
   3. Estilos de Animação (Articulação de Membros + Vento nas Costas)
   ========================================================================== */

const ANIMATION_STYLES = `
  /* Impulso vertical do corpo (Squash & Stretch de corrida) */
  .runner-svg .runner-core {
    transform-origin: 115px 120px;
    animation: runner-bounce 0.34s ease-in-out infinite alternate;
  }
  .runner-svg[data-mood="happy"] .runner-core {
    animation-duration: 0.24s;
    filter: drop-shadow(0 8px 16px rgba(254, 168, 66, 0.35));
  }
  .runner-svg[data-mood="thinking"] .runner-core {
    animation-duration: 0.48s;
  }
  .runner-svg[data-mood="error"] .runner-core {
    animation: runner-panting 1.1s ease-in-out infinite;
  }

  /* Alternância de Pernas e Braços */
  .runner-svg .limb-front-leg,
  .runner-svg .limb-back-arm {
    transform-origin: 108px 124px;
    animation: swing-forward 0.34s ease-in-out infinite alternate;
  }
  .runner-svg .limb-back-arm {
    transform-origin: 110px 96px;
  }

  .runner-svg .limb-back-leg,
  .runner-svg .limb-front-arm {
    transform-origin: 108px 124px;
    animation: swing-backward 0.34s ease-in-out infinite alternate;
  }
  .runner-svg .limb-front-arm {
    transform-origin: 112px 96px;
  }

  /* Modo Turbo (Happy) acelera os membros */
  .runner-svg[data-mood="happy"] .limb-front-leg,
  .runner-svg[data-mood="happy"] .limb-back-leg,
  .runner-svg[data-mood="happy"] .limb-front-arm,
  .runner-svg[data-mood="happy"] .limb-back-arm {
    animation-duration: 0.24s;
  }

  /* Modo Error pausa a passada */
  .runner-svg[data-mood="error"] .limb-front-leg,
  .runner-svg[data-mood="error"] .limb-back-leg,
  .runner-svg[data-mood="error"] .limb-front-arm,
  .runner-svg[data-mood="error"] .limb-back-arm {
    animation: none;
  }

  /* Faixa na cabeça tremulando com o vento */
  .runner-svg .headband-tails {
    transform-origin: 96px 56px;
    animation: headband-flutter 0.28s ease-in-out infinite alternate;
  }

  /* ANIMAÇÃO DO VENTO NAS COSTAS (Espirais + Rajadas) */
  .runner-svg .wind-gust-1 {
    stroke-dasharray: 55 90;
    animation: wind-flow 0.65s linear infinite;
  }
  .runner-svg .wind-gust-2 {
    stroke-dasharray: 45 85;
    animation: wind-flow 0.75s linear infinite 0.22s;
  }
  .runner-svg .wind-gust-3 {
    stroke-dasharray: 38 80;
    animation: wind-flow 0.58s linear infinite 0.4s;
  }
  .runner-svg[data-mood="happy"] .wind-gust-1,
  .runner-svg[data-mood="happy"] .wind-gust-2,
  .runner-svg[data-mood="happy"] .wind-gust-3 {
    animation-duration: 0.42s;
  }

  /* Poeira / Puff de ar saindo dos pés */
  .runner-svg .dust-puff-1 {
    transform-origin: 54px 164px;
    animation: dust-pop 0.68s ease-out infinite;
  }
  .runner-svg .dust-puff-2 {
    transform-origin: 34px 158px;
    animation: dust-pop 0.68s ease-out infinite 0.34s;
  }

  /* Sombra acompanhando o salto */
  .runner-svg .floor-shadow {
    transform-origin: 112px 176px;
    animation: runner-shadow 0.34s ease-in-out infinite alternate;
  }

  /* Piscar de olhos */
  .runner-svg .runner-eyes-blink {
    transform-origin: 128px 66px;
    animation: runner-blink 3.5s infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .runner-svg * { animation: none !important; }
  }

  @keyframes runner-bounce {
    0% { transform: translateY(2px) rotate(8deg) scale(1.03, 0.97); }
    100% { transform: translateY(-9px) rotate(12deg) scale(0.98, 1.03); }
  }
  @keyframes runner-panting {
    0%, 100% { transform: translateY(4px) rotate(4deg) scale(1.02, 0.98); }
    50% { transform: translateY(1px) rotate(2deg) scale(0.99, 1.01); }
  }
  @keyframes swing-forward {
    0% { transform: rotate(-28deg); }
    100% { transform: rotate(32deg); }
  }
  @keyframes swing-backward {
    0% { transform: rotate(32deg); }
    100% { transform: rotate(-28deg); }
  }
  @keyframes headband-flutter {
    0% { transform: rotate(-6deg) skewY(-4deg); }
    100% { transform: rotate(8deg) skewY(6deg); }
  }
  @keyframes wind-flow {
    0% {
      stroke-dashoffset: 65;
      transform: translateX(14px);
      opacity: 0;
    }
    25% {
      opacity: 0.95;
    }
    85% {
      opacity: 0.85;
    }
    100% {
      stroke-dashoffset: -75;
      transform: translateX(-26px);
      opacity: 0;
    }
  }
  @keyframes dust-pop {
    0% { transform: translate(12px, 2px) scale(0.3); opacity: 0.85; }
    100% { transform: translate(-24px, -10px) scale(1.35); opacity: 0; }
  }
  @keyframes runner-shadow {
    0% { transform: scaleX(1.05); opacity: 0.25; }
    100% { transform: scaleX(0.78); opacity: 0.12; }
  }
  @keyframes runner-blink {
    0%, 92%, 100% { transform: scaleY(1); }
    96% { transform: scaleY(0.08); }
  }
`;

/* ==========================================================================
   4. Componente Principal
   ========================================================================== */

export const MotivationMascot: React.FC<MotivationMascotProps> = memo(
  ({ mood = "idle", size = 90, className = "", onClick, ...rest }) => {
    const showWind = mood !== "error";
    const windColor = mood === "happy" ? COLORS.accentMain : COLORS.windMain;

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
          className="runner-svg overflow-visible"
          data-mood={mood}
        >
          {/* Sombra Dinâmica no Chão */}
          <ellipse
            className="floor-shadow"
            cx="112"
            cy="176"
            rx="42"
            ry="7.5"
            fill={COLORS.suitMain}
          />

          {/* ==============================================================
              EFEITO DE VENTO NAS COSTAS (Rajadas Curvas + Espirais + Poeira)
              ============================================================== */}
          {showWind && (
            <g>
              {/* Rajada 1: Superior (com redemoinho na ponta) */}
              <path
                className="wind-gust-1"
                d="M84 68 H28 C16 68, 14 52, 25 52 C33 52, 34 62, 26 63"
                stroke={windColor}
                strokeWidth="4.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Rajada 2: Central nas Costas (mais longa e forte) */}
              <path
                className="wind-gust-2"
                d="M78 102 H18 C6 102, 5 86, 16 86 C23 86, 24 95, 17 96"
                stroke={COLORS.windMain}
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Rajada 3: Inferior (altura das pernas com espiral invertida) */}
              <path
                className="wind-gust-3"
                d="M82 134 H32 C20 134, 20 148, 30 148 C37 148, 37 140, 31 139"
                stroke={windColor}
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />

              {/* Filetes secundários de ar rápido */}
              <line
                className="wind-gust-2"
                x1="74"
                y1="84"
                x2="36"
                y2="84"
                stroke={COLORS.windSoft}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <line
                className="wind-gust-1"
                x1="76"
                y1="118"
                x2="42"
                y2="118"
                stroke={COLORS.windSoft}
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Nuvens de Poeira Impulsionadas pelos Pés */}
              <g className="dust-puff-1" fill={COLORS.dust}>
                <circle cx="58" cy="164" r="7" />
                <circle cx="49" cy="160" r="9" />
                <circle cx="42" cy="166" r="6" />
              </g>
              <g className="dust-puff-2" fill={COLORS.windSoft}>
                <circle cx="38" cy="158" r="6" />
                <circle cx="29" cy="154" r="8" />
              </g>
            </g>
          )}

          {/* ==============================================================
              CORPO DO CORREDOR ARTICULADO
              ============================================================== */}
          <g className="runner-core">
            {/* 1. Braço de Trás (Alterna com a perna da frente) */}
            <g className="limb-back-arm">
              <path
                d="M110 96 L92 110 L104 122"
                stroke={COLORS.suitDark}
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <circle cx="105" cy="123" r="6.5" fill={COLORS.skinShadow} />
            </g>

            {/* 2. Perna de Trás */}
            <g className="limb-back-leg">
              <path
                d="M106 124 L86 144 L72 138"
                stroke={COLORS.suitDark}
                strokeWidth="13"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              {/* Tênis de Trás */}
              <g transform="rotate(-25 70 138)">
                <rect
                  x="60"
                  y="132"
                  width="20"
                  height="11"
                  rx="5.5"
                  fill={COLORS.accentDark}
                />
                <rect
                  x="60"
                  y="140"
                  width="21"
                  height="4"
                  rx="2"
                  fill={COLORS.white}
                />
              </g>
            </g>

            {/* 3. Perna da Frente */}
            <g className="limb-front-leg">
              <path
                d="M110 124 L132 140 L124 158"
                stroke={COLORS.stroke}
                strokeWidth="13"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              {/* Tênis da Frente (Estilo Esportivo) */}
              <g transform="rotate(12 126 160)">
                <rect
                  x="116"
                  y="153"
                  width="22"
                  height="11"
                  rx="5.5"
                  fill={COLORS.accentMain}
                />
                <rect
                  x="116"
                  y="161"
                  width="23"
                  height="4.5"
                  rx="2.2"
                  fill={COLORS.white}
                />
              </g>
            </g>

            {/* 4. Tronco Esportivo Aerodinâmico */}
            <g transform="rotate(10 112 108)">
              {/* Relevo 3D traseiro */}
              <rect
                x="91"
                y="88"
                width="42"
                height="44"
                rx="18"
                fill={COLORS.suitDark}
              />
              {/* Camisa principal */}
              <rect
                x="94"
                y="86"
                width="42"
                height="44"
                rx="18"
                fill={COLORS.suitMain}
              />
              {/* Faixa diagonal esportiva no peito */}
              <path
                d="M98 112 L134 98"
                stroke={COLORS.accentMain}
                strokeWidth="7"
                strokeLinecap="round"
              />
              {/* Brilho frontal */}
              <path
                d="M128 94 C131 102, 131 112, 129 120"
                stroke={COLORS.suitLight}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>

            {/* 5. Cabeça e Faixa de Corredor */}
            {/* Fitas da faixa voando para trás */}
            <g className="headband-tails">
              <path
                d="M98 54 C80 46, 64 52, 50 46"
                stroke={COLORS.accentDark}
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M98 58 C78 56, 62 64, 46 60"
                stroke={COLORS.accentMain}
                strokeWidth="7.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Sombra 3D da cabeça */}
            <circle cx="121" cy="66" r="26" fill={COLORS.skinShadow} />
            {/* Cabeça principal */}
            <circle cx="124" cy="64" r="26" fill={COLORS.skinLight} />

            {/* Orelha */}
            <circle cx="103" cy="67" r="6" fill={COLORS.skinShadow} />

            {/* Bochechas coradas da corrida */}
            <g fill={COLORS.cheek} opacity={mood === "happy" ? "0.7" : "0.45"}>
              <ellipse cx="114" cy="73" rx="5" ry="3.2" />
              <ellipse cx="141" cy="72" rx="4.5" ry="3" />
            </g>

            {/* Cabelo dinâmico puxado pelo vento */}
            <path
              d="M99 54 C96 36, 114 28, 136 33 C144 35, 152 42, 148 51 C138 44, 122 44, 99 54 Z"
              fill={COLORS.suitDark}
            />
            <path
              d="M108 35 C120 26, 138 27, 146 37 C134 34, 120 35, 108 35 Z"
              fill={COLORS.suitMain}
            />

            {/* Faixa Esportiva na Testa */}
            <path
              d="M98 54 Q125 46 149 52"
              stroke={COLORS.accentMain}
              strokeWidth="7.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Expressão Facial Dinâmica */}
            {FACE_BY_MOOD[mood]}

            {/* 6. Braço da Frente (Em balanço atlético) */}
            <g className="limb-front-arm">
              <path
                d="M114 98 L132 112 L146 100"
                stroke={COLORS.suitMain}
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              {/* Punho esportivo (Munhequeira laranja) */}
              <circle cx="144" cy="102" r="6.5" fill={COLORS.accentMain} />
              {/* Mão fechada de corredor */}
              <circle cx="148" cy="98" r="6.5" fill={COLORS.skinLight} />
            </g>
          </g>
        </svg>
      </div>
    );
  }
);

MotivationMascot.displayName = "MotivationMascot";

export default MotivationMascot;
