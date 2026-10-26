import React, { memo } from "react";

export type ConsistencyMood = "idle" | "happy" | "thinking" | "error";

export interface ConsistencyMascotProps
  extends React.HTMLAttributes<HTMLDivElement> {
  mood?: ConsistencyMood;
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
  flameGlow: "var(--color-orange-50, #fff6ec)",
  flameLight: "var(--color-orange-300, #fec580)",
  flameMain: "var(--color-orange-500, #fea842)",
  flameDark: "var(--color-orange-600, #e7993c)",
  ringTrack: "var(--color-blue-100, #b0becb)",
  ringSoft: "var(--color-blue-50, #e6eaee)",
  cheek: "#ff6b6b",
  white: "#ffffff",
} as const;

const MOOD_LABELS: Record<ConsistencyMood, string> = {
  idle: "Mascote da constância mantendo o ritmo diário e a chama acesa",
  happy: "Mascote comemorando uma sequência perfeita de constância",
  thinking: "Mascote planejando a rotina para manter a constância",
  error: "Mascote com a sequência pausada precisando retomar o hábito",
};

const DAY_PILLS = [
  { x: 46, y: 26, delay: "0s" },
  { x: 86, y: 18, delay: "0.4s" },
  { x: 126, y: 26, delay: "0.8s" },
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
  r = 5.2,
  pupilOffset = { dx: 0, dy: -1.5 },
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

const FACE_BY_MOOD: Record<ConsistencyMood, React.ReactNode> = {
  idle: (
    <>
      {/* Sobrancelhas serenas e focadas */}
      <path
        d="M81 66 Q87 63 93 65"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M107 65 Q113 63 119 66"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <g className="consistency-eyes-blink">
        <Eye cx={87} cy={75} />
        <Eye cx={113} cy={75} />
      </g>
      {/* Sorriso calmo e inabalável */}
      <path
        d="M93 85 Q100 91 107 85"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),

  happy: (
    <>
      {/* Olhos radiantes de ofensiva concluída (^ ^) */}
      <path
        d="M81 75 Q87 66 93 75"
        stroke={COLORS.stroke}
        strokeWidth="3.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M107 75 Q113 66 119 75"
        stroke={COLORS.stroke}
        strokeWidth="3.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Boca aberta comemorando */}
      <path d="M90 82 Q100 96 110 82 Z" fill={COLORS.stroke} />
      <path
        d="M95 88 Q100 92 105 88"
        stroke={COLORS.cheek}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </>
  ),

  thinking: (
    <>
      <path
        d="M81 66 L93 67"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M107 62 Q113 57 119 62"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <Eye cx={87} cy={75} pupilOffset={{ dx: 2, dy: -2 }} />
      <Eye cx={113} cy={75} pupilOffset={{ dx: 2, dy: -2 }} />
      <circle cx={102} cy={86} r={3.2} fill={COLORS.stroke} />
    </>
  ),

  error: (
    <>
      {/* Expressão de quando quase perde a ofensiva */}
      <path
        d="M81 68 L93 64"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M119 68 L107 64"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <Eye cx={87} cy={76} pupilOffset={{ dx: 0, dy: 1.5 }} />
      <Eye cx={113} cy={76} pupilOffset={{ dx: 0, dy: 1.5 }} />
      <path
        d="M93 89 Q100 83 107 89"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),
};

/* ==========================================================================
   3. Estilos de Animação (Ritmo Metronômico + Chama de Streak + Ciclo)
   ========================================================================== */

const ANIMATION_STYLES = `
  /* Movimento cadenciado e constante (como um metrônomo vivo) */
  .consistency-svg .mascot-core {
    transform-origin: 100px 155px;
    animation: steady-rhythm 2s ease-in-out infinite;
  }
  .consistency-svg[data-mood="happy"] .mascot-core {
    animation: streak-celebrate 0.55s ease-in-out infinite;
    filter: drop-shadow(0 8px 18px rgba(254, 168, 66, 0.45));
  }
  .consistency-svg[data-mood="thinking"] .mascot-core {
    animation: steady-rhythm 3s ease-in-out infinite;
  }
  .consistency-svg[data-mood="error"] .mascot-core {
    animation: none;
    transform: translateY(4px);
  }

  /* Anel de Ciclo Contínuo ao fundo */
  .consistency-svg .consistency-ring {
    transform-origin: 100px 110px;
    animation: cycle-spin 14s linear infinite;
  }
  .consistency-svg[data-mood="happy"] .consistency-ring {
    animation-duration: 5s;
  }
  .consistency-svg[data-mood="error"] .consistency-ring {
    animation-play-state: paused;
  }

  /* Chama da Constância (Streak) pulsando no peito */
  .consistency-svg .streak-flame {
    transform-origin: 100px 132px;
    animation: flame-pulse 0.9s ease-in-out infinite alternate;
  }
  .consistency-svg[data-mood="happy"] .streak-flame {
    animation-duration: 0.45s;
  }

  /* Pílulas de Dias Consecutivos (Checkmarks no topo) */
  .consistency-svg .day-pill {
    transform-origin: center;
    animation: pill-check-pulse 2.4s ease-in-out infinite;
  }

  /* Sombra no chão */
  .consistency-svg .floor-shadow {
    transform-origin: center;
    animation: steady-shadow 2s ease-in-out infinite;
  }

  /* Piscar de olhos */
  .consistency-svg .consistency-eyes-blink {
    transform-origin: 100px 75px;
    animation: steady-blink 3.5s infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .consistency-svg * { animation: none !important; }
  }

  @keyframes steady-rhythm {
    0%, 100% { transform: translateY(0px) scale(1.01, 0.99); }
    50% { transform: translateY(-9px) scale(0.99, 1.01); }
  }
  @keyframes streak-celebrate {
    0%, 100% { transform: translateY(0px) scale(1.05, 0.95); }
    50% { transform: translateY(-18px) scale(0.95, 1.05); }
  }
  @keyframes cycle-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes flame-pulse {
    0% { transform: scale(0.92) rotate(-2deg); }
    100% { transform: scale(1.12) rotate(2deg); }
  }
  @keyframes pill-check-pulse {
    0%, 100% { transform: translateY(0px) scale(0.95); opacity: 0.8; }
    50% { transform: translateY(-4px) scale(1.06); opacity: 1; }
  }
  @keyframes steady-shadow {
    0%, 100% { transform: scale(1); opacity: 0.24; }
    50% { transform: scale(0.82); opacity: 0.14; }
  }
  @keyframes steady-blink {
    0%, 92%, 100% { transform: scaleY(1); }
    96% { transform: scaleY(0.08); }
  }
`;

/* ==========================================================================
   4. Componente Principal
   ========================================================================== */

export const ConsistencyMascot: React.FC<ConsistencyMascotProps> = memo(
  ({ mood = "idle", size = 220, className = "", onClick, ...rest }) => {
    const isStreakActive = mood !== "error";

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
          className="consistency-svg overflow-visible"
          data-mood={mood}
        >
          {/* ==============================================================
              1. ANEL DE CICLO CONTÍNUO & BARRA DE DIAS CONSECUTIVOS (STREAK)
              ============================================================== */}
          {/* Halo de Hábito Contínuo ao Fundo */}
          <g className="consistency-ring">
            <circle
              cx="100"
              cy="110"
              r="68"
              stroke={COLORS.ringSoft}
              strokeWidth="6"
            />
            <circle
              cx="100"
              cy="110"
              r="68"
              stroke={isStreakActive ? COLORS.flameMain : COLORS.ringTrack}
              strokeWidth="6"
              strokeDasharray="65 36"
              strokeLinecap="round"
            />
            {/* Pontos de Marcas de Relógio / Ritmo na Órbita */}
            <circle cx="100" cy="42" r="4.5" fill={COLORS.flameDark} />
            <circle cx="168" cy="110" r="4.5" fill={COLORS.suitLight} />
            <circle cx="100" cy="178" r="4.5" fill={COLORS.flameDark} />
            <circle cx="32" cy="110" r="4.5" fill={COLORS.suitLight} />
          </g>

          {/* 3 Pílulas de Dias Consecutivos (Checkmarks de Constância no Topo) */}
          <g>
            {DAY_PILLS.map((pill, i) => (
              <g
                key={`day-${i}`}
                className="day-pill"
                style={{ animationDelay: pill.delay }}
              >
                {/* Sombra 3D do Card do Dia */}
                <rect
                  x={pill.x}
                  y={pill.y + 3}
                  width="28"
                  height="22"
                  rx="8"
                  fill={isStreakActive ? COLORS.flameDark : COLORS.ringTrack}
                />
                {/* Corpo do Card do Dia */}
                <rect
                  x={pill.x}
                  y={pill.y}
                  width="28"
                  height="22"
                  rx="8"
                  fill={isStreakActive ? COLORS.flameMain : COLORS.ringSoft}
                />
                {/* Ícone de Check (Concluído) */}
                <path
                  d={`M${pill.x + 8} ${pill.y + 11} L${pill.x + 12.5} ${
                    pill.y + 15.5
                  } L${pill.x + 20} ${pill.y + 7.5}`}
                  stroke={isStreakActive ? COLORS.white : COLORS.ringTrack}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </g>
            ))}
          </g>

          {/* Sombra no chão */}
          <ellipse
            className="floor-shadow"
            cx="100"
            cy="184"
            rx="44"
            ry="7.5"
            fill={COLORS.suitMain}
          />

          {/* ==============================================================
              2. PERSONAGEM GUARDIÃO DA CONSTÂNCIA
              ============================================================== */}
          <g className="mascot-core">
            {/* Pernas em Base Firme / Postura Inabalável */}
            <rect
              x="78"
              y="144"
              width="16"
              height="26"
              rx="8"
              fill={COLORS.suitDark}
            />
            <rect
              x="106"
              y="144"
              width="16"
              height="26"
              rx="8"
              fill={COLORS.suitDark}
            />
            {/* Calçados Esportivos de Rotina */}
            <rect
              x="74"
              y="162"
              width="22"
              height="11"
              rx="5.5"
              fill={COLORS.stroke}
            />
            <rect
              x="104"
              y="162"
              width="22"
              height="11"
              rx="5.5"
              fill={COLORS.stroke}
            />
            <rect
              x="74"
              y="170"
              width="22"
              height="3.5"
              rx="1.75"
              fill={COLORS.flameMain}
            />
            <rect
              x="104"
              y="170"
              width="22"
              height="3.5"
              rx="1.75"
              fill={COLORS.flameMain}
            />

            {/* Tronco / Kimono Esportivo de Disciplina */}
            {/* Sombra 3D do Tronco */}
            <rect
              x="70"
              y="102"
              width="60"
              height="50"
              rx="22"
              fill={COLORS.suitDark}
            />
            {/* Corpo Principal */}
            <rect
              x="70"
              y="96"
              width="60"
              height="48"
              rx="22"
              fill={COLORS.suitMain}
            />

            {/* Gola Cruzada de Mestre da Disciplina */}
            <path
              d="M84 96 L100 114 L116 96"
              stroke={COLORS.suitLight}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Faixa Laranja de Consistência na Cintura */}
            <rect
              x="71"
              y="135"
              width="58"
              height="7"
              rx="3.5"
              fill={COLORS.flameDark}
            />

            {/* ============================================================
                CHAMA DA CONSTÂNCIA (STREAK FLAME) NO CENTRO DO PEITO
                ============================================================ */}
            {isStreakActive ? (
              <g className="streak-flame">
                {/* Chama Externa Laranja Escura */}
                <path
                  d="M100 105 C100 105, 114 116, 112 127 C110 135, 105 138, 100 138 C95 138, 90 135, 88 127 C86 116, 100 105, 100 105 Z"
                  fill={COLORS.flameDark}
                />
                {/* Chama Média Laranja Vibrante */}
                <path
                  d="M100 109 C100 109, 110 118, 109 127 C108 133, 104 136, 100 136 C96 136, 92 133, 91 127 C90 118, 100 109, 100 109 Z"
                  fill={COLORS.flameMain}
                />
                {/* Núcleo Quente Amarelo/Creme */}
                <path
                  d="M100 117 C100 117, 105 123, 105 128 C105 132, 103 134, 100 134 C97 134, 95 132, 95 128 C95 123, 100 117, 100 117 Z"
                  fill={COLORS.flameGlow}
                />
              </g>
            ) : (
              /* Chama Apagada quando mood="error" */
              <path
                d="M100 112 C100 112, 109 120, 108 128 C107 133, 104 136, 100 136 C96 136, 93 133, 92 128 C91 120, 100 112, 100 112 Z"
                fill={COLORS.ringTrack}
                opacity="0.6"
              />
            )}

            {/* Braços (Em postura focada ou erguidos na comemoração) */}
            {mood === "happy" ? (
              <>
                <path
                  d="M72 108 L52 84"
                  stroke={COLORS.suitMain}
                  strokeWidth="13"
                  strokeLinecap="round"
                />
                <circle cx="50" cy="82" r="7.5" fill={COLORS.skinLight} />
                <path
                  d="M128 108 L148 84"
                  stroke={COLORS.suitMain}
                  strokeWidth="13"
                  strokeLinecap="round"
                />
                <circle cx="150" cy="82" r="7.5" fill={COLORS.skinLight} />
              </>
            ) : (
              <>
                {/* Braço Esquerdo dobrado em foco */}
                <path
                  d="M72 108 L58 122 L76 130"
                  stroke={COLORS.suitDark}
                  strokeWidth="13"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                {/* Braço Direito dobrado em foco */}
                <path
                  d="M128 108 L142 122 L124 130"
                  stroke={COLORS.suitDark}
                  strokeWidth="13"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                {/* Mãos firmes com munhequeira de constância */}
                <circle cx="77" cy="130" r="7" fill={COLORS.skinLight} />
                <circle cx="123" cy="130" r="7" fill={COLORS.skinLight} />
              </>
            )}

            {/* Cabeça e Rosto */}
            {/* Orelhas */}
            <circle cx="69" cy="76" r="7" fill={COLORS.skinShadow} />
            <circle cx="131" cy="76" r="7" fill={COLORS.skinShadow} />

            {/* Relevo 3D da cabeça */}
            <circle cx="100" cy="76" r="30" fill={COLORS.skinShadow} />
            {/* Cabeça principal */}
            <circle cx="100" cy="72" r="30" fill={COLORS.skinLight} />

            {/* Bochechas */}
            <g fill={COLORS.cheek} opacity={mood === "happy" ? "0.7" : "0.4"}>
              <ellipse cx="78" cy="81" rx="5.5" ry="3.5" />
              <ellipse cx="122" cy="81" rx="5.5" ry="3.5" />
            </g>

            {/* Cabelo Estilizado */}
            <path
              d="M70 64 C70 42, 90 36, 112 39 C122 40, 132 48, 130 60 C120 51, 104 49, 86 53 C77 55, 73 59, 70 64 Z"
              fill={COLORS.suitDark}
            />
            <path
              d="M84 41 C96 32, 114 32, 124 43 C112 40, 98 41, 84 41 Z"
              fill={COLORS.suitMain}
            />

            {/* Faixa de Foco / Disciplina na Testa */}
            <path
              d="M71 58 Q100 52 129 58"
              stroke={COLORS.flameMain}
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            {/* Emblema circular no centro da faixa */}
            <circle cx="100" cy="55" r="5" fill={COLORS.flameGlow} />
            <circle cx="100" cy="55" r="2.5" fill={COLORS.flameDark} />

            {/* Expressão Facial Dinâmica */}
            {FACE_BY_MOOD[mood]}
          </g>
        </svg>
      </div>
    );
  }
);

ConsistencyMascot.displayName = "ConsistencyMascot";

export default ConsistencyMascot;
