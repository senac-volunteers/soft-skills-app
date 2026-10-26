import React, { memo } from "react";

export type LeaderMood = "idle" | "happy" | "thinking" | "error";

export interface LeaderMascotProps
  extends React.HTMLAttributes<HTMLDivElement> {
  mood?: LeaderMood;
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
  capeLight: "var(--color-orange-400, #feb968)",
  capeMain: "var(--color-orange-500, #fea842)",
  capeDark: "var(--color-orange-600, #e7993c)",
  cheek: "#ff6b6b",
  white: "#ffffff",
} as const;

const MOOD_LABELS: Record<LeaderMood, string> = {
  idle: "Líder apontando para cima confiante",
  happy: "Líder comemorando no topo",
  thinking: "Líder planejando estratégia",
  error: "Líder desapontado",
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
  r = 5.5,
  pupilOffset = { dx: 1.5, dy: -2 },
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

const FACE_BY_MOOD: Record<LeaderMood, React.ReactNode> = {
  idle: (
    <>
      {/* Sobrancelhas confiantes */}
      <path
        d="M80 62 Q86 59 92 62"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M108 60 Q114 56 120 60"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Olhos olhando levemente para o dedo apontado */}
      <g className="leader-eyes-blink">
        <Eye cx={86} cy={72} />
        <Eye cx={114} cy={72} />
      </g>
      {/* Sorriso confiante */}
      <path
        d="M92 83 Q100 91 109 82"
        stroke={COLORS.stroke}
        strokeWidth="3.8"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),

  happy: (
    <>
      {/* Olhos fechados de celebração (^ ^) */}
      <path
        d="M80 73 Q86 64 92 73"
        stroke={COLORS.stroke}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M108 73 Q114 64 120 73"
        stroke={COLORS.stroke}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Boca aberta vitoriosa */}
      <path d="M90 81 Q100 97 110 81 Z" fill={COLORS.stroke} />
      <path
        d="M95 88 Q100 92 105 88"
        stroke={COLORS.cheek}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </>
  ),

  thinking: (
    <>
      {/* Sobrancelha arqueada analisando */}
      <path
        d="M80 63 L92 64"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M108 58 Q114 53 120 58"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <Eye cx={86} cy={72} pupilOffset={{ dx: 2.5, dy: -2.5 }} />
      <Eye cx={114} cy={72} pupilOffset={{ dx: 2.5, dy: -2.5 }} />
      {/* Boca pensativa */}
      <circle cx={103} cy={85} r={3.5} fill={COLORS.stroke} />
    </>
  ),

  error: (
    <>
      {/* Sobrancelhas caídas */}
      <path
        d="M80 65 L92 61"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M120 65 L108 61"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <Eye cx={86} cy={74} pupilOffset={{ dx: 0, dy: 1.5 }} />
      <Eye cx={114} cy={74} pupilOffset={{ dx: 0, dy: 1.5 }} />
      {/* Boca triste */}
      <path
        d="M93 88 Q100 81 107 88"
        stroke={COLORS.stroke}
        strokeWidth="3.8"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),
};

/* ==========================================================================
   3. Estilos de Animação Isolados
   ========================================================================== */

