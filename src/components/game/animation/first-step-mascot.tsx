import React, { memo } from "react";

export type FirstStepMood = "idle" | "happy" | "thinking" | "error";

export interface FirstStepMascotProps
  extends React.HTMLAttributes<HTMLDivElement> {
  mood?: FirstStepMood;
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
  accentGlow: "var(--color-orange-50, #fff6ec)",
  accentLight: "var(--color-orange-300, #fec580)",
  accentMain: "var(--color-orange-500, #fea842)",
  accentDark: "var(--color-orange-600, #e7993c)",
  pathBg: "var(--color-blue-50, #e6eaee)",
  pathBorder: "var(--color-blue-100, #b0becb)",
  cheek: "#ff6b6b",
  white: "#ffffff",
} as const;

const MOOD_LABELS: Record<FirstStepMood, string> = {
  idle: "Personagem dando o primeiro passo com determinação",
  happy: "Personagem comemorando a iniciativa do primeiro passo",
  thinking: "Personagem avaliando o caminho antes do primeiro passo",
  error: "Personagem hesitante antes da linha de partida",
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
  pupilOffset = { dx: 1.8, dy: 0.5 },
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

const FACE_BY_MOOD: Record<FirstStepMood, React.ReactNode> = {
  idle: (
    <>
      {/* Sobrancelhas determinadas olhando para o passo à frente */}
      <path
        d="M84 58 Q90 55 96 58"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M104 57 Q110 54 116 57"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <g className="step-eyes-blink">
        <Eye cx={90} cy={67} />
        <Eye cx={110} cy={67} />
      </g>
      {/* Sorriso confiante de quem começou */}
      <path
        d="M93 77 Q100 84 108 76"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),

  happy: (
    <>
      {/* Olhos felizes (^ ^) */}
      <path
        d="M84 68 Q90 59 96 68"
        stroke={COLORS.stroke}
        strokeWidth="3.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M104 68 Q110 59 116 68"
        stroke={COLORS.stroke}
        strokeWidth="3.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Boca aberta comemorando */}
      <path d="M91 75 Q100 89 109 75 Z" fill={COLORS.stroke} />
      <path
        d="M95 81 Q100 85 105 81"
        stroke={COLORS.cheek}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </>
  ),

  thinking: (
    <>
      <path
        d="M84 59 L96 60"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M104 55 Q110 50 116 55"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <Eye cx={90} cy={67} pupilOffset={{ dx: 2.2, dy: 1.5 }} />
      <Eye cx={110} cy={67} pupilOffset={{ dx: 2.2, dy: 1.5 }} />
      <circle cx={102} cy={78} r={3.2} fill={COLORS.stroke} />
    </>
  ),

  error: (
    <>
      {/* Sobrancelhas inseguras */}
      <path
        d="M84 60 L96 57"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M116 60 L104 57"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <Eye cx={90} cy={68} pupilOffset={{ dx: -1, dy: 1 }} />
      <Eye cx={110} cy={68} pupilOffset={{ dx: -1, dy: 1 }} />
      <path
        d="M94 81 Q100 75 106 81"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),
};

/* ==========================================================================
   3. Estilos de Animação (O Primeiro Passo + Ondas de Impacto no Marco 1)
   ========================================================================== */

const ANIMATION_STYLES = `
  /* Movimento do tronco inclinando para dar o primeiro passo */
  .step-svg .stepper-core {
    transform-origin: 84px 135px;
    animation: body-lean-step 1.8s ease-in-out infinite;
  }
  .step-svg[data-mood="happy"] .stepper-core {
    animation-duration: 1.1s;
    filter: drop-shadow(0 8px 16px rgba(254, 168, 66, 0.35));
  }
  .step-svg[data-mood="thinking"] .stepper-core {
    animation: body-hesitate 2.4s ease-in-out infinite;
  }
  .step-svg[data-mood="error"] .stepper-core {
    animation: none;
    transform: translateX(-4px);
  }

  /* Perna da Frente erguendo e pisando no Marco #1 */
  .step-svg .stepping-leg {
    transform-origin: 96px 128px;
    animation: take-first-step 1.8s ease-in-out infinite;
  }
  .step-svg[data-mood="happy"] .stepping-leg {
    animation-duration: 1.1s;
  }
  .step-svg[data-mood="thinking"] .stepping-leg {
    animation: leg-hover-think 2.4s ease-in-out infinite;
  }
  .step-svg[data-mood="error"] .stepping-leg {
    animation: none;
    transform: rotate(12deg) translate(-10px, -4px);
  }

  /* Braço da frente acompanhando o equilíbrio do passo */
  .step-svg .lead-arm {
    transform-origin: 100px 98px;
    animation: arm-balance 1.8s ease-in-out infinite;
  }
  .step-svg[data-mood="happy"] .lead-arm {
    animation-duration: 1.1s;
  }

  /* Ondas de impacto (Ripple) quando o pé toca o Marco #1 */
  .step-svg .step-ripple-1 {
    transform-origin: 136px 168px;
    animation: pad-ripple 1.8s ease-out infinite;
  }
  .step-svg .step-ripple-2 {
    transform-origin: 136px 168px;
    animation: pad-ripple 1.8s ease-out infinite 0.25s;
  }
  .step-svg[data-mood="happy"] .step-ripple-1,
  .step-svg[data-mood="happy"] .step-ripple-2 {
    animation-duration: 1.1s;
  }

  /* Brilho do Marco #1 quando pisado */
  .step-svg .milestone-pad {
    transform-origin: 136px 168px;
    animation: pad-glow 1.8s ease-in-out infinite;
  }
  .step-svg[data-mood="happy"] .milestone-pad {
    animation-duration: 1.1s;
  }

  /* Estrela de iniciativa piscando à frente */
  .step-svg .initiative-sparkle {
    transform-origin: 164px 128px;
    animation: sparkle-burst 1.8s ease-in-out infinite;
  }

  /* Piscar de olhos */
  .step-svg .step-eyes-blink {
    transform-origin: 100px 67px;
    animation: step-blink 3.5s infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .step-svg * { animation: none !important; }
  }

  @keyframes body-lean-step {
    0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
    35% { transform: translate(3px, -6px) rotate(3deg); }
    65%, 85% { transform: translate(8px, 1px) rotate(5deg); }
  }
  @keyframes body-hesitate {
    0%, 100% { transform: translateX(0px); }
    50% { transform: translateX(3px) rotate(2deg); }
  }
  @keyframes take-first-step {
    0%, 100% {
      /* Pé recuado antes de dar o passo */
      transform: rotate(16deg) translate(-12px, -6px);
    }
    35% {
      /* Joelho erguido no ar preparando a pisada */
      transform: rotate(-18deg) translate(2px, -14px);
    }
    65%, 85% {
      /* Pé firme cravando o Primeiro Passo no chão! */
      transform: rotate(0deg) translate(0px, 0px);
    }
  }
  @keyframes leg-hover-think {
    0%, 100% { transform: rotate(10deg) translate(-8px, -4px); }
    50% { transform: rotate(-12deg) translate(0px, -10px); }
  }
  @keyframes arm-balance {
    0%, 100% { transform: rotate(8deg); }
    35% { transform: rotate(-16deg); }
    65%, 85% { transform: rotate(-6deg); }
  }
  @keyframes pad-ripple {
    0%, 58% { transform: scale(0.7); opacity: 0; }
    65% { transform: scale(0.95); opacity: 0.95; }
    100% { transform: scale(1.75); opacity: 0; }
  }
  @keyframes pad-glow {
    0%, 55%, 100% { transform: scale(1); }
    65%, 80% { transform: scale(1.08); }
  }
  @keyframes sparkle-burst {
    0%, 55%, 100% { transform: scale(0.4) rotate(0deg); opacity: 0.2; }
    70% { transform: scale(1.25) rotate(25deg); opacity: 1; }
  }
  @keyframes step-blink {
    0%, 92%, 100% { transform: scaleY(1); }
    96% { transform: scaleY(0.08); }
  }
`;

/* ==========================================================================
   4. Componente Principal
   ========================================================================== */

export const FirstStepMascot: React.FC<FirstStepMascotProps> = memo(
  ({ mood = "idle", size = 220, className = "", onClick, ...rest }) => {
    const isStepping = mood === "idle" || mood === "happy";

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
          className="step-svg overflow-visible"
          data-mood={mood}
        >
          {/* ==============================================================
              1. TRILHA INICIAL, LINHA DE LARGADA E MARCO DO 1º PASSO
              ============================================================== */}
          {/* Caminho / Estrada que se abre à frente */}
          <ellipse cx="108" cy="170" rx="76" ry="13" fill={COLORS.pathBg} />
          <path
            d="M44 170 H174"
            stroke={COLORS.pathBorder}
            strokeWidth="3"
            strokeDasharray="6 6"
            strokeLinecap="round"
          />

          {/* Linha de Partida (Start Line) */}
          <path
            d="M96 158 L106 182"
            stroke={COLORS.suitLight}
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Ondas de Impacto Concêntricas (Ativadas quando o pé toca o chão) */}
          {isStepping && (
            <>
              <ellipse
                className="step-ripple-1"
                cx="136"
                cy="168"
                rx="26"
                ry="8"
                stroke={COLORS.accentMain}
                strokeWidth="3.5"
                fill="none"
              />
              <ellipse
                className="step-ripple-2"
                cx="136"
                cy="168"
                rx="22"
                ry="6.5"
                stroke={COLORS.accentLight}
                strokeWidth="2.5"
                fill="none"
              />
            </>
          )}

          {/* Spot Luminoso do 1º Passo (Alvo no chão) */}
          <g className="milestone-pad">
            <ellipse
              cx="136"
              cy="170"
              rx="25"
              ry="8"
              fill={COLORS.accentDark}
            />
            <ellipse
              cx="136"
              cy="167"
              rx="25"
              ry="7.5"
              fill={COLORS.accentMain}
            />
            <ellipse
              cx="136"
              cy="166"
              rx="16"
              ry="4.5"
              fill={COLORS.accentGlow}
              opacity="0.7"
            />
          </g>

          {/* Sombra do Pé de Apoio Traseiro */}
          <ellipse
            cx="72"
            cy="170"
            rx="20"
            ry="5.5"
            fill={COLORS.suitMain}
            opacity="0.22"
          />

          {/* ==============================================================
              2. PERSONAGEM DANDO O PRIMEIRO PASSO
              ============================================================== */}
          <g className="stepper-core">
            {/* Braço de Trás (Dando impulso) */}
            <path
              d="M84 98 L66 116 L56 112"
              stroke={COLORS.suitDark}
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="55" cy="111" r="6.5" fill={COLORS.skinShadow} />

            {/* Perna de Apoio Traseira (Firme atrás da linha de largada) */}
            <path
              d="M82 128 L74 150 L68 164"
              stroke={COLORS.suitDark}
              strokeWidth="13"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Tênis Traseiro */}
            <rect
              x="58"
              y="160"
              width="22"
              height="10"
              rx="5"
              fill={COLORS.stroke}
            />
            <rect
              x="58"
              y="167"
              width="22"
              height="3.5"
              rx="1.75"
              fill={COLORS.white}
            />

            {/* Tronco com Mochila/Insígnia de Iniciante */}
            {/* Mochila de Jornada nas costas */}
            <rect
              x="60"
              y="88"
              width="20"
              height="32"
              rx="8"
              fill={COLORS.accentDark}
            />
            <rect
              x="62"
              y="86"
              width="18"
              height="28"
              rx="7"
              fill={COLORS.accentMain}
            />

            {/* Sombra 3D do Tronco */}
            <rect
              x="71"
              y="88"
              width="42"
              height="45"
              rx="18"
              fill={COLORS.suitDark}
            />
            {/* Corpo Principal do Tronco */}
            <rect
              x="73"
              y="85"
              width="42"
              height="44"
              rx="18"
              fill={COLORS.suitMain}
            />

            {/* Detalhe no Peito: Número "1" / Seta de Início */}
            <path
              d="M95 98 L101 98 L101 114"
              stroke={COLORS.accentMain}
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M95 114 H105"
              stroke={COLORS.accentMain}
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* Perna da Frente (Articulada: Ergue e Crava o 1º Passo!) */}
            <g className="stepping-leg">
              <path
                d="M98 128 L120 144 L130 160"
                stroke={COLORS.stroke}
                strokeWidth="13.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              {/* Tênis de Destaque do Primeiro Passo */}
              <g transform="rotate(4 134 162)">
                <rect
                  x="122"
                  y="154"
                  width="26"
                  height="12"
                  rx="6"
                  fill={COLORS.accentMain}
                />
                {/* Listras esportivas do tênis */}
                <path
                  d="M132 156 L136 162"
                  stroke={COLORS.suitMain}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Sola branca grossa */}
                <rect
                  x="121"
                  y="163"
                  width="28"
                  height="4.5"
                  rx="2.2"
                  fill={COLORS.white}
                />
              </g>
            </g>

            {/* Cabeça e Expressão */}
            {/* Orelha */}
            <circle cx="71" cy="68" r="6.5" fill={COLORS.skinShadow} />

            {/* Relevo 3D da cabeça */}
            <circle cx="95" cy="67" r="26" fill={COLORS.skinShadow} />
            {/* Cabeça Principal */}
            <circle cx="97" cy="64" r="26" fill={COLORS.skinLight} />

            {/* Bochechas */}
            <g fill={COLORS.cheek} opacity={mood === "happy" ? "0.7" : "0.4"}>
              <ellipse cx="83" cy="73" rx="5.5" ry="3.5" />
              <ellipse cx="115" cy="73" rx="5" ry="3.2" />
            </g>

            {/* Cabelo / Topete Moderno */}
            <path
              d="M72 56 C70 36, 90 28, 112 33 C122 35, 128 43, 124 52 C114 45, 96 44, 72 56 Z"
              fill={COLORS.suitDark}
            />
            <path
              d="M84 35 C96 26, 114 27, 122 38 C110 34, 96 35, 84 35 Z"
              fill={COLORS.suitMain}
            />

            {/* Expressão Facial Dinâmica */}
            {FACE_BY_MOOD[mood]}

            {/* Braço da Frente (Avançando com determinação) */}
            <g className="lead-arm">
              <path
                d="M98 98 L116 112 L130 104"
                stroke={COLORS.suitMain}
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              {/* Punho fechado com determinação */}
              <circle cx="132" cy="103" r="7" fill={COLORS.skinLight} />
            </g>
          </g>

          {/* ==============================================================
              3. PARTÍCULAS DE CONQUISTA DO 1º PASSO
              ============================================================== */}
          {isStepping && (
            <g>
              {/* Estrela brilhando logo acima do pé que dá o passo */}
              <path
                className="initiative-sparkle"
                d="M164 118 L166.5 125.5 L174 128 L166.5 130.5 L164 138 L161.5 130.5 L154 128 L161.5 125.5 Z"
                fill={COLORS.accentMain}
              />
              {/* Bolinhas de pensamento quando mood="thinking" */}
            </g>
          )}

          {mood === "thinking" && (
            <g fill={COLORS.accentMain} className="animate-pulse">
              <circle cx="138" cy="52" r="4" />
              <circle cx="150" cy="40" r="6" />
              <circle cx="164" cy="26" r="8.5" />
            </g>
          )}
        </svg>
      </div>
    );
  }
);

FirstStepMascot.displayName = "FirstStepMascot";

export default FirstStepMascot;
