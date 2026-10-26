import React, { memo } from "react";

export type MentorMood = "idle" | "happy" | "thinking" | "error";

export interface AutonomyMentorMascotProps
  extends React.HTMLAttributes<HTMLDivElement> {
  mood?: MentorMood;
  size?: number;
}

/* ==========================================================================
   1. Tokens de Design (Integrados ao tailwind-colors.css) & Labels
   ========================================================================== */

const COLORS = {
  skinLight: "var(--color-orange-100, #ffe4c4)",
  skinShadow: "var(--color-orange-200, #ffd7a8)",
  robeLight: "var(--color-blue-400, #335779)",
  robeMain: "var(--color-blue-500, #002d58)",
  robeDark: "var(--color-blue-700, #00203e)",
  stroke: "var(--color-blue-800, #001930)",
  goldGlow: "var(--color-orange-50, #fff6ec)",
  goldLight: "var(--color-orange-300, #fec580)",
  goldMain: "var(--color-orange-500, #fea842)",
  goldDark: "var(--color-orange-600, #e7993c)",
  wingSoft: "var(--color-blue-50, #e6eaee)",
  wingBorder: "var(--color-blue-100, #b0becb)",
  cheek: "#ff6b6b",
  white: "#ffffff",
} as const;

const MOOD_LABELS: Record<MentorMood, string> = {
  idle: "Mentor de autonomia entregando a chave alada do protagonismo",
  happy: "Mentor comemorando o voo solo e a autonomia conquistada",
  thinking: "Mentor refletindo sobre a melhor pergunta orientadora",
  error: "Mentor aguardando o momento certo para destravar a autonomia",
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
  r = 4.8,
  pupilOffset = { dx: 1.5, dy: -0.5 },
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

const FACE_BY_MOOD: Record<MentorMood, React.ReactNode> = {
  idle: (
    <>
      {/* Sobrancelhas acolhedoras e sábias */}
      <path
        d="M68 61 Q74 58 80 61"
        stroke={COLORS.stroke}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M92 60 Q98 57 104 60"
        stroke={COLORS.stroke}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <g className="mentor-eyes-blink">
        <Eye cx={74} cy={71} />
        <Eye cx={98} cy={71} />
      </g>
      {/* Sorriso orgulhoso de mentor */}
      <path
        d="M78 83 Q86 90 94 82"
        stroke={COLORS.stroke}
        strokeWidth="3.4"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),

  happy: (
    <>
      {/* Olhos fechados de orgulho (^ ^) */}
      <path
        d="M68 71 Q74 63 80 71"
        stroke={COLORS.stroke}
        strokeWidth="3.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M92 71 Q98 63 104 71"
        stroke={COLORS.stroke}
        strokeWidth="3.6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Sorriso aberto radiante */}
      <path d="M77 81 Q86 94 95 81 Z" fill={COLORS.stroke} />
      <path
        d="M81 87 Q86 90 91 87"
        stroke={COLORS.cheek}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </>
  ),

  thinking: (
    <>
      <path
        d="M68 62 L80 63"
        stroke={COLORS.stroke}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M92 58 Q98 53 104 58"
        stroke={COLORS.stroke}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Eye cx={74} cy={71} pupilOffset={{ dx: 2, dy: -2 }} />
      <Eye cx={98} cy={71} pupilOffset={{ dx: 2, dy: -2 }} />
      <circle cx={88} cy={84} r={3.2} fill={COLORS.stroke} />
    </>
  ),

  error: (
    <>
      <path
        d="M68 64 L80 60"
        stroke={COLORS.stroke}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M104 64 L92 60"
        stroke={COLORS.stroke}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <Eye cx={74} cy={72} pupilOffset={{ dx: 0, dy: 1.5 }} />
      <Eye cx={98} cy={72} pupilOffset={{ dx: 0, dy: 1.5 }} />
      <path
        d="M79 86 Q86 80 93 86"
        stroke={COLORS.stroke}
        strokeWidth="3.4"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),
};

/* ==========================================================================
   3. Estilos de Animação (Postura de Mentor + Chave Alada da Autonomia)
   ========================================================================== */

const ANIMATION_STYLES = `
  /* Respiração serena do Mentor */
  .mentor-svg .mentor-core {
    transform-origin: 84px 172px;
    animation: mentor-breathe 2.6s ease-in-out infinite;
  }
  .mentor-svg[data-mood="happy"] .mentor-core {
    animation: mentor-celebrate 0.6s ease-in-out infinite;
    filter: drop-shadow(0 8px 16px rgba(254, 168, 66, 0.35));
  }
  .mentor-svg[data-mood="thinking"] .mentor-core {
    animation: mentor-nod 2.4s ease-in-out infinite;
  }
  .mentor-svg[data-mood="error"] .mentor-core {
    animation: none;
  }

  /* Braço estendido entregando autonomia */
  .mentor-svg .mentor-arm {
    transform-origin: 104px 110px;
    animation: arm-guide 2.6s ease-in-out infinite;
  }
  .mentor-svg[data-mood="happy"] .mentor-arm {
    animation: arm-release-high 0.6s ease-in-out infinite;
  }

  /* CHAVE ALADA DA AUTONOMIA FLUTUANDO */
  .mentor-svg .floating-key {
    transform-origin: 156px 76px;
    animation: key-levitate 2s ease-in-out infinite;
  }
  .mentor-svg[data-mood="happy"] .floating-key {
    animation: key-soar 0.55s ease-in-out infinite;
  }
  .mentor-svg[data-mood="error"] .floating-key {
    animation: none;
    transform: translateY(14px) rotate(12deg);
    opacity: 0.6;
  }

  /* Bater de asas da Chave da Autonomia */
  .mentor-svg .wing-left {
    transform-origin: 148px 72px;
    animation: wing-flap-l 0.45s ease-in-out infinite alternate;
  }
  .mentor-svg .wing-right {
    transform-origin: 164px 72px;
    animation: wing-flap-r 0.45s ease-in-out infinite alternate;
  }

  /* Ondas de Empoderamento / Confiança partindo da mão do mentor */
  .mentor-svg .trust-wave {
    transform-origin: 156px 76px;
    animation: trust-ripple 2s ease-out infinite;
  }

  /* Sombra no chão */
  .mentor-svg .floor-shadow {
    transform-origin: 84px 180px;
    animation: mentor-shadow 2.6s ease-in-out infinite;
  }

  /* Piscar de olhos */
  .mentor-svg .mentor-eyes-blink {
    transform-origin: 86px 71px;
    animation: mentor-blink 3.6s infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .mentor-svg * { animation: none !important; }
  }

  @keyframes mentor-breathe {
    0%, 100% { transform: translateY(0px) scale(1.01, 0.99); }
    50% { transform: translateY(-6px) scale(0.99, 1.01); }
  }
  @keyframes mentor-celebrate {
    0%, 100% { transform: translateY(0px) scale(1.05, 0.95); }
    50% { transform: translateY(-14px) scale(0.96, 1.04); }
  }
  @keyframes mentor-nod {
    0%, 100% { transform: rotate(-1deg); }
    50% { transform: rotate(2deg) translateY(-3px); }
  }
  @keyframes arm-guide {
    0%, 100% { transform: rotate(2deg); }
    50% { transform: rotate(-8deg) translateY(-2px); }
  }
  @keyframes arm-release-high {
    0%, 100% { transform: rotate(-5deg); }
    50% { transform: rotate(-20deg); }
  }
  @keyframes key-levitate {
    0%, 100% { transform: translateY(4px) rotate(-4deg); }
    50% { transform: translateY(-10px) rotate(4deg); }
  }
  @keyframes key-soar {
    0%, 100% { transform: translateY(-4px) scale(1.06); }
    50% { transform: translateY(-18px) scale(1.14) rotate(6deg); }
  }
  @keyframes wing-flap-l {
    0% { transform: rotate(-12deg) scaleX(0.9); }
    100% { transform: rotate(18deg) scaleX(1.05); }
  }
  @keyframes wing-flap-r {
    0% { transform: rotate(12deg) scaleX(0.9); }
    100% { transform: rotate(-18deg) scaleX(1.05); }
  }
  @keyframes trust-ripple {
    0% { transform: scale(0.5); opacity: 0.85; }
    100% { transform: scale(1.55); opacity: 0; }
  }
  @keyframes mentor-shadow {
    0%, 100% { transform: scale(1); opacity: 0.22; }
    50% { transform: scale(0.88); opacity: 0.14; }
  }
  @keyframes mentor-blink {
    0%, 92%, 100% { transform: scaleY(1); }
    96% { transform: scaleY(0.08); }
  }
`;

/* ==========================================================================
   4. Componente Principal
   ========================================================================== */

export const AutonomyMentorMascot: React.FC<AutonomyMentorMascotProps> = memo(
  ({ mood = "idle", size = 90, className = "", onClick, ...rest }) => {
    const isEmpowering = mood !== "error";

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
          className="mentor-svg overflow-visible"
          data-mood={mood}
        >
          {/* Sombra do Mentor no Chão */}
          <ellipse
            className="floor-shadow"
            cx="84"
            cy="180"
            rx="42"
            ry="7.5"
            fill={COLORS.robeMain}
          />
          {/* Sombra da Chave Flutuante no Chão */}
          <ellipse
            cx="156"
            cy="180"
            rx="16"
            ry="4"
            fill={COLORS.goldMain}
            opacity="0.22"
          />

          {/* ==============================================================
              1. TRILHA DE VOO PRÓPRIO AO FUNDO (ARCO DE EMPODERAMENTO)
              ============================================================== */}
          {isEmpowering && (
            <path
              d="M126 116 C136 96, 146 84, 156 76"
              stroke={COLORS.goldLight}
              strokeWidth="3"
              strokeDasharray="5 5"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* ==============================================================
              2. CORPO DO MENTOR DE AUTONOMIA
              ============================================================== */}
          <g className="mentor-core">
            {/* Capa / Estola Sábia ao Fundo */}
            <path
              d="M58 104 L42 162 Q84 172 124 162 L110 104 Z"
              fill={COLORS.robeDark}
            />

            {/* Braço Esquerdo (Segurando o Livro/Guia da Autonomia junto ao corpo) */}
            <path
              d="M60 108 L44 124 L60 136"
              stroke={COLORS.robeMain}
              strokeWidth="13"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Livro/Manual Dourado de Mentoria */}
            <rect
              x="46"
              y="120"
              width="18"
              height="22"
              rx="4"
              transform="rotate(-12 55 131)"
              fill={COLORS.goldDark}
              stroke={COLORS.stroke}
              strokeWidth="2.5"
            />
            <rect
              x="49"
              y="122"
              width="13"
              height="18"
              rx="2"
              transform="rotate(-12 55 131)"
              fill={COLORS.goldGlow}
            />
            <circle cx="60" cy="134" r="6.5" fill={COLORS.skinLight} />

            {/* Pernas e Calçados */}
            <rect
              x="65"
              y="144"
              width="14"
              height="26"
              rx="7"
              fill={COLORS.robeDark}
            />
            <rect
              x="90"
              y="144"
              width="14"
              height="26"
              rx="7"
              fill={COLORS.robeDark}
            />
            <rect
              x="61"
              y="163"
              width="20"
              height="11"
              rx="5.5"
              fill={COLORS.stroke}
            />
            <rect
              x="88"
              y="163"
              width="20"
              height="11"
              rx="5.5"
              fill={COLORS.stroke}
            />

            {/* Tronco / Traje de Mentor */}
            <rect
              x="56"
              y="102"
              width="56"
              height="48"
              rx="20"
              fill={COLORS.robeDark}
            />
            <rect
              x="56"
              y="97"
              width="56"
              height="46"
              rx="20"
              fill={COLORS.robeMain}
            />

            {/* Cachecol / Estola Laranja de Mentor */}
            <path
              d="M64 95 Q84 108 104 95 L100 134 L84 126 L68 134 Z"
              fill={COLORS.goldDark}
            />
            <path
              d="M66 94 Q84 106 102 94 L98 124 L84 118 L70 124 Z"
              fill={COLORS.goldMain}
            />

            {/* Medalhão de Bússola / Norte no Centro da Estola */}
            <circle cx="84" cy="112" r="7.5" fill={COLORS.goldGlow} />
            <path
              d="M84 106 L86 112 L84 118 L82 112 Z"
              fill={COLORS.robeMain}
            />

            {/* Cabeça e Rosto */}
            {/* Orelhas */}
            <circle cx="55" cy="74" r="6.5" fill={COLORS.skinShadow} />
            <circle cx="113" cy="74" r="6.5" fill={COLORS.skinShadow} />

            {/* Relevo 3D da cabeça */}
            <circle cx="84" cy="74" r="28" fill={COLORS.skinShadow} />
            {/* Cabeça principal */}
            <circle cx="84" cy="70" r="28" fill={COLORS.skinLight} />

            {/* Bochechas */}
            <g fill={COLORS.cheek} opacity={mood === "happy" ? "0.65" : "0.35"}>
              <ellipse cx="64" cy="78" rx="5" ry="3.2" />
              <ellipse cx="106" cy="78" rx="5" ry="3.2" />
            </g>

            {/* Cabelo de Mentor (Com mechas de sabedoria nas têmporas) */}
            <path
              d="M56 62 C55 38, 76 32, 98 35 C108 36, 116 44, 113 58 C104 48, 88 46, 72 50 C64 52, 59 56, 56 62 Z"
              fill={COLORS.robeDark}
            />
            <path
              d="M70 37 C82 28, 100 28, 108 39 C96 36, 84 37, 70 37 Z"
              fill={COLORS.robeMain}
            />
            {/* Mecha prateada de experiência */}
            <path
              d="M58 58 Q64 52 72 54"
              stroke={COLORS.wingBorder}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Expressão Facial */}
            {FACE_BY_MOOD[mood]}

            {/* ÓCULOS ARREDONDADOS DE MENTOR (Aro Dourado) */}
            <g stroke={COLORS.goldDark} strokeWidth="3" fill="none">
              <circle
                cx="74"
                cy="71"
                r="10.5"
                fill={COLORS.white}
                fillOpacity="0.18"
              />
              <circle
                cx="98"
                cy="71"
                r="10.5"
                fill={COLORS.white}
                fillOpacity="0.18"
              />
              {/* Ponte dos óculos */}
              <path d="M84.5 71 H87.5" strokeLinecap="round" />
            </g>

            {/* ============================================================
                3. BRAÇO DIREITO ESTENDIDO (LIBERANDO E EMPODERANDO)
                ============================================================ */}
            <g className="mentor-arm">
              <path
                d="M104 108 L128 96"
                stroke={COLORS.robeMain}
                strokeWidth="13"
                strokeLinecap="round"
              />
              {/* Mão aberta soltando a chave para voar */}
              <circle cx="131" cy="94" r="7" fill={COLORS.skinLight} />
              <path
                d="M134 90 L141 86 M136 95 L143 93"
                stroke={COLORS.skinLight}
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>
          </g>

          {/* ==============================================================
              4. A CHAVE ALADA DA AUTONOMIA (SÍMBOLO DE PROTAGONISMO)
              ============================================================== */}
          <g className="floating-key">
            {/* Aura de Empoderamento ao redor da Chave */}
            {isEmpowering && (
              <>
                <circle
                  className="trust-wave"
                  cx="156"
                  cy="76"
                  r="24"
                  stroke={COLORS.goldMain}
                  strokeWidth="2.5"
                  fill="none"
                />
                <circle
                  cx="156"
                  cy="76"
                  r="22"
                  fill={COLORS.goldGlow}
                  opacity="0.7"
                />
              </>
            )}

            {/* Asinha Esquerda da Chave */}
            <g className="wing-left">
              <path
                d="M148 72 C134 58, 122 64, 128 74 C132 80, 140 78, 148 76 Z"
                fill={COLORS.wingSoft}
                stroke={COLORS.robeMain}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </g>

            {/* Asinha Direita da Chave */}
            <g className="wing-right">
              <path
                d="M164 72 C178 58, 190 64, 184 74 C180 80, 172 78, 164 76 Z"
                fill={COLORS.wingSoft}
                stroke={COLORS.robeMain}
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </g>

            {/* Corpo da Chave Dourada da Autonomia */}
            <g transform="rotate(-15 156 76)">
              {/* Haste e Segredo da Chave */}
              <path
                d="M156 72 V102 M156 94 H164 M156 100 H166"
                stroke={COLORS.goldDark}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M156 72 V102 M156 94 H164 M156 100 H166"
                stroke={COLORS.goldMain}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Cabeça da Chave (Formato de Coroa / Estrela) */}
              <circle cx="156" cy="64" r="11" fill={COLORS.goldDark} />
              <circle cx="156" cy="62" r="10.5" fill={COLORS.goldMain} />
              <circle cx="156" cy="62" r="4.5" fill={COLORS.robeMain} />
            </g>

            {/* Faíscas de Autonomia Desbloqueada */}
            {isEmpowering && (
              <path
                d="M156 36 L158 42 L164 44 L158 46 L156 52 L154 46 L148 44 L154 42 Z"
                fill={COLORS.goldMain}
              />
            )}
          </g>
        </svg>
      </div>
    );
  }
);

AutonomyMentorMascot.displayName = "AutonomyMentorMascot";

export default AutonomyMentorMascot;
