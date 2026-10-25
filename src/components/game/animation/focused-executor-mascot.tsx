import React, { memo } from "react";

export type ExecutorMood = "idle" | "happy" | "thinking" | "error";

export interface FocusedExecutorMascotProps
  extends React.HTMLAttributes<HTMLDivElement> {
  mood?: ExecutorMood;
  size?: number;
}

/* ==========================================================================
   1. Tokens de Design (Integrados ao tailwind-colors.css) & Labels
   ========================================================================== */

const COLORS = {
  visorLight: "var(--color-blue-400, #335779)",
  visorMain: "var(--color-blue-500, #002d58)",
  visorDark: "var(--color-blue-700, #00203e)",
  stroke: "var(--color-blue-800, #001930)",
  irisOuter: "var(--color-orange-600, #e7993c)",
  irisMain: "var(--color-orange-500, #fea842)",
  irisGlow: "var(--color-orange-300, #fec580)",
  laserGlow: "var(--color-orange-50, #fff6ec)",
  scleraShadow: "var(--color-blue-50, #e6eaee)",
  hudRing: "var(--color-blue-100, #b0becb)",
  white: "#ffffff",
} as const;

const MOOD_LABELS: Record<ExecutorMood, string> = {
  idle: "Executor focado com olhos sempre atentos e mira travada no objetivo",
  happy: "Executor focado comemorando o alvo atingido com precisão máxima",
  thinking: "Executor focado escaneando os detalhes e calculando a execução",
  error: "Executor com a visão desfocada tentando recuperar a mira",
};

/* ==========================================================================
   2. Subcomponente de Olho Hiper-Atento (Esclera 3D + Íris + Mira Interna)
   ========================================================================== */

interface FocusedEyeProps {
  cx: number;
  cy: number;
  mood: ExecutorMood;
}

const FocusedEye: React.FC<FocusedEyeProps> = ({ cx, cy, mood }) => {
  const isError = mood === "error";
  const isHappy = mood === "happy";

  return (
    <g>
      {/* Sombra Externa do Globo Ocular (Relevo 3D) */}
      <ellipse cx={cx} cy={cy + 5} rx="32" ry="34" fill={COLORS.stroke} />

      {/* Base da Esclera (Sombra Interna Cinza-Azulada) */}
      <ellipse
        cx={cx}
        cy={cy}
        rx="30"
        ry="32"
        fill={COLORS.scleraShadow}
        stroke={COLORS.stroke}
        strokeWidth="5"
      />

      {/* Parte Branca Iluminada da Esclera */}
      <ellipse cx={cx} cy={cy - 2} rx="28" ry="29" fill={COLORS.white} />

      {/* GRUPO MÓVEL: ÍRIS + PUPILA + REFLEXO DE ALTA PRECISÃO */}
      {isError ? (
        /* Modo Error: Olho em espiral / desfocado */
        <g
          stroke={COLORS.stroke}
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        >
          <path
            d={`M${cx - 8} ${cy - 8} L${cx + 8} ${cy + 8} M${cx + 8} ${
              cy - 8
            } L${cx - 8} ${cy + 8}`}
          />
        </g>
      ) : (
        <g className="eyes-tracking">
          {/* Anel Externo da Íris (Laranja Vibrante de Foco) */}
          <circle cx={cx} cy={cy} r="17" fill={COLORS.irisOuter} />
          <circle cx={cx} cy={cy} r="14.5" fill={COLORS.irisMain} />

          {/* Anel de Mira Tática Dentro da Íris */}
          <circle
            cx={cx}
            cy={cy}
            r="11.5"
            stroke={COLORS.irisGlow}
            strokeWidth="1.5"
            strokeDasharray="4 3"
            fill="none"
          />

          {/* Pupila Dilatada de Foco Absoluto */}
          <circle cx={cx} cy={cy} r="8.5" fill={COLORS.stroke} />

          {/* Se estiver no modo Happy, o centro da pupila vira uma estrela/alvo cravado */}
          {isHappy ? (
            <path
              d={`M${cx} ${cy - 5} L${cx + 1.5} ${cy - 1.5} L${cx + 5} ${cy} L${
                cx + 1.5
              } ${cy + 1.5} L${cx} ${cy + 5} L${cx - 1.5} ${cy + 1.5} L${
                cx - 5
              } ${cy} L${cx - 1.5} ${cy - 1.5} Z`}
              fill={COLORS.irisGlow}
            />
          ) : (
            <circle cx={cx} cy={cy} r="2.2" fill={COLORS.irisMain} />
          )}

          {/* Brilho Specular Duplo (Olhar Vivo e Atento) */}
          <circle cx={cx - 6} cy={cy - 6} r="4.5" fill={COLORS.white} />
          <circle cx={cx + 5} cy={cy + 5} r="2.2" fill={COLORS.white} />
        </g>
      )}

      {/* Pálpebra Superior de Foco (Dá o efeito de olhar afiado / squint) */}
      <path
        className="eyelid-squint"
        d={`M${cx - 31} ${cy - 12} Q${cx} ${cy - 22} ${cx + 31} ${cy - 12} C${
          cx + 28
        } ${cy - 32}, ${cx - 28} ${cy - 32}, ${cx - 31} ${cy - 12} Z`}
        fill={COLORS.visorMain}
      />
    </g>
  );
};

