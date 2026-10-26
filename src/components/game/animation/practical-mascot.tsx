import React, { memo } from "react";

export type SolverMood = "idle" | "happy" | "thinking" | "error";

export interface PracticalSolverMascotProps
  extends React.HTMLAttributes<HTMLDivElement> {
  mood?: SolverMood;
  size?: number;
}

/* ==========================================================================
   1. Tokens de Design (Integrados ao tailwind-colors.css) & Labels
   ========================================================================== */

const COLORS = {
  skinLight: "var(--color-orange-100, #ffe4c4)",
  skinShadow: "var(--color-orange-200, #ffd7a8)",
  overallLight: "var(--color-blue-400, #335779)",
  overallMain: "var(--color-blue-500, #002d58)",
  overallDark: "var(--color-blue-700, #00203e)",
  stroke: "var(--color-blue-800, #001930)",
  helmetLight: "var(--color-orange-300, #fec580)",
  helmetMain: "var(--color-orange-500, #fea842)",
  helmetDark: "var(--color-orange-600, #e7993c)",
  woodHandle: "var(--color-orange-700, #b4772f)",
  woodDark: "var(--color-orange-800, #8c5c24)",
  metalLight: "var(--color-blue-50, #e6eaee)",
  metalMain: "var(--color-blue-100, #b0becb)",
  metalDark: "var(--color-blue-300, #54728f)",
  sparkGlow: "var(--color-orange-50, #fff6ec)",
  cheek: "#ff6b6b",
  white: "#ffffff",
} as const;

