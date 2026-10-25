import React, { memo } from "react";

export type IntegratorMood = "idle" | "happy" | "thinking" | "error";

export interface StrategicIntegratorMascotProps
  extends React.HTMLAttributes<HTMLDivElement> {
  mood?: IntegratorMood;
  size?: number;
}

/* ==========================================================================
   1. Tokens de Design (Integrados ao tailwind-colors.css) & Labels
   ========================================================================== */

const COLORS = {
  plugLight: "var(--color-blue-400, #335779)",
  plugMain: "var(--color-blue-500, #002d58)",
  plugDark: "var(--color-blue-700, #00203e)",
  socketLight: "var(--color-orange-300, #fec580)",
  socketMain: "var(--color-orange-500, #fea842)",
  socketDark: "var(--color-orange-600, #e7993c)",
  socketDeep: "var(--color-orange-700, #b4772f)",
  metalPin: "var(--color-blue-100, #b0becb)",
  metalHighlight: "var(--color-blue-50, #e6eaee)",
  metalShadow: "var(--color-blue-300, #54728f)",
  energyGlow: "var(--color-orange-50, #fff6ec)",
  stroke: "var(--color-blue-800, #001930)",
  cheek: "#ff6b6b",
  white: "#ffffff",
} as const;

const MOOD_LABELS: Record<IntegratorMood, string> = {
  idle: "Integrador estratégico conectando dois cabos em sinergia",
  happy: "Cabos totalmente conectados transmitindo energia máxima",
  thinking: "Cabos alinhando a estratégia antes da conexão",
  error: "Falha de conexão e incompatibilidade entre os cabos",
};

/* ==========================================================================
   2. Subcomponentes Internos de Expressão para os 2 Conectores
   ========================================================================== */

interface PlugFacesProps {
  mood: IntegratorMood;
  side: "left" | "right";
}