/* ==========================================================================
   3. Estilos de Animação (Rastreamento Ocular + Lock-On + Sobrancelhas)
   ========================================================================== */

const ANIMATION_STYLES = `
  /* Flutuação firme e estável do Executor Focado */
  .executor-svg .executor-core {
    transform-origin: 100px 100px;
    animation: executor-hover 2.4s ease-in-out infinite;
  }
  .executor-svg[data-mood="happy"] .executor-core {
    animation: executor-locked-win 0.55s ease-in-out infinite;
    filter: drop-shadow(0 0 18px rgba(254, 168, 66, 0.55));
  }
  .executor-svg[data-mood="error"] .executor-core {
    animation: executor-blur-shake 0.5s ease-in-out;
  }

  /* MOVIMENTO DOS OLHOS SEMPRE ATENTOS (Escaneia Esquerda -> Direita -> Trava no Centro!) */
  .executor-svg[data-mood="idle"] .eyes-tracking {
    transform-origin: center;
    animation: eye-scan-lock 3.2s cubic-bezier(0.22, 1, 0.36, 1) infinite;
  }
  .executor-svg[data-mood="thinking"] .eyes-tracking {
    animation: eye-rapid-scan 1.4s ease-in-out infinite alternate;
  }
  .executor-svg[data-mood="happy"] .eyes-tracking {
    animation: eye-bullseye-pulse 0.55s ease-in-out infinite alternate;
  }

  /* Sobrancelhas acompanhando a intensidade do foco */
  .executor-svg .brows-focus {
    transform-origin: 100px 64px;
    animation: brow-lock 3.2s cubic-bezier(0.22, 1, 0.36, 1) infinite;
  }
  .executor-svg[data-mood="happy"] .brows-focus {
    transform: translateY(-4px);
    animation: none;
  }

  /* Semi-fechar de pálpebra no momento do Lock-On (Olhar de Águia) */
  .executor-svg[data-mood="idle"] .eyelid-squint {
    animation: squint-lock 3.2s ease-in-out infinite;
  }

  /* MIRA LASER / RETÍCULA DE EXECUÇÃO AO FUNDO E NA FRENTE */
  .executor-svg .target-reticle {
    transform-origin: 100px 100px;
    animation: reticle-lock 3.2s cubic-bezier(0.22, 1, 0.36, 1) infinite;
  }
  .executor-svg[data-mood="happy"] .target-reticle {
    animation: reticle-spin-win 2s linear infinite;
  }

  /* Pulso de Foco Laser quando trava no centro (aos 55%-85% do ciclo) */
  .executor-svg .lock-on-flash {
    transform-origin: 100px 100px;
    animation: flash-ring 3.2s ease-out infinite;
  }

  /* Sombra no chão */
  .executor-svg .floor-shadow {
    transform-origin: center;
    animation: executor-shadow 2.4s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .executor-svg * { animation: none !important; }
  }

  @keyframes executor-hover {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-7px); }
  }

  @keyframes executor-locked-win {
    0%, 100% { transform: translateY(0px) scale(1.04, 0.96); }
    50% { transform: translateY(-14px) scale(0.97, 1.04); }
  }

  @keyframes executor-blur-shake {
    0%, 100% { transform: translateX(0); }
    25%, 75% { transform: translateX(-6px); }
    50% { transform: translateX(6px); }
  }

  /* Ciclo de 3.2s: Olha p/ esquerda -> Olha p/ direita -> TRAVA NO CENTRO e dilata! */
  @keyframes eye-scan-lock {
    0%, 12% { transform: translate(0px, 0px) scale(1); }
    18%, 30% { transform: translate(-8px, -2px) scale(0.96); }
    38%, 50% { transform: translate(8px, -2px) scale(0.96); }
    58%, 88% { transform: translate(0px, 1px) scale(1.1); }
    100% { transform: translate(0px, 0px) scale(1); }
  }

  @keyframes eye-rapid-scan {
    0% { transform: translate(-9px, -3px); }
    50% { transform: translate(0px, 3px); }
    100% { transform: translate(9px, -3px); }
  }

  @keyframes eye-bullseye-pulse {
    0% { transform: scale(1); }
    100% { transform: scale(1.14); }
  }

  @keyframes brow-lock {
    0%, 50%, 100% { transform: translateY(0px); }
    58%, 88% { transform: translateY(5px) scaleX(1.03); }
  }

  @keyframes squint-lock {
    0%, 50%, 100% { transform: translateY(0px); }
    58%, 88% { transform: translateY(3px); }
  }

  @keyframes reticle-lock {
    0%, 50% { transform: rotate(0deg) scale(1.06); opacity: 0.45; }
    58%, 88% { transform: rotate(45deg) scale(0.94); opacity: 1; }
    100% { transform: rotate(90deg) scale(1.06); opacity: 0.45; }
  }

  @keyframes reticle-spin-win {
    from { transform: rotate(0deg) scale(1); }
    to { transform: rotate(360deg) scale(1); }
  }

  @keyframes flash-ring {
    0%, 54% { transform: scale(0.8); opacity: 0; }
    60% { transform: scale(1); opacity: 0.9; }
    88%, 100% { transform: scale(1.35); opacity: 0; }
  }

  @keyframes executor-shadow {
    0%, 100% { transform: scale(1); opacity: 0.24; }
    50% { transform: scale(0.85); opacity: 0.14; }
  }
`;