const ANIMATION_STYLES = `
  .leader-svg .leader-body {
    transform-origin: 100px 170px;
  }
  .leader-svg[data-mood="idle"] .leader-body {
    animation: leader-breathe 2.2s ease-in-out infinite;
  }
  .leader-svg[data-mood="happy"] .leader-body {
    animation: leader-jump 0.55s ease-in-out infinite;
    filter: drop-shadow(0 8px 16px rgba(254, 168, 66, 0.35));
  }
  .leader-svg[data-mood="thinking"] .leader-body {
    animation: leader-sway 2.6s ease-in-out infinite;
  }
  .leader-svg[data-mood="error"] .leader-body {
    animation: leader-shake 0.5s ease-in-out;
  }

  /* Animação do braço apontando para cima */
  .leader-svg .pointing-arm {
    transform-origin: 126px 112px;
    animation: arm-point-up 1.4s ease-in-out infinite;
  }
  .leader-svg[data-mood="happy"] .pointing-arm {
    animation: arm-point-excited 0.55s ease-in-out infinite;
  }
  .leader-svg[data-mood="error"] .pointing-arm {
    transform: rotate(18deg) translateY(6px);
    animation: none;
  }

  /* Capa esvoaçante */
  .leader-svg .leader-cape {
    transform-origin: 100px 106px;
    animation: cape-wave 1.8s ease-in-out infinite;
  }

  /* Sombra do chão */
  .leader-svg .floor-shadow {
    transform-origin: center;
    animation: leader-shadow 2.2s ease-in-out infinite;
  }
  .leader-svg[data-mood="happy"] .floor-shadow {
    animation: leader-shadow-jump 0.55s ease-in-out infinite;
  }

  /* Piscar de olhos */
  .leader-svg .leader-eyes-blink {
    transform-origin: 100px 72px;
    animation: leader-blink 3.5s infinite;
  }

  /* Brilho na ponta do dedo indicador */
  .leader-svg .finger-sparkle {
    transform-origin: 152px 20px;
    animation: tip-twinkle 1.4s ease-in-out infinite;
  }

  /* Setas de subida no modo Happy */
  .leader-svg .up-arrow-1 {
    animation: arrow-rise 1.1s ease-out infinite;
  }
  .leader-svg .up-arrow-2 {
    animation: arrow-rise 1.1s ease-out infinite 0.55s;
  }

  @media (prefers-reduced-motion: reduce) {
    .leader-svg * { animation: none !important; }
  }

  @keyframes leader-breathe {
    0%, 100% { transform: translateY(0px) scale(1.02, 0.98); }
    50% { transform: translateY(-6px) scale(0.99, 1.02); }
  }
  @keyframes leader-jump {
    0%, 100% { transform: translateY(0px) scale(1.06, 0.94); }
    50% { transform: translateY(-18px) scale(0.95, 1.05); }
  }
  @keyframes leader-sway {
    0%, 100% { transform: rotate(-1.5deg); }
    50% { transform: rotate(2deg) translateY(-3px); }
  }
  @keyframes leader-shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-6px) rotate(-2deg); }
    40%, 80% { transform: translateX(6px) rotate(2deg); }
  }
  @keyframes arm-point-up {
    0%, 100% { transform: rotate(0deg) translateY(0px); }
    50% { transform: rotate(-7deg) translateY(-6px); }
  }
  @keyframes arm-point-excited {
    0%, 100% { transform: rotate(4deg) translateY(2px); }
    50% { transform: rotate(-12deg) translateY(-10px); }
  }
  @keyframes cape-wave {
    0%, 100% { transform: skewX(-2deg) scaleX(0.98); }
    50% { transform: skewX(4deg) scaleX(1.04); }
  }
  @keyframes leader-shadow {
    0%, 100% { transform: scale(1); opacity: 0.24; }
    50% { transform: scale(0.88); opacity: 0.16; }
  }
  @keyframes leader-shadow-jump {
    0%, 100% { transform: scale(1.05); opacity: 0.28; }
    50% { transform: scale(0.65); opacity: 0.1; }
  }
  @keyframes leader-blink {
    0%, 92%, 100% { transform: scaleY(1); }
    96% { transform: scaleY(0.08); }
  }
  @keyframes tip-twinkle {
    0%, 100% { transform: scale(0.55) rotate(0deg); opacity: 0.35; }
    50% { transform: scale(1.25) rotate(25deg); opacity: 1; }
  }
  @keyframes arrow-rise {
    0% { transform: translateY(10px); opacity: 0; }
    40% { opacity: 1; }
    100% { transform: translateY(-18px); opacity: 0; }
  }
`;

/* ==========================================================================
   4. Componente Principal
   ========================================================================== */