const MOOD_LABELS: Record<SolverMood, string> = {
  idle: "Solucionador prático construindo e resolvendo com o martelo",
  happy: "Solucionador prático comemorando o problema resolvido",
  thinking: "Solucionador prático medindo e planejando o reparo",
  error: "Solucionador prático diante de uma peça travada",
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

const FACE_BY_MOOD: Record<SolverMood, React.ReactNode> = {
  idle: (
    <>
      {/* Sobrancelhas focadas na execução */}
      <path
        d="M72 64 Q78 61 84 64"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M94 63 Q100 60 106 63"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <g className="solver-eyes-blink">
        <Eye cx={78} cy={73} />
        <Eye cx={100} cy={73} />
      </g>
      {/* Sorriso prático e confiante */}
      <path
        d="M81 83 Q89 90 97 82"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),

  happy: (
    <>
      {/* Olhos fechados de missão cumprida (^ ^) */}
      <path
        d="M72 73 Q78 64 84 73"
        stroke={COLORS.stroke}
        strokeWidth="3.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M94 73 Q100 64 106 73"
        stroke={COLORS.stroke}
        strokeWidth="3.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Boca aberta comemorando */}
      <path d="M80 80 Q89 94 98 80 Z" fill={COLORS.stroke} />
      <path
        d="M84 86 Q89 90 94 86"
        stroke={COLORS.cheek}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </>
  ),

  thinking: (
    <>
      <path
        d="M72 65 L84 66"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M94 60 Q100 55 106 60"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <Eye cx={78} cy={73} pupilOffset={{ dx: 2.2, dy: -2 }} />
      <Eye cx={100} cy={73} pupilOffset={{ dx: 2.2, dy: -2 }} />
      <circle cx={91} cy={84} r={3.3} fill={COLORS.stroke} />
    </>
  ),

  error: (
    <>
      <path
        d="M72 66 L84 62"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M106 66 L94 62"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <Eye cx={78} cy={74} pupilOffset={{ dx: 0, dy: 1.5 }} />
      <Eye cx={100} cy={74} pupilOffset={{ dx: 0, dy: 1.5 }} />
      <path
        d="M82 87 Q89 81 96 87"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),
};

/* ==========================================================================
   3. Estilos de Animação (Martelada Certeira + Faíscas de Impacto + Engrenagem)
   ========================================================================== */

const ANIMATION_STYLES = `
  /* Impulso do corpo acompanhando a força da martelada */
  .solver-svg .solver-core {
    transform-origin: 88px 168px;
    animation: solver-body-work 1.4s ease-in-out infinite;
  }
  .solver-svg[data-mood="happy"] .solver-core {
    animation: solver-celebrate 0.55s ease-in-out infinite;
    filter: drop-shadow(0 8px 16px rgba(254, 168, 66, 0.35));
  }
  .solver-svg[data-mood="thinking"] .solver-core {
    animation: solver-ponder 2.4s ease-in-out infinite;
  }
  .solver-svg[data-mood="error"] .solver-core {
    animation: none;
  }

  /* BRAÇO + MARTELO BATENDO COM PRECISÃO */
  .solver-svg .hammer-arm {
    transform-origin: 108px 106px;
    animation: hammer-strike 1.4s ease-in-out infinite;
  }
  .solver-svg[data-mood="happy"] .hammer-arm {
    animation: hammer-victory 0.55s ease-in-out infinite;
  }
  .solver-svg[data-mood="thinking"] .hammer-arm {
    animation: hammer-tap-think 2.4s ease-in-out infinite;
  }
  .solver-svg[data-mood="error"] .hammer-arm {
    animation: none;
    transform: rotate(28deg);
  }

  /* Faíscas e Ondas de Impacto quando o martelo bate (aos 55% do ciclo) */
  .solver-svg .impact-sparks {
    transform-origin: 156px 136px;
    animation: spark-burst 1.4s ease-out infinite;
  }
  .solver-svg .anvil-target {
    transform-origin: 156px 158px;
    animation: target-compress 1.4s ease-in-out infinite;
  }

  /* Engrenagem de solução girando ao fundo */
  .solver-svg .bg-gear {
    transform-origin: 54px 66px;
    animation: gear-spin 10s linear infinite;
  }
  .solver-svg[data-mood="happy"] .bg-gear {
    animation-duration: 3.5s;
  }
  .solver-svg[data-mood="error"] .bg-gear {
    animation-play-state: paused;
  }

  /* Piscar de olhos */
  .solver-svg .solver-eyes-blink {
    transform-origin: 89px 73px;
    animation: solver-blink 3.5s infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .solver-svg * { animation: none !important; }
  }

  @keyframes solver-body-work {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    35% { transform: translateY(-4px) rotate(-2deg); }
    55% { transform: translateY(2px) rotate(2.5deg) scale(1.02, 0.98); }
  }

  @keyframes solver-celebrate {
    0%, 100% { transform: translateY(0px) scale(1.05, 0.95); }
    50% { transform: translateY(-16px) scale(0.96, 1.04); }
  }

  @keyframes solver-ponder {
    0%, 100% { transform: rotate(-1deg); }
    50% { transform: rotate(1.5deg) translateY(-3px); }
  }

  @keyframes hammer-strike {
    0%, 100% {
      /* Posição neutra */
      transform: rotate(0deg);
    }
    35% {
      /* Prepara o golpe erguendo o martelo para trás/alto */
      transform: rotate(-38deg);
    }
    55% {
      /* Batida rápida e certeira no alvo! */
      transform: rotate(22deg);
    }
    68% {
      /* Leve recuo elástico pós-impacto */
      transform: rotate(14deg);
    }
  }

  @keyframes hammer-victory {
    0%, 100% { transform: rotate(-25deg); }
    50% { transform: rotate(-50deg) translateY(-4px); }
  }

  @keyframes hammer-tap-think {
    0%, 100% { transform: rotate(-18deg); }
    50% { transform: rotate(-26deg); }
  }

  @keyframes spark-burst {
    0%, 48% { transform: scale(0.2); opacity: 0; }
    55% { transform: scale(1.15); opacity: 1; }
    80%, 100% { transform: scale(1.55); opacity: 0; }
  }

  @keyframes target-compress {
    0%, 48%, 75%, 100% { transform: scale(1, 1); }
    55% { transform: scale(1.08, 0.9); }
  }

  @keyframes gear-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes solver-blink {
    0%, 92%, 100% { transform: scaleY(1); }
    96% { transform: scaleY(0.08); }
  }
`;

/* ==========================================================================
   4. Componente Principal
   ========================================================================== */

export const PracticalSolverMascot: React.FC<PracticalSolverMascotProps> = memo(
  ({ mood = "idle", size = 90, className = "", onClick, ...rest }) => {
    const isWorking = mood === "idle";
    const isHappy = mood === "happy";

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
          className="solver-svg overflow-visible"
          data-mood={mood}
        >
          {/* ==============================================================
              1. ENGRENAGEM DE SOLUÇÃO AO FUNDO & SOMBRA DO CHÃO
              ============================================================== */}
          <g className="bg-gear" opacity="0.28">
            <circle
              cx="54"
              cy="66"
              r="24"
              stroke={COLORS.metalMain}
              strokeWidth="8"
            />
            <circle
              cx="54"
              cy="66"
              r="30"
              stroke={COLORS.metalMain}
              strokeWidth="6"
              strokeDasharray="8 11"
            />
          </g>

          {/* Sombra no chão */}
          <ellipse
            cx="106"
            cy="180"
            rx="62"
            ry="8"
            fill={COLORS.overallMain}
            opacity="0.2"
          />

          {/* ==============================================================
              2. BANCADA / BIGORNA DE CONSTRUÇÃO (ALVO DA SOLUÇÃO)
              ============================================================== */}
          <g className="anvil-target">
            {/* Base do Bloco / Projeto Sendo Construído */}
            <rect
              x="134"
              y="144"
              width="44"
              height="32"
              rx="8"
              fill={COLORS.overallDark}
            />
            <rect
              x="134"
              y="140"
              width="44"
              height="28"
              rx="8"
              fill={COLORS.metalDark}
            />
            {/* Topo Metálico da Bancada */}
            <rect
              x="128"
              y="134"
              width="56"
              height="12"
              rx="6"
              fill={COLORS.metalMain}
            />
            {/* Pino / Prego Dourado Sendo Cravado */}
            <rect
              x="151"
              y={isHappy ? "128" : "122"}
              width="10"
              height={isHappy ? "8" : "14"}
              rx="3"
              fill={COLORS.helmetMain}
            />
            <rect
              x="147"
              y={isHappy ? "126" : "120"}
              width="18"
              height="5"
              rx="2.5"
              fill={COLORS.helmetLight}
            />
          </g>

          {/* ==============================================================
              3. PERSONAGEM SOLUCIONADOR PRÁTICO
              ============================================================== */}
          <g className="solver-core">
            {/* Braço Esquerdo (Mão firme na cintura) */}
            <path
              d="M66 108 L48 122 L64 136"
              stroke={COLORS.overallDark}
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="65" cy="136" r="7" fill={COLORS.helmetMain} />

            {/* Pernas e Botas de Segurança */}
            <rect
              x="68"
              y="142"
              width="15"
              height="28"
              rx="7.5"
              fill={COLORS.overallDark}
            />
            <rect
              x="94"
              y="142"
              width="15"
              height="28"
              rx="7.5"
              fill={COLORS.overallDark}
            />
            {/* Botas Robustas com Biqueira Reforçada */}
            <rect
              x="64"
              y="162"
              width="21"
              height="13"
              rx="6"
              fill={COLORS.woodDark}
            />
            <rect
              x="92"
              y="162"
              width="21"
              height="13"
              rx="6"
              fill={COLORS.woodDark}
            />
            <rect
              x="64"
              y="171"
              width="22"
              height="4.5"
              rx="2.2"
              fill={COLORS.stroke}
            />
            <rect
              x="92"
              y="171"
              width="22"
              height="4.5"
              rx="2.2"
              fill={COLORS.stroke}
            />

            {/* Tronco / Camisa de Trabalho + Macacão (Overalls) */}
            {/* Camisa Laranja por baixo */}
            <rect
              x="60"
              y="98"
              width="56"
              height="48"
              rx="20"
              fill={COLORS.helmetDark}
            />
            {/* Jardineira / Macacão Azul Principal */}
            <rect
              x="62"
              y="108"
              width="52"
              height="40"
              rx="16"
              fill={COLORS.overallMain}
            />
            {/* Alças do Macacão com Botões Dourados */}
            <rect
              x="68"
              y="96"
              width="9"
              height="20"
              rx="4"
              fill={COLORS.overallMain}
            />
            <rect
              x="99"
              y="96"
              width="9"
              height="20"
              rx="4"
              fill={COLORS.overallMain}
            />
            <circle cx="72.5" cy="111" r="3" fill={COLORS.helmetMain} />
            <circle cx="103.5" cy="111" r="3" fill={COLORS.helmetMain} />

            {/* Bolso Frontal Utilitário no Peito */}
            <rect
              x="76"
              y="116"
              width="24"
              height="18"
              rx="5"
              fill={COLORS.overallDark}
            />
            <path
              d="M78 122 H98"
              stroke={COLORS.overallLight}
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Cinto de Ferramentas na Cintura */}
            <rect
              x="60"
              y="136"
              width="56"
              height="8"
              rx="4"
              fill={COLORS.woodDark}
            />
            <rect
              x="82"
              y="134"
              width="12"
              height="12"
              rx="3"
              fill={COLORS.helmetMain}
            />

            {/* Cabeça e Rosto */}
            {/* Orelhas */}
            <circle cx="58" cy="75" r="7" fill={COLORS.skinShadow} />
            <circle cx="118" cy="75" r="7" fill={COLORS.skinShadow} />

            {/* Relevo 3D da cabeça */}
            <circle cx="88" cy="75" r="29" fill={COLORS.skinShadow} />
            {/* Cabeça principal */}
            <circle cx="88" cy="71" r="29" fill={COLORS.skinLight} />

            {/* Bochechas */}
            <g fill={COLORS.cheek} opacity={isHappy ? "0.7" : "0.4"}>
              <ellipse cx="67" cy="80" rx="5.5" ry="3.5" />
              <ellipse cx="110" cy="80" rx="5.5" ry="3.5" />
            </g>

            {/* Expressão Facial Dinâmica */}
            {FACE_BY_MOOD[mood]}

            {/* ============================================================
                CAPACETE DE ENGENHEIRO / CONSTRUTOR (HARD HAT 3D)
                ============================================================ */}
            <g>
              {/* Sombra da Aba do Capacete */}
              <path
                d="M52 54 Q88 60 126 54"
                stroke={COLORS.helmetDark}
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Domo Principal do Capacete */}
              <path
                d="M58 53 C58 26, 74 22, 88 22 C102 22, 118 26, 118 53 Z"
                fill={COLORS.helmetMain}
              />
              {/* Crista Central de Reforço do Capacete */}
              <path d="M82 22 H94 L97 52 H79 Z" fill={COLORS.helmetLight} />
              {/* Brilho Lateral */}
              <path
                d="M66 38 C69 31, 75 27, 81 26"
                stroke={COLORS.white}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.85"
              />
              {/* Aba Frontal do Capacete */}
              <path
                d="M53 51 Q88 57 125 51"
                stroke={COLORS.helmetMain}
                strokeWidth="6.5"
                strokeLinecap="round"
              />
            </g>

            {/* ============================================================
                4. BRAÇO DIREITO ARTICULADO + MARTELO DE SOLUCIONADOR
                ============================================================ */}
            <g className="hammer-arm">
              {/* Braço erguendo a ferramenta */}
              <path
                d="M108 106 L132 98"
                stroke={COLORS.overallMain}
                strokeWidth="13"
                strokeLinecap="round"
              />

              {/* MARTELO 3D ESTILO CARTOON */}
              <g transform="rotate(15 136 96)">
                {/* Cabo de Madeira Robusto */}
                <rect
                  x="131"
                  y="60"
                  width="9"
                  height="48"
                  rx="4.5"
                  fill={COLORS.woodDark}
                />
                <rect
                  x="131"
                  y="60"
                  width="6.5"
                  height="46"
                  rx="3.2"
                  fill={COLORS.woodHandle}
                />

                {/* Cabeça Metálica do Martelo (Bloco Principal + Orelha Extratora) */}
                {/* Sombra 3D da cabeça do martelo */}
                <path
                  d="M114 54 H154 C157 54, 159 56, 159 59 V69 C159 72, 157 74, 154 74 H114 L106 69 L114 64 Z"
                  fill={COLORS.metalDark}
                />
                {/* Corpo metálico principal */}
                <path
                  d="M116 51 H152 C155 51, 157 53, 157 56 V66 C157 69, 155 71, 152 71 H116 C111 71, 107 68, 105 64 C109 59, 112 51, 116 51 Z"
                  fill={COLORS.metalMain}
                />
                {/* Batente Frontal Reforçado do Martelo */}
                <rect
                  x="151"
                  y="49"
                  width="9"
                  height="24"
                  rx="4"
                  fill={COLORS.overallDark}
                />
                {/* Brilho Metálico no Topo do Martelo */}
                <path
                  d="M120 55 H146"
                  stroke={COLORS.metalLight}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </g>

              {/* Luva de Segurança Segurando o Cabo do Martelo */}
              <circle cx="135" cy="96" r="8" fill={COLORS.helmetMain} />
              <circle cx="133" cy="95" r="4" fill={COLORS.helmetLight} />
            </g>
          </g>

          {/* ==============================================================
              5. FAÍSCAS DE IMPACTO E CHECK DE PROBLEMA RESOLVIDO
              ============================================================== */}
          {isWorking && (
            <g className="impact-sparks">
              {/* Estrela de Impacto no Ponto de Batida */}
              <path
                d="M156 108 L159 116 L167 119 L159 122 L156 130 L153 122 L145 119 L153 116 Z"
                fill={COLORS.helmetMain}
              />
              {/* Raios de Impacto Laterais */}
              <line
                x1="138"
                y1="114"
                x2="128"
                y2="106"
                stroke={COLORS.helmetMain}
                strokeWidth="4"
                strokeLinecap="round"
              />
              <line
                x1="174"
                y1="114"
                x2="184"
                y2="106"
                stroke={COLORS.helmetMain}
                strokeWidth="4"
                strokeLinecap="round"
              />
              <line
                x1="156"
                y1="102"
                x2="156"
                y2="90"
                stroke={COLORS.helmetLight}
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Selo de Solução Concluída no Modo Happy */}
          {isHappy && (
            <g className="animate-bounce">
              <circle cx="156" cy="96" r="14" fill={COLORS.helmetMain} />
              <path
                d="M150 96 L154.5 100.5 L163 91.5"
                stroke={COLORS.white}
                strokeWidth="3.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
          )}
        </svg>
      </div>
    );
  }
);

PracticalSolverMascot.displayName = "PracticalSolverMascot";

export default PracticalSolverMascot;