const ConnectorFace: React.FC<PlugFacesProps> = ({ mood, side }) => {
  const isLeft = side === "left";
  const baseX = isLeft ? 64 : 140;
  const lookDir = isLeft ? 1.5 : -1.5;

  if (mood === "happy") {
    return (
      <g>
        {/* Olhos fechados felizes (^ ^) */}
        <path
          d={`M${baseX - 11} 95 Q${baseX - 6} 88 ${baseX - 1} 95`}
          stroke={isLeft ? COLORS.white : COLORS.stroke}
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={`M${baseX + 3} 95 Q${baseX + 8} 88 ${baseX + 13} 95`}
          stroke={isLeft ? COLORS.white : COLORS.stroke}
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Sorriso aberto */}
        <path
          d={`M${baseX - 5} 102 Q${baseX + 1} 111 ${baseX + 7} 102 Z`}
          fill={isLeft ? COLORS.socketMain : COLORS.stroke}
        />
      </g>
    );
  }

  if (mood === "error") {
    return (
      <g
        stroke={isLeft ? COLORS.white : COLORS.stroke}
        strokeWidth="3"
        strokeLinecap="round"
      >
        {/* Olhos em X de falha de conexão */}
        <path
          d={`M${baseX - 10} 91 L${baseX - 3} 98 M${baseX - 3} 91 L${
            baseX - 10
          } 98`}
        />
        <path
          d={`M${baseX + 4} 91 L${baseX + 11} 98 M${baseX + 11} 91 L${
            baseX + 4
          } 98`}
        />
        {/* Boca triste */}
        <path
          d={`M${baseX - 4} 107 Q${baseX + 1} 102 ${baseX + 6} 107`}
          fill="none"
        />
      </g>
    );
  }

  return (
    <g>
      <g className="integrator-eyes-blink">
        {/* Olho 1 */}
        <circle
          cx={baseX - 6}
          cy={95}
          r={4.5}
          fill={isLeft ? COLORS.white : COLORS.stroke}
        />
        <circle
          cx={baseX - 6 + lookDir}
          cy={93.5}
          r={1.8}
          fill={isLeft ? COLORS.stroke : COLORS.white}
        />

        {/* Olho 2 */}
        <circle
          cx={baseX + 8}
          cy={95}
          r={4.5}
          fill={isLeft ? COLORS.white : COLORS.stroke}
        />
        <circle
          cx={baseX + 8 + lookDir}
          cy={93.5}
          r={1.8}
          fill={isLeft ? COLORS.stroke : COLORS.white}
        />
      </g>

      {/* Boca conforme estado */}
      {mood === "thinking" ? (
        <circle
          cx={baseX + 1}
          cy={105}
          r={2.8}
          fill={isLeft ? COLORS.white : COLORS.stroke}
        />
      ) : (
        <path
          d={`M${baseX - 4} 103 Q${baseX + 1} 108 ${baseX + 6} 103`}
          stroke={isLeft ? COLORS.white : COLORS.stroke}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </g>
  );
};

/* ==========================================================================
   3. Estilos de Animação (Acoplamento Magnético + Fluxo de Dados + Faíscas)
   ========================================================================== */

const ANIMATION_STYLES = `
  /* Movimento do Cabo Esquerdo (Plugue Macho Azul) */
  .integrator-svg[data-mood="idle"] .cable-left {
    animation: connect-left 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
  .integrator-svg[data-mood="happy"] .cable-left {
    transform: translateX(0px);
    animation: connected-pulse-left 0.6s ease-in-out infinite alternate;
  }
  .integrator-svg[data-mood="thinking"] .cable-left {
    animation: align-think-left 2.2s ease-in-out infinite;
  }
  .integrator-svg[data-mood="error"] .cable-left {
    animation: reject-left 0.7s ease-in-out infinite;
  }

  /* Movimento do Cabo Direito (Soquete Fêmea Laranja) */
  .integrator-svg[data-mood="idle"] .cable-right {
    animation: connect-right 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
  .integrator-svg[data-mood="happy"] .cable-right {
    transform: translateX(0px);
    animation: connected-pulse-right 0.6s ease-in-out infinite alternate;
  }
  .integrator-svg[data-mood="thinking"] .cable-right {
    animation: align-think-right 2.2s ease-in-out infinite;
  }
  .integrator-svg[data-mood="error"] .cable-right {
    animation: reject-right 0.7s ease-in-out infinite;
  }

  /* Onda de Choque e Faíscas no Momento Exato do Encaixe (40% a 75%) */
  .integrator-svg[data-mood="idle"] .snap-burst {
    transform-origin: 100px 100px;
    animation: connection-spark 2.4s ease-out infinite;
  }
  .integrator-svg[data-mood="happy"] .snap-burst {
    transform-origin: 100px 100px;
    animation: happy-spark-continuous 0.9s ease-out infinite;
  }

  /* Corrente de Dados Fluindo pelos Cabos quando Conectados */
  .integrator-svg .data-stream {
    stroke-dasharray: 14 28;
    animation: stream-flow 0.6s linear infinite;
  }

  /* Sombra acompanhando a aproximação */
  .integrator-svg .shadow-left {
    transform-origin: 64px 176px;
    animation: shadow-move-left 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
  .integrator-svg .shadow-right {
    transform-origin: 136px 176px;
    animation: shadow-move-right 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }

  /* Piscar de olhos */
  .integrator-svg .integrator-eyes-blink {
    transform-origin: center 95px;
    animation: integrator-blink 3.5s infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .integrator-svg * { animation: none !important; }
  }

  @keyframes connect-left {
    0%, 100% { transform: translateX(-22px) rotate(-2deg); }
    32% { transform: translateX(-26px) rotate(-3deg); }
    /* Encaixe rápido e magnético aos 42% */
    42%, 75% { transform: translateX(0px) rotate(0deg); }
  }

  @keyframes connect-right {
    0%, 100% { transform: translateX(22px) rotate(2deg); }
    32% { transform: translateX(26px) rotate(3deg); }
    /* Encaixe rápido e magnético aos 42% */
    42%, 75% { transform: translateX(0px) rotate(0deg); }
  }

  @keyframes connected-pulse-left {
    0% { transform: translateX(0px) scale(1); }
    100% { transform: translateX(2px) scale(1.03, 0.97); }
  }

  @keyframes connected-pulse-right {
    0% { transform: translateX(0px) scale(1); }
    100% { transform: translateX(-2px) scale(1.03, 0.97); }
  }

  @keyframes align-think-left {
    0%, 100% { transform: translate(-18px, -6px); }
    50% { transform: translate(-14px, 6px); }
  }

  @keyframes align-think-right {
    0%, 100% { transform: translate(18px, 6px); }
    50% { transform: translate(14px, -6px); }
  }

  @keyframes reject-left {
    0%, 100% { transform: translateX(-16px) rotate(-4deg); }
    50% { transform: translateX(-6px) rotate(3deg); }
  }

  @keyframes reject-right {
    0%, 100% { transform: translateX(16px) rotate(4deg); }
    50% { transform: translateX(6px) rotate(-3deg); }
  }

  @keyframes connection-spark {
    0%, 38% { transform: scale(0.3); opacity: 0; }
    44% { transform: scale(1.1); opacity: 1; }
    72% { transform: scale(1.45); opacity: 0.85; }
    85%, 100% { transform: scale(1.7); opacity: 0; }
  }

  @keyframes happy-spark-continuous {
    0% { transform: scale(0.75); opacity: 0.95; }
    100% { transform: scale(1.5); opacity: 0; }
  }

  @keyframes stream-flow {
    from { stroke-dashoffset: 42; }
    to { stroke-dashoffset: 0; }
  }

  @keyframes shadow-move-left {
    0%, 32%, 100% { transform: translateX(-20px) scale(0.9); opacity: 0.16; }
    42%, 75% { transform: translateX(6px) scale(1.05); opacity: 0.24; }
  }

  @keyframes shadow-move-right {
    0%, 32%, 100% { transform: translateX(20px) scale(0.9); opacity: 0.16; }
    42%, 75% { transform: translateX(-6px) scale(1.05); opacity: 0.24; }
  }

  @keyframes integrator-blink {
    0%, 92%, 100% { transform: scaleY(1); }
    96% { transform: scaleY(0.08); }
  }
`;

/* ==========================================================================
   4. Componente Principal
   ========================================================================== */

export const StrategicIntegratorMascot: React.FC<StrategicIntegratorMascotProps> =
  memo(({ mood = "idle", size = 90, className = "", onClick, ...rest }) => {
    const isConnected = mood === "idle" || mood === "happy";

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
          className="integrator-svg overflow-visible"
          data-mood={mood}
        >
          {/* ==============================================================
              1. REDE ESTRATÉGICA AO FUNDO & SOMBRAS NO CHÃO
              ============================================================== */}
          {/* Nodos de Rede Estratégica ao Fundo */}
          <g
            opacity="0.25"
            stroke={COLORS.metalPin}
            strokeWidth="2"
            strokeDasharray="4 4"
          >
            <line x1="40" y1="45" x2="100" y2="30" />
            <line x1="100" y1="30" x2="160" y2="45" />
            <circle cx="40" cy="45" r="4" fill={COLORS.plugMain} />
            <circle cx="100" cy="30" r="5" fill={COLORS.socketMain} />
            <circle cx="160" cy="45" r="4" fill={COLORS.plugMain} />
          </g>

          {/* Sombras Duplas no Chão */}
          <ellipse
            className="shadow-left"
            cx="68"
            cy="176"
            rx="32"
            ry="7"
            fill={COLORS.plugMain}
          />
          <ellipse
            className="shadow-right"
            cx="132"
            cy="176"
            rx="32"
            ry="7"
            fill={COLORS.plugMain}
          />

          {/* Linha Guia de Alinhamento no modo Thinking */}
          {mood === "thinking" && (
            <line
              x1="75"
              y1="100"
              x2="125"
              y2="100"
              stroke={COLORS.socketMain}
              strokeWidth="3"
              strokeDasharray="5 5"
              className="animate-pulse"
            />
          )}

          {/* ==============================================================
              2. AURA DE IMPACTO E SINERGIA NO CENTRO (QUANDO CONECTADOS)
              ============================================================== */}
          {isConnected && (
            <g className="snap-burst">
              <circle
                cx="100"
                cy="100"
                r="44"
                fill={COLORS.energyGlow}
                opacity="0.7"
              />
              <circle
                cx="100"
                cy="100"
                r="38"
                stroke={COLORS.socketMain}
                strokeWidth="3.5"
                strokeDasharray="10 8"
              />
              {/* Estrelas de Sinergia no Topo e na Base do Encaixe */}
              <path
                d="M100 42 L103 50 L111 53 L103 56 L100 64 L97 56 L89 53 L97 50 Z"
                fill={COLORS.socketMain}
              />
              <path
                d="M100 136 L102.5 142.5 L109 145 L102.5 147.5 L100 154 L97.5 147.5 L91 145 L97.5 142.5 Z"
                fill={COLORS.socketMain}
              />
              {/* Raios de Encaixe Perfeito */}
              <line
                x1="84"
                y1="58"
                x2="76"
                y2="48"
                stroke={COLORS.socketMain}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <line
                x1="116"
                y1="58"
                x2="124"
                y2="48"
                stroke={COLORS.socketMain}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* ==============================================================
              3. CABO ESQUERDO: PLUGUE MACHO AZUL + PINOS CONECTORES
              ============================================================== */}
          <g className="cable-left">
            {/* Cordão do Cabo Esquerdo vindo da borda */}
            <path
              d="M -8 134 C 14 134, 20 100, 38 100"
              stroke={COLORS.plugDark}
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M -8 131 C 14 131, 20 98, 38 98"
              stroke={COLORS.plugMain}
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />
            {/* Fluxo de Dados Correndo pelo Cabo Esquerdo */}
            {isConnected && (
              <path
                className="data-stream"
                d="M -6 131 C 14 131, 20 98, 38 98"
                stroke={COLORS.socketLight}
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Pescoço Flexível (Strain Relief) do Cabo Esquerdo */}
            <rect
              x="31"
              y="88"
              width="10"
              height="24"
              rx="4"
              fill={COLORS.plugDark}
            />

            {/* Pinos Metálicos do Conector Macho (Encaixam dentro do Direito) */}
            {/* Pino Superior */}
            <rect
              x="90"
              y="81"
              width="22"
              height="9"
              rx="4.5"
              fill={COLORS.metalShadow}
            />
            <rect
              x="90"
              y="79"
              width="21"
              height="8"
              rx="4"
              fill={COLORS.metalPin}
            />
            <line
              x1="93"
              y1="82"
              x2="106"
              y2="82"
              stroke={COLORS.metalHighlight}
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Pino Inferior */}
            <rect
              x="90"
              y="111"
              width="22"
              height="9"
              rx="4.5"
              fill={COLORS.metalShadow}
            />
            <rect
              x="90"
              y="109"
              width="21"
              height="8"
              rx="4"
              fill={COLORS.metalPin}
            />
            <line
              x1="93"
              y1="112"
              x2="106"
              y2="112"
              stroke={COLORS.metalHighlight}
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Corpo 3D do Plugue Esquerdo */}
            {/* Sombra 3D Inferior */}
            <path
              d="M48 73 H88 C93 73, 96 76, 96 81 V123 C96 128, 93 131, 88 131 H48 C41 131, 36 125, 36 118 V86 C36 79, 41 73, 48 73 Z"
              fill={COLORS.plugDark}
            />
            {/* Bloco Principal Azul */}
            <path
              d="M48 69 H88 C93 69, 96 72, 96 77 V119 C96 124, 93 127, 88 127 H48 C41 127, 36 121, 36 114 V82 C36 75, 41 69, 48 69 Z"
              fill={COLORS.plugMain}
            />
            {/* Brilho Superior */}
            <path
              d="M46 76 H84"
              stroke={COLORS.plugLight}
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Bochechas e Rosto do Conector Esquerdo */}
            <ellipse
              cx="53"
              cy="101"
              rx="4"
              ry="2.5"
              fill={COLORS.cheek}
              opacity="0.6"
            />
            <ellipse
              cx="77"
              cy="101"
              rx="4"
              ry="2.5"
              fill={COLORS.cheek}
              opacity="0.6"
            />
            <ConnectorFace mood={mood} side="left" />
          </g>

          {/* ==============================================================
              4. CABO DIREITO: SOQUETE FÊMEA LARANJA
              ============================================================== */}
          <g className="cable-right">
            {/* Cordão do Cabo Direito indo para a borda */}
            <path
              d="M 162 100 C 180 100, 186 68, 208 68"
              stroke={COLORS.socketDeep}
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 162 98 C 180 98, 186 66, 208 66"
              stroke={COLORS.socketMain}
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />
            {/* Fluxo de Dados Continuando pelo Cabo Direito */}
            {isConnected && (
              <path
                className="data-stream"
                d="M 162 98 C 180 98, 186 66, 208 66"
                stroke={COLORS.energyGlow}
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            )}

            {/* Pescoço Flexível (Strain Relief) do Cabo Direito */}
            <rect
              x="159"
              y="88"
              width="10"
              height="24"
              rx="4"
              fill={COLORS.socketDeep}
            />

            {/* Corpo 3D do Soquete Direito */}
            {/* Sombra 3D Inferior */}
            <path
              d="M112 73 H152 C159 73, 164 79, 164 86 V118 C164 125, 159 131, 152 131 H112 C107 131, 104 128, 104 123 V81 C104 76, 107 73, 112 73 Z"
              fill={COLORS.socketDeep}
            />
            {/* Bloco Principal Laranja */}
            <path
              d="M112 69 H152 C159 69, 164 75, 164 82 V114 C164 121, 159 127, 152 127 H112 C107 127, 104 124, 104 119 V77 C104 72, 107 69, 112 69 Z"
              fill={COLORS.socketMain}
            />

            {/* Entradas de Encaixe Frontal (Slots que recebem os pinos) */}
            <rect
              x="104"
              y="78"
              width="8"
              height="10"
              rx="2"
              fill={COLORS.stroke}
            />
            <rect
              x="104"
              y="108"
              width="8"
              height="10"
              rx="2"
              fill={COLORS.stroke}
            />

            {/* Brilho Superior */}
            <path
              d="M116 76 H154"
              stroke={COLORS.socketLight}
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Bochechas e Rosto do Conector Direito */}
            <ellipse
              cx="129"
              cy="101"
              rx="4"
              ry="2.5"
              fill={COLORS.cheek}
              opacity="0.55"
            />
            <ellipse
              cx="153"
              cy="101"
              rx="4"
              ry="2.5"
              fill={COLORS.cheek}
              opacity="0.55"
            />
            <ConnectorFace mood={mood} side="right" />
          </g>

          {/* ==============================================================
              5. ÍCONE DE CONEXÃO CONCLUÍDA / CURTO-CIRCUITO
              ============================================================== */}
          {mood === "happy" && (
            <g className="animate-bounce">
              <circle
                cx="100"
                cy="42"
                r="13"
                fill={COLORS.plugMain}
                stroke={COLORS.white}
                strokeWidth="2.5"
              />
              <path
                d="M94 42 L98.5 46.5 L106.5 38"
                stroke={COLORS.socketMain}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </g>
          )}

          {mood === "error" && (
            <g stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round">
              <path d="M96 56 L104 68 L96 72 L104 84" fill="none" />
            </g>
          )}
        </svg>
      </div>
    );
  });

StrategicIntegratorMascot.displayName = "StrategicIntegratorMascot";

export default StrategicIntegratorMascot;
