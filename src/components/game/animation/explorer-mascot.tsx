import React, { memo } from "react";

export type ExplorerMood = "idle" | "happy" | "thinking" | "error";

export interface ExplorerMascotProps
  extends React.HTMLAttributes<HTMLDivElement> {
  mood?: ExplorerMood;
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
  hatLight: "var(--color-orange-300, #fec580)",
  hatMain: "var(--color-orange-500, #fea842)",
  hatDark: "var(--color-orange-600, #e7993c)",
  leatherDark: "var(--color-orange-800, #8c5c24)",
  compassBg: "var(--color-orange-50, #fff6ec)",
  compassRing: "var(--color-blue-100, #b0becb)",
  lensCyan: "#38bdf8",
  cheek: "#ff6b6b",
  white: "#ffffff",
} as const;

const MOOD_LABELS: Record<ExplorerMood, string> = {
  idle: "Explorador completo observando o horizonte com luneta e bússola",
  happy: "Explorador comemorando uma grande descoberta",
  thinking: "Explorador consultando a bússola e o mapa para traçar a rota",
  error: "Explorador desorientado procurando o norte",
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
  pupilOffset = { dx: 1.8, dy: -1.2 },
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

const FACE_BY_MOOD: Record<ExplorerMood, React.ReactNode> = {
  idle: (
    <>
      {/* Sobrancelhas curiosas de explorador */}
      <path
        d="M83 63 Q89 60 95 63"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M105 61 Q111 57 117 61"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <g className="explorer-eyes-blink">
        <Eye cx={89} cy={72} />
        <Eye cx={111} cy={72} />
      </g>
      {/* Sorriso aventureiro */}
      <path
        d="M92 82 Q100 89 108 81"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),

  happy: (
    <>
      {/* Olhos radiantes de descoberta (^ ^) */}
      <path
        d="M83 72 Q89 63 95 72"
        stroke={COLORS.stroke}
        strokeWidth="3.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M105 72 Q111 63 117 72"
        stroke={COLORS.stroke}
        strokeWidth="3.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Boca aberta comemorando */}
      <path d="M90 79 Q100 94 110 79 Z" fill={COLORS.stroke} />
      <path
        d="M95 86 Q100 90 105 86"
        stroke={COLORS.cheek}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
    </>
  ),

  thinking: (
    <>
      {/* Uma sobrancelha franzida e outra arqueada analisando o mapa */}
      <path
        d="M83 64 L95 65"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M105 59 Q111 54 117 59"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <Eye cx={89} cy={72} pupilOffset={{ dx: 2.5, dy: -2 }} />
      <Eye cx={111} cy={72} pupilOffset={{ dx: 2.5, dy: -2 }} />
      <circle cx={102} cy={83} r={3.4} fill={COLORS.stroke} />
    </>
  ),

  error: (
    <>
      {/* Sobrancelhas confusas / Perdido na rota */}
      <path
        d="M83 65 L95 61"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M117 65 L105 61"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <Eye cx={89} cy={73} pupilOffset={{ dx: -1.5, dy: 1.5 }} />
      <Eye cx={111} cy={73} pupilOffset={{ dx: 1.5, dy: -1.5 }} />
      <path
        d="M93 86 Q100 80 107 86"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),
};

/* ==========================================================================
   3. Estilos de Animação (Escaneamento com Luneta + Bússola + Rosa dos Ventos)
   ========================================================================== */

const ANIMATION_STYLES = `
  /* Respiração e postura do explorador */
  .explorer-svg .explorer-core {
    transform-origin: 100px 168px;
    animation: explorer-stance 2.4s ease-in-out infinite;
  }
  .explorer-svg[data-mood="happy"] .explorer-core {
    animation: explorer-jump 0.55s ease-in-out infinite;
    filter: drop-shadow(0 8px 16px rgba(254, 168, 66, 0.35));
  }
  .explorer-svg[data-mood="thinking"] .explorer-core {
    animation: explorer-ponder 2.6s ease-in-out infinite;
  }
  .explorer-svg[data-mood="error"] .explorer-core {
    animation: explorer-lost-shake 0.55s ease-in-out;
  }

  /* Braço com a Luneta escaneando o horizonte (Cima / Baixo) */
  .explorer-svg .spyglass-arm {
    transform-origin: 118px 104px;
    animation: scan-horizon 2.8s ease-in-out infinite;
  }
  .explorer-svg[data-mood="happy"] .spyglass-arm {
    animation: spyglass-celebrate 0.55s ease-in-out infinite;
  }
  .explorer-svg[data-mood="error"] .spyglass-arm {
    animation: none;
    transform: rotate(22deg) translateY(6px);
  }

  /* Feixe de luz/visão saindo da luneta */
  .explorer-svg .vision-beam {
    transform-origin: 162px 74px;
    animation: beam-pulse 1.4s ease-in-out infinite alternate;
  }

  /* Rosa dos ventos girando lentamente ao fundo */
  .explorer-svg .compass-rose-bg {
    transform-origin: 100px 100px;
    animation: rose-rotate 18s linear infinite;
  }
  .explorer-svg[data-mood="happy"] .compass-rose-bg {
    animation-duration: 6s;
  }

  /* Agulha da bússola buscando o Norte */
  .explorer-svg .compass-needle {
    transform-origin: 86px 137px;
    animation: needle-seek 2.2s ease-in-out infinite;
  }
  .explorer-svg[data-mood="error"] .compass-needle {
    animation: needle-spin-crazy 0.6s linear infinite;
  }

  /* Estrelas de descoberta piscando no horizonte */
  .explorer-svg .discovery-star-1 {
    transform-origin: 174px 42px;
    animation: star-twinkle 1.6s ease-in-out infinite;
  }
  .explorer-svg .discovery-star-2 {
    transform-origin: 36px 52px;
    animation: star-twinkle 1.6s ease-in-out infinite 0.8s;
  }

  /* Sombra no chão */
  .explorer-svg .floor-shadow {
    transform-origin: center;
    animation: explorer-shadow 2.4s ease-in-out infinite;
  }

  /* Piscar de olhos */
  .explorer-svg .explorer-eyes-blink {
    transform-origin: 100px 72px;
    animation: explorer-blink 3.5s infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .explorer-svg * { animation: none !important; }
  }

  @keyframes explorer-stance {
    0%, 100% { transform: translateY(0px) scale(1.02, 0.98); }
    50% { transform: translateY(-6px) scale(0.99, 1.02); }
  }
  @keyframes explorer-jump {
    0%, 100% { transform: translateY(0px) scale(1.06, 0.94); }
    50% { transform: translateY(-18px) scale(0.95, 1.05); }
  }
  @keyframes explorer-ponder {
    0%, 100% { transform: rotate(-1.5deg); }
    50% { transform: rotate(2deg) translateY(-3px); }
  }
  @keyframes explorer-lost-shake {
    0%, 100% { transform: translateX(0); }
    25%, 75% { transform: translateX(-6px) rotate(-2deg); }
    50% { transform: translateX(6px) rotate(2deg); }
  }
  @keyframes scan-horizon {
    0%, 100% { transform: rotate(4deg); }
    50% { transform: rotate(-14deg); }
  }
  @keyframes spyglass-celebrate {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(-22deg) translateY(-4px); }
  }
  @keyframes beam-pulse {
    0% { opacity: 0.2; transform: scaleX(0.85); }
    100% { opacity: 0.55; transform: scaleX(1.1); }
  }
  @keyframes rose-rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes needle-seek {
    0%, 100% { transform: rotate(-18deg); }
    50% { transform: rotate(28deg); }
  }
  @keyframes needle-spin-crazy {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes star-twinkle {
    0%, 100% { transform: scale(0.55) rotate(0deg); opacity: 0.35; }
    50% { transform: scale(1.25) rotate(25deg); opacity: 1; }
  }
  @keyframes explorer-shadow {
    0%, 100% { transform: scale(1); opacity: 0.24; }
    50% { transform: scale(0.86); opacity: 0.15; }
  }
  @keyframes explorer-blink {
    0%, 92%, 100% { transform: scaleY(1); }
    96% { transform: scaleY(0.08); }
  }
`;

/* ==========================================================================
   4. Componente Principal
   ========================================================================== */

export const ExplorerMascot: React.FC<ExplorerMascotProps> = memo(
  ({ mood = "idle", size = 220, className = "", onClick, ...rest }) => {
    const isExploring = mood === "idle" || mood === "happy";

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
          className="explorer-svg overflow-visible"
          data-mood={mood}
        >
          {/* ==============================================================
              1. FUNDO: ROSA DOS VENTOS GIRATÓRIA E TRILHA DE DESCOBERTA
              ============================================================== */}
          <g className="compass-rose-bg" opacity="0.28">
            <circle
              cx="100"
              cy="100"
              r="76"
              stroke={COLORS.compassRing}
              strokeWidth="2.5"
              strokeDasharray="6 6"
            />
            <circle
              cx="100"
              cy="100"
              r="62"
              stroke={COLORS.compassRing}
              strokeWidth="1.5"
            />
            {/* Pontas Cardeais (N, S, L, O) */}
            <path d="M100 16 L106 32 L94 32 Z" fill={COLORS.hatMain} />
            <path d="M100 184 L106 168 L94 168 Z" fill={COLORS.compassRing} />
            <path d="M184 100 L168 106 L168 94 Z" fill={COLORS.compassRing} />
            <path d="M16 100 L32 106 L32 94 Z" fill={COLORS.compassRing} />
          </g>

          {/* Sombra no chão */}
          <ellipse
            className="floor-shadow"
            cx="100"
            cy="180"
            rx="46"
            ry="8"
            fill={COLORS.suitMain}
          />

          {/* Estrelas de Descoberta de Mapa */}
          {isExploring && (
            <g fill={COLORS.hatMain}>
              <path
                className="discovery-star-1"
                d="M174 30 L177 39 L186 42 L177 45 L174 54 L171 45 L162 42 L171 39 Z"
              />
              <path
                className="discovery-star-2"
                d="M36 42 L38.5 49.5 L46 52 L38.5 54.5 L36 62 L33.5 54.5 L26 52 L33.5 49.5 Z"
              />
            </g>
          )}

          {/* Ponto de Interrogação / Rota Recalculando no Modo Thinking */}
          {mood === "thinking" && (
            <g fill={COLORS.hatMain} className="animate-pulse">
              <circle cx="44" cy="64" r="4" />
              <circle cx="34" cy="50" r="6" />
              <circle cx="26" cy="34" r="8.5" />
            </g>
          )}

          {/* ==============================================================
              2. CORPO DO EXPLORADOR COMPLETO
              ============================================================== */}
          <g className="explorer-core">
            {/* 1. Mochila de Expedição + Mapa Enrolado nas Costas */}
            <g>
              {/* Rolo de Mapa / Pergaminho preso no topo da mochila */}
              <rect
                x="52"
                y="84"
                width="26"
                height="10"
                rx="5"
                transform="rotate(-12 65 89)"
                fill={COLORS.compassBg}
                stroke={COLORS.hatDark}
                strokeWidth="2.5"
              />
              <circle cx="55" cy="91" r="3.5" fill={COLORS.leatherDark} />
              {/* Corpo da Mochila */}
              <rect
                x="54"
                y="94"
                width="28"
                height="44"
                rx="10"
                fill={COLORS.leatherDark}
              />
              <rect
                x="57"
                y="92"
                width="26"
                height="40"
                rx="9"
                fill={COLORS.hatDark}
              />
              {/* Bolso lateral da mochila */}
              <rect
                x="60"
                y="108"
                width="14"
                height="18"
                rx="5"
                fill={COLORS.hatMain}
              />
            </g>

            {/* 2. Braço Esquerdo (Segurando a alça da mochila com firmeza) */}
            <path
              d="M76 106 L58 122 L74 134"
              stroke={COLORS.suitDark}
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="75" cy="134" r="6.5" fill={COLORS.skinShadow} />

            {/* 3. Pernas e Botas de Trilha Robustas */}
            <rect
              x="79"
              y="142"
              width="15"
              height="28"
              rx="7.5"
              fill={COLORS.suitDark}
            />
            <rect
              x="105"
              y="142"
              width="15"
              height="28"
              rx="7.5"
              fill={COLORS.suitDark}
            />
            {/* Botas de Couro de Explorador */}
            <rect
              x="75"
              y="160"
              width="21"
              height="14"
              rx="6"
              fill={COLORS.leatherDark}
            />
            <rect
              x="103"
              y="160"
              width="21"
              height="14"
              rx="6"
              fill={COLORS.leatherDark}
            />
            {/* Solado Tratorado Laranja */}
            <rect
              x="74"
              y="170"
              width="23"
              height="5"
              rx="2.5"
              fill={COLORS.hatMain}
            />
            <rect
              x="102"
              y="170"
              width="23"
              height="5"
              rx="2.5"
              fill={COLORS.hatMain}
            />

            {/* 4. Colete / Traje de Explorador */}
            {/* Sombra 3D do Tronco */}
            <rect
              x="72"
              y="100"
              width="56"
              height="50"
              rx="20"
              fill={COLORS.suitDark}
            />
            {/* Corpo Principal do Traje */}
            <rect
              x="72"
              y="95"
              width="56"
              height="48"
              rx="20"
              fill={COLORS.suitMain}
            />

            {/* Faixa Transversal de Couro (Bandoleira) */}
            <path
              d="M78 98 L120 138"
              stroke={COLORS.hatDark}
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Cinto Utilitário */}
            <rect
              x="72"
              y="133"
              width="56"
              height="8"
              rx="4"
              fill={COLORS.leatherDark}
            />

            {/* BÚSSOLA DOURADA PENDURADA NO CINTO (Com Agulha Animada!) */}
            <g>
              <circle cx="86" cy="137" r="11" fill={COLORS.hatMain} />
              <circle cx="86" cy="137" r="8" fill={COLORS.compassBg} />
              {/* Agulha da Bússola */}
              <g className="compass-needle">
                <polygon
                  points="86,130 88.5,137 83.5,137"
                  fill={COLORS.cheek}
                />
                <polygon
                  points="86,144 88.5,137 83.5,137"
                  fill={COLORS.suitMain}
                />
              </g>
              <circle cx="86" cy="137" r="2" fill={COLORS.stroke} />
            </g>

            {/* Insígnia de Estrela do Norte no Peito */}
            <path
              d="M110 108 L112 113 L117 115 L112 117 L110 122 L108 117 L103 115 L108 113 Z"
              fill={COLORS.hatLight}
            />

            {/* Lenço Aventureiro no Pescoço */}
            <path
              d="M78 93 Q100 105 122 93 L114 108 L100 103 L86 108 Z"
              fill={COLORS.hatMain}
            />

            {/* 5. Cabeça e Rosto */}
            {/* Orelhas */}
            <circle cx="69" cy="74" r="7" fill={COLORS.skinShadow} />
            <circle cx="131" cy="74" r="7" fill={COLORS.skinShadow} />

            {/* Relevo 3D da cabeça */}
            <circle cx="100" cy="74" r="30" fill={COLORS.skinShadow} />
            {/* Cabeça principal */}
            <circle cx="100" cy="70" r="30" fill={COLORS.skinLight} />

            {/* Bochechas */}
            <g fill={COLORS.cheek} opacity={mood === "happy" ? "0.7" : "0.4"}>
              <ellipse cx="78" cy="79" rx="5.5" ry="3.5" />
              <ellipse cx="122" cy="79" rx="5.5" ry="3.5" />
            </g>

            {/* Expressão Facial Dinâmica */}
            {FACE_BY_MOOD[mood]}

            {/* 6. CHAPÉU DE EXPLORADOR COMPLETO (Estilo Safari / Indiana) */}
            <g>
              {/* Sombra da Aba do Chapéu */}
              <ellipse cx="100" cy="49" rx="44" ry="10" fill={COLORS.hatDark} />
              {/* Copa do Chapéu */}
              <path
                d="M70 48 C70 24, 86 20, 100 23 C114 20, 130 24, 130 48 Z"
                fill={COLORS.hatMain}
              />
              {/* Afundamento clássico no topo do chapéu */}
              <path
                d="M84 25 Q100 31 116 25"
                stroke={COLORS.hatDark}
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
              {/* Faixa Azul Escura na Base da Copa */}
              <path
                d="M71 42 Q100 47 129 42 L130 48 Q100 53 70 48 Z"
                fill={COLORS.suitMain}
              />
              {/* Aba Frontal Curva do Chapéu */}
              <ellipse
                cx="100"
                cy="46"
                rx="44"
                ry="8.5"
                fill={COLORS.hatMain}
              />
              {/* Brilho Superior no Chapéu */}
              <path
                d="M78 33 Q90 27 104 29"
                stroke={COLORS.hatLight}
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* 7. BRAÇO DIREITO ARTICULADO + LUNETA APONTADA PARA O HORIZONTE */}
            <g className="spyglass-arm">
              {/* Feixe de Visão / Descoberta saindo da Lente */}
              {isExploring && (
                <polygon
                  className="vision-beam"
                  points="162,72 198,48 198,84"
                  fill={COLORS.hatLight}
                />
              )}

              {/* Braço erguendo a luneta */}
              <path
                d="M118 104 L142 86"
                stroke={COLORS.suitMain}
                strokeWidth="13"
                strokeLinecap="round"
              />

              {/* Tubo Telescópico da Luneta (3 Estágios Dourados) */}
              <g transform="rotate(-16 146 78)">
                {/* Estágio 1 (Menor, perto da mão) */}
                <rect
                  x="126"
                  y="73"
                  width="16"
                  height="10"
                  rx="3"
                  fill={COLORS.leatherDark}
                />
                {/* Estágio 2 (Médio) */}
                <rect
                  x="138"
                  y="71"
                  width="18"
                  height="14"
                  rx="3"
                  fill={COLORS.hatDark}
                />
                {/* Estágio 3 (Ponta Larga da Lente) */}
                <rect
                  x="152"
                  y="68"
                  width="16"
                  height="20"
                  rx="4"
                  fill={COLORS.hatMain}
                />
                {/* Lente de Cristal Brilhante */}
                <ellipse
                  cx="167"
                  cy="78"
                  rx="3.5"
                  ry="8"
                  fill={COLORS.lensCyan}
                />
                <ellipse
                  cx="166"
                  cy="75"
                  rx="1.5"
                  ry="3.5"
                  fill={COLORS.white}
                />
              </g>

              {/* Mão segurando a luneta */}
              <circle cx="142" cy="83" r="7.5" fill={COLORS.skinLight} />
            </g>
          </g>
        </svg>
      </div>
    );
  }
);

ExplorerMascot.displayName = "ExplorerMascot";

export default ExplorerMascot;