/* ==========================================================================
   4. Componente Principal
   ========================================================================== */

export const FocusedExecutorMascot: React.FC<FocusedExecutorMascotProps> = memo(
  ({ mood = "idle", size = 90, className = "", onClick, ...rest }) => {
    const isFocused = mood !== "error";

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
          className="executor-svg overflow-visible"
          data-mood={mood}
        >
          {/* Sombra no Chão */}
          <ellipse
            className="floor-shadow"
            cx="100"
            cy="182"
            rx="48"
            ry="7.5"
            fill={COLORS.visorMain}
          />

          {/* ==============================================================
              1. RETÍCULA DE MIRA TÁTICA & ANEL DE LOCK-ON AO FUNDO
              ============================================================== */}
          {isFocused && (
            <g>
              {/* Onda de Pulso quando o olhar trava no centro */}
              <circle
                className="lock-on-flash"
                cx="100"
                cy="100"
                r="72"
                stroke={COLORS.irisMain}
                strokeWidth="3.5"
                fill="none"
              />

              {/* Anel de Mira de Precisão (HUD) */}
              <g className="target-reticle">
                <circle
                  cx="100"
                  cy="100"
                  r="82"
                  stroke={COLORS.hudRing}
                  strokeWidth="2.5"
                  strokeDasharray="18 14"
                />
                {/* Marcadores de Mira nos 4 Cantos (Crosshair) */}
                <path
                  d="M100 10 V24 M100 176 V190 M10 100 H24 M176 100 H190"
                  stroke={COLORS.irisMain}
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </g>
            </g>
          )}

          {/* ==============================================================
              2. CORPO / VISOR DO EXECUTOR FOCADO + OLHOS SEMPRE ATENTOS
              ============================================================== */}
          <g className="executor-core">
            {/* Moldura / Capacete Tático que envolve os Olhos Atentos */}
            {/* Sombra 3D Inferior da Moldura */}
            <rect
              x="22"
              y="56"
              width="156"
              height="94"
              rx="45"
              fill={COLORS.visorDark}
            />
            {/* Corpo Principal Azul da Moldura */}
            <rect
              x="22"
              y="50"
              width="156"
              height="90"
              rx="45"
              fill={COLORS.visorMain}
              stroke={COLORS.stroke}
              strokeWidth="4.5"
            />
            {/* Brilho Superior da Moldura */}
            <path
              d="M52 60 H148"
              stroke={COLORS.visorLight}
              strokeWidth="4.5"
              strokeLinecap="round"
            />

            {/* Faixa Laranja de Foco Máximo na Testa */}
            <path
              d="M36 68 Q100 78 164 68"
              stroke={COLORS.irisMain}
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />

            {/* ============================================================
                OS DOIS OLHOS SEMPRE ATENTOS
                ============================================================ */}
            <FocusedEye cx={66} cy={100} mood={mood} />
            <FocusedEye cx={134} cy={100} mood={mood} />

            {/* ============================================================
                SOBRANCELHAS EXPRESSIVAS DE ALTA CONCENTRAÇÃO
                ============================================================ */}
            <g className="brows-focus">
              {mood === "error" ? (
                /* Sobrancelhas caídas quando perde o foco */
                <>
                  <path
                    d="M34 78 L88 66"
                    stroke={COLORS.stroke}
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  <path
                    d="M166 78 L112 66"
                    stroke={COLORS.stroke}
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                </>
              ) : (
                /* Sobrancelhas firmes anguladas para o centro (Olhar de Águia) */
                <>
                  {/* Sombra das sobrancelhas */}
                  <path
                    d="M34 65 L92 79"
                    stroke={COLORS.stroke}
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  <path
                    d="M166 65 L108 79"
                    stroke={COLORS.stroke}
                    strokeWidth="12"
                    strokeLinecap="round"
                  />
                  {/* Preenchimento Laranja/Dourado nas Sobrancelhas */}
                  <path
                    d="M35 63 L91 77"
                    stroke={COLORS.irisMain}
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M165 63 L109 77"
                    stroke={COLORS.irisMain}
                    strokeWidth="7"
                    strokeLinecap="round"
                  />
                </>
              )}
            </g>

            {/* ============================================================
                CANTONEIRAS DE MIRA HUD (ENQUADRAMENTO DE ALVO)
                ============================================================ */}
            {isFocused && (
              <g
                stroke={COLORS.irisGlow}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              >
                {/* Cantoneira Superior Esquerda */}
                <path d="M18 48 V36 H30" />
                {/* Cantoneira Superior Direita */}
                <path d="M182 48 V36 H170" />
                {/* Cantoneira Inferior Esquerda */}
                <path d="M18 146 V158 H30" />
                {/* Cantoneira Inferior Direita */}
                <path d="M182 146 V158 H170" />
              </g>
            )}

            {/* Emblema Central de Mira Laser entre as Sobrancelhas */}
            <circle
              cx="100"
              cy="62"
              r="7"
              fill={isFocused ? COLORS.irisMain : COLORS.hudRing}
              stroke={COLORS.stroke}
              strokeWidth="2.5"
            />
            {isFocused && (
              <circle cx="100" cy="62" r="2.5" fill={COLORS.laserGlow} />
            )}
          </g>

          {/* ==============================================================
              3. BADGE DE EXECUÇÃO PERFEITA (NO MODO HAPPY)
              ============================================================== */}
          {mood === "happy" && (
            <g className="animate-bounce">
              <circle
                cx="100"
                cy="24"
                r="13"
                fill={COLORS.irisMain}
                stroke={COLORS.stroke}
                strokeWidth="2.5"
              />
              <path
                d="M94 24 L98.5 28.5 L106.5 20"
                stroke={COLORS.white}
                strokeWidth="3.5"
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

FocusedExecutorMascot.displayName = "FocusedExecutorMascot";

export default FocusedExecutorMascot;