export const LeaderMascot: React.FC<LeaderMascotProps> = memo(
  ({ mood = "idle", size = 90, className = "", onClick, ...rest }) => {
    const showSparkle = mood === "idle" || mood === "happy";

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
          className="leader-svg overflow-visible"
          data-mood={mood}
        >
          {/* Sombra no chão */}
          <ellipse
            className="floor-shadow"
            cx="100"
            cy="182"
            rx="44"
            ry="8"
            fill={COLORS.suitMain}
          />

          {/* Setas de Subida / Liderança (Modo Happy) */}
          {mood === "happy" && (
            <g
              stroke={COLORS.capeMain}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path className="up-arrow-1" d="M36 96 L44 88 L52 96" />
              <path className="up-arrow-2" d="M36 72 L44 64 L52 72" />
            </g>
          )}

          {/* Bolinhas de Estratégia (Modo Thinking) */}
          {mood === "thinking" && (
            <g fill={COLORS.capeMain} className="animate-pulse">
              <circle cx="52" cy="58" r="4" />
              <circle cx="42" cy="44" r="6" />
              <circle cx="32" cy="28" r="8.5" />
            </g>
          )}

          {/* Estrela piscando na ponta do dedo indicador */}
          {showSparkle && (
            <path
              className="finger-sparkle"
              d="M152 6 L155 16 L165 20 L155 24 L152 34 L149 24 L139 20 L149 16 Z"
              fill={COLORS.capeMain}
            />
          )}

          {/* Grupo Principal do Personagem */}
          <g className="leader-body">
            {/* 1. Capa de Líder (Ao fundo) */}
            <g className="leader-cape">
              <path
                d="M76 106 L52 165 Q100 176 146 165 L124 106 Z"
                fill={COLORS.capeDark}
              />
              <path
                d="M76 104 L56 158 Q100 168 142 158 L124 104 Z"
                fill={COLORS.capeMain}
              />
            </g>

            {/* 2. Braço Esquerdo (Mão na cintura - Pose confiante) */}
            <path
              d="M76 112 L56 128 L75 142"
              stroke={COLORS.suitDark}
              strokeWidth="15"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M76 110 L58 126 L75 140"
              stroke={COLORS.suitMain}
              strokeWidth="13"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="74" cy="140" r="7" fill={COLORS.skinShadow} />

            {/* 3. Pernas e Botas */}
            <rect
              x="80"
              y="146"
              width="15"
              height="28"
              rx="7.5"
              fill={COLORS.suitDark}
            />
            <rect
              x="105"
              y="146"
              width="15"
              height="28"
              rx="7.5"
              fill={COLORS.suitDark}
            />
            {/* Base das botas */}
            <rect
              x="76"
              y="165"
              width="20"
              height="11"
              rx="5.5"
              fill={COLORS.stroke}
            />
            <rect
              x="104"
              y="165"
              width="20"
              height="11"
              rx="5.5"
              fill={COLORS.stroke}
            />

            {/* 4. Tronco / Traje de Líder */}
            {/* Sombra 3D do tronco */}
            <rect
              x="71"
              y="104"
              width="58"
              height="52"
              rx="22"
              fill={COLORS.suitDark}
            />
            {/* Corpo principal do tronco */}
            <rect
              x="71"
              y="98"
              width="58"
              height="50"
              rx="22"
              fill={COLORS.suitMain}
            />
            {/* Highlight lateral do traje */}
            <path
              d="M78 110 C78 120, 78 130, 80 136"
              stroke={COLORS.suitLight}
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Gola V / Colarinho */}
            <path d="M88 99 L100 114 L112 99 Z" fill={COLORS.capeMain} />
            {/* Cinto de Liderança */}
            <rect
              x="72"
              y="138"
              width="56"
              height="7"
              rx="3.5"
              fill={COLORS.capeDark}
            />
            <rect
              x="93"
              y="136"
              width="14"
              height="11"
              rx="3"
              fill={COLORS.capeLight}
            />

            {/* Insígnia de Estrela no Peito */}
            <path
              d="M100 117 L102.5 122.5 L108.5 123.2 L104 127.2 L105.2 133 L100 130 L94.8 133 L96 127.2 L91.5 123.2 L97.5 122.5 Z"
              fill={COLORS.capeLight}
            />

            {/* 5. Cabeça e Rosto */}
            {/* Orelhas */}
            <circle cx="67" cy="74" r="7.5" fill={COLORS.skinShadow} />
            <circle cx="133" cy="74" r="7.5" fill={COLORS.skinShadow} />

            {/* Relevo 3D da cabeça */}
            <circle cx="100" cy="74" r="32" fill={COLORS.skinShadow} />
            {/* Cabeça principal */}
            <circle cx="100" cy="69" r="32" fill={COLORS.skinLight} />

            {/* Bochechas */}
            <g fill={COLORS.cheek} opacity={mood === "happy" ? "0.65" : "0.35"}>
              <ellipse cx="77" cy="79" rx="6" ry="3.8" />
              <ellipse cx="123" cy="79" rx="6" ry="3.8" />
            </g>

            {/* Cabelo Estilizado + Coroa/Topete de Líder */}
            <path
              d="M68 62 C68 38, 92 32, 114 35 C125 36, 134 45, 132 58 C122 48, 106 46, 88 50 C78 52, 72 56, 68 62 Z"
              fill={COLORS.suitDark}
            />
            <path
              d="M84 37 C96 26, 118 26, 126 39 C114 36, 100 38, 84 37 Z"
              fill={COLORS.suitMain}
            />
            {/* Brilho no cabelo */}
            <path
              d="M84 42 Q102 36 118 41"
              stroke={COLORS.suitLight}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Expressão Facial Dinâmica */}
            {FACE_BY_MOOD[mood]}

            {/* 6. Braço Direito Erguido + Dedo Apontando para Cima */}
            <g className="pointing-arm">
              {/* Sombra do braço erguido */}
              <path
                d="M126 112 L152 68"
                stroke={COLORS.suitDark}
                strokeWidth="16"
                strokeLinecap="round"
              />
              {/* Manga azul do braço erguido */}
              <path
                d="M124 110 L150 66"
                stroke={COLORS.suitMain}
                strokeWidth="14"
                strokeLinecap="round"
              />
              {/* Punho da camisa */}
              <ellipse
                cx="151"
                cy="65"
                rx="9"
                ry="5"
                transform="rotate(-30 151 65)"
                fill={COLORS.capeMain}
              />

              {/* Mão e Dedo Indicador Apontado para o Alto */}
              {/* Sombra da mão */}
              <circle cx="153" cy="56" r="10.5" fill={COLORS.skinShadow} />
              {/* Dedo Indicador Esticado para Cima (com borda sutil para destaque) */}
              <rect
                x="146.5"
                y="29.5"
                width="11"
                height="25"
                rx="5.5"
                fill={COLORS.skinShadow}
              />
              <rect
                x="147.5"
                y="30"
                width="9"
                height="24"
                rx="4.5"
                fill={COLORS.skinLight}
              />
              {/* Palma / Mão fechada */}
              <circle cx="152" cy="55" r="10" fill={COLORS.skinLight} />
              {/* Dedos dobrados (detalhe estilo cartoon) */}
              <circle cx="159" cy="51" r="4.5" fill={COLORS.skinShadow} />
              <circle cx="160" cy="57" r="4.2" fill={COLORS.skinShadow} />
              {/* Polegar segurando */}
              <ellipse
                cx="147"
                cy="53"
                rx="5.5"
                ry="3.8"
                transform="rotate(-20 147 53)"
                fill={COLORS.skinShadow}
              />
            </g>
          </g>
        </svg>
      </div>
    );
  }
);

LeaderMascot.displayName = "LeaderMascot";

export default LeaderMascot;
