import React, { memo } from "react";

export type SpecialistMood = "idle" | "happy" | "thinking" | "error";

export interface IndependentSpecialistMascotProps
  extends React.HTMLAttributes<HTMLDivElement> {
  mood?: SpecialistMood;
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
  goldGlow: "var(--color-orange-50, #fff6ec)",
  goldLight: "var(--color-orange-300, #fec580)",
  goldMain: "var(--color-orange-500, #fea842)",
  goldDark: "var(--color-orange-600, #e7993c)",
  steelLight: "var(--color-blue-50, #e6eaee)",
  steelMain: "var(--color-blue-100, #b0becb)",
  steelDark: "var(--color-blue-300, #54728f)",
  lensCyan: "#38bdf8",
  cheek: "#ff6b6b",
  white: "#ffffff",
} as const;

const MOOD_LABELS: Record<SpecialistMood, string> = {
  idle: "Especialista independente analisando e lapidando sua maestria",
  happy: "Especialista independente celebrando a excelência técnica",
  thinking: "Especialista independente calibrando a lente de precisão",
  error: "Especialista independente revisando uma anomalia técnica",
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
  r = 5,
  pupilOffset = { dx: 1.5, dy: -1 },
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

const FACE_BY_MOOD: Record<SpecialistMood, React.ReactNode> = {
  idle: (
    <>
      {/* Sobrancelha esquerda calma e direita arqueada (olhar clínico) */}
      <path
        d="M68 63 Q74 61 80 63"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M92 58 Q99 54 105 59"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <g className="specialist-eyes-blink">
        <Eye cx={74} cy={72} />
        {/* Olho direito ampliado pela lente de especialista */}
        <Eye cx={98} cy={72} r={6.2} pupilOffset={{ dx: 2, dy: -1 }} />
      </g>
      {/* Sorriso de canto confiante e autossuficiente */}
      <path
        d="M79 83 Q87 88 94 81"
        stroke={COLORS.stroke}
        strokeWidth="3.4"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),

  happy: (
    <>
      <path
        d="M68 72 Q74 64 80 72"
        stroke={COLORS.stroke}
        strokeWidth="3.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M92 72 Q98 64 104 72"
        stroke={COLORS.stroke}
        strokeWidth="3.8"
        strokeLinecap="round"
        fill="none"
      />
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
        d="M68 64 L80 65"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M92 57 Q99 52 105 57"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <Eye cx={74} cy={72} pupilOffset={{ dx: 2.2, dy: -1.5 }} />
      <Eye cx={98} cy={72} r={6.2} pupilOffset={{ dx: 2.5, dy: -1.5 }} />
      <circle cx={87} cy={84} r={3.2} fill={COLORS.stroke} />
    </>
  ),

  error: (
    <>
      <path
        d="M68 65 L80 61"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M105 65 L92 61"
        stroke={COLORS.stroke}
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <Eye cx={74} cy={73} pupilOffset={{ dx: 0, dy: 1.5 }} />
      <Eye cx={98} cy={73} r={5.8} pupilOffset={{ dx: 0, dy: 1.5 }} />
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
   3. Estilos de Animação (Monóculo de Precisão + Diamante de Maestria)
   ========================================================================== */

const ANIMATION_STYLES = `
  /* Postura firme e autônoma do Especialista */
  .specialist-svg .specialist-core {
    transform-origin: 86px 172px;
    animation: specialist-stance 2.4s ease-in-out infinite;
  }
  .specialist-svg[data-mood="happy"] .specialist-core {
    animation: specialist-triumph 0.55s ease-in-out infinite;
    filter: drop-shadow(0 8px 16px rgba(254, 168, 66, 0.35));
  }
  .specialist-svg[data-mood="thinking"] .specialist-core {
    animation: specialist-inspect 2.2s ease-in-out infinite;
  }
  .specialist-svg[data-mood="error"] .specialist-core {
    animation: none;
  }

  /* Lupa / Monóculo fazendo ajuste fino de foco (Zoom In / Out) */
  .specialist-svg .specialist-loupe {
    transform-origin: 98px 72px;
    animation: loupe-calibrate 2.4s ease-in-out infinite;
  }

  /* DIAMANTE DE MAESTRIA FLUTUANDO E LAPIDANDO */
  .specialist-svg .mastery-gem {
    transform-origin: 154px 86px;
    animation: gem-float 2s ease-in-out infinite;
  }
  .specialist-svg[data-mood="happy"] .mastery-gem {
    animation: gem-shine-fast 0.55s ease-in-out infinite;
  }
  .specialist-svg[data-mood="error"] .mastery-gem {
    animation: none;
    transform: translateY(10px) rotate(-8deg);
    opacity: 0.65;
  }

  /* Feixe de análise técnica entre o monóculo e o cristal */
  .specialist-svg .scan-ray {
    animation: ray-scan-pulse 1.2s ease-in-out infinite alternate;
  }

  /* Anel Hexagonal de Autossuficiência ao fundo */
  .specialist-svg .autonomy-orbit {
    transform-origin: 96px 105px;
    animation: orbit-rotate 16s linear infinite;
  }
  .specialist-svg[data-mood="happy"] .autonomy-orbit {
    animation-duration: 6s;
  }

  /* Brilhos de precisão ao redor do diamante */
  .specialist-svg .precision-spark-1 {
    transform-origin: 154px 52px;
    animation: spark-twinkle 1.4s ease-in-out infinite;
  }
  .specialist-svg .precision-spark-2 {
    transform-origin: 180px 84px;
    animation: spark-twinkle 1.4s ease-in-out infinite 0.7s;
  }

  /* Sombra no chão */
  .specialist-svg .floor-shadow {
    transform-origin: 86px 180px;
    animation: specialist-shadow 2.4s ease-in-out infinite;
  }

  /* Piscar de olhos */
  .specialist-svg .specialist-eyes-blink {
    transform-origin: 86px 72px;
    animation: specialist-blink 3.8s infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .specialist-svg * { animation: none !important; }
  }

  @keyframes specialist-stance {
    0%, 100% { transform: translateY(0px) scale(1.01, 0.99); }
    50% { transform: translateY(-6px) scale(0.99, 1.01); }
  }
  @keyframes specialist-triumph {
    0%, 100% { transform: translateY(0px) scale(1.05, 0.95); }
    50% { transform: translateY(-15px) scale(0.96, 1.04); }
  }
  @keyframes specialist-inspect {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(2.5deg) translateX(2px); }
  }
  @keyframes loupe-calibrate {
    0%, 100% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.1) rotate(12deg); }
  }
  @keyframes gem-float {
    0%, 100% { transform: translateY(3px) scale(0.97); }
    50% { transform: translateY(-9px) scale(1.05); }
  }
  @keyframes gem-shine-fast {
    0%, 100% { transform: translateY(-2px) scale(1.05) rotate(-4deg); }
    50% { transform: translateY(-16px) scale(1.15) rotate(4deg); }
  }
  @keyframes ray-scan-pulse {
    0% { opacity: 0.15; }
    100% { opacity: 0.5; }
  }
  @keyframes orbit-rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes spark-twinkle {
    0%, 100% { transform: scale(0.5) rotate(0deg); opacity: 0.3; }
    50% { transform: scale(1.25) rotate(25deg); opacity: 1; }
  }
  @keyframes specialist-shadow {
    0%, 100% { transform: scale(1); opacity: 0.22; }
    50% { transform: scale(0.86); opacity: 0.14; }
  }
  @keyframes specialist-blink {
    0%, 92%, 100% { transform: scaleY(1); }
    96% { transform: scaleY(0.08); }
  }
`;

/* ==========================================================================
   4. Componente Principal
   ========================================================================== */

export const IndependentSpecialistMascot: React.FC<IndependentSpecialistMascotProps> =
  memo(({ mood = "idle", size = 90, className = "", onClick, ...rest }) => {
    const isActive = mood !== "error";

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
          className="specialist-svg overflow-visible"
          data-mood={mood}
        >
          {/* ==============================================================
              1. CAMPO ORBITAL DE AUTOSSUFICIÊNCIA & SOMBRAS NO CHÃO
              ============================================================== */}
          <g className="autonomy-orbit" opacity="0.28">
            <circle
              cx="96"
              cy="105"
              r="72"
              stroke={COLORS.steelMain}
              strokeWidth="2"
              strokeDasharray="10 8"
            />
            {/* Nodos de Domínio Técnico na Órbita */}
            <polygon points="96,29 101,35 96,41 91,35" fill={COLORS.goldMain} />
            <polygon
              points="96,169 101,175 96,181 91,175"
              fill={COLORS.suitLight}
            />
            <polygon
              points="20,105 26,100 32,105 26,110"
              fill={COLORS.suitLight}
            />
          </g>

          {/* Sombra do Especialista e do Cristal no Chão */}
          <ellipse
            className="floor-shadow"
            cx="86"
            cy="180"
            rx="42"
            ry="7.5"
            fill={COLORS.suitMain}
          />
          <ellipse
            cx="154"
            cy="180"
            rx="16"
            ry="4"
            fill={COLORS.goldMain}
            opacity="0.22"
          />

          {/* ==============================================================
              2. CORPO DO ESPECIALISTA INDEPENDENTE
              ============================================================== */}
          <g className="specialist-core">
            {/* Braço Esquerdo (Cruzado/Apoiado no cinto técnico com autossuficiência) */}
            <path
              d="M62 108 L46 122 L64 136"
              stroke={COLORS.suitDark}
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx="65" cy="136" r="6.5" fill={COLORS.skinShadow} />

            {/* Pernas e Botas Técnicas */}
            <rect
              x="67"
              y="142"
              width="14"
              height="28"
              rx="7"
              fill={COLORS.suitDark}
            />
            <rect
              x="91"
              y="142"
              width="14"
              height="28"
              rx="7"
              fill={COLORS.suitDark}
            />
            <rect
              x="63"
              y="162"
              width="20"
              height="12"
              rx="6"
              fill={COLORS.stroke}
            />
            <rect
              x="89"
              y="162"
              width="20"
              height="12"
              rx="6"
              fill={COLORS.stroke}
            />
            {/* Detalhe Laranja no Solado */}
            <rect
              x="63"
              y="170"
              width="20"
              height="4"
              rx="2"
              fill={COLORS.goldMain}
            />
            <rect
              x="89"
              y="170"
              width="20"
              height="4"
              rx="2"
              fill={COLORS.goldMain}
            />

            {/* Jaqueta / Traje Técnico de Especialista */}
            {/* Sombra 3D do Tronco */}
            <rect
              x="58"
              y="100"
              width="56"
              height="48"
              rx="20"
              fill={COLORS.suitDark}
            />
            {/* Corpo Principal */}
            <rect
              x="58"
              y="95"
              width="56"
              height="46"
              rx="20"
              fill={COLORS.suitMain}
            />

            {/* Gola Alta Estruturada (Estilo Especialista / Arquiteto) */}
            <path
              d="M70 92 H102 L106 104 H66 Z"
              fill={COLORS.suitDark}
              stroke={COLORS.goldMain}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Linha Assimétrica de Design Técnico no Traje */}
            <path
              d="M76 104 V136"
              stroke={COLORS.suitLight}
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Insígnia de Especialista Sênior no Peito (Hexágono + Estrela) */}
            <polygon
              points="96,108 103,112 103,120 96,124 89,120 89,112"
              fill={COLORS.goldMain}
            />
            <circle cx="96" cy="116" r="3" fill={COLORS.goldGlow} />

            {/* Cinto Multi-Ferramentas Minimalista */}
            <rect
              x="58"
              y="133"
              width="56"
              height="7"
              rx="3.5"
              fill={COLORS.stroke}
            />
            <rect
              x="72"
              y="131"
              width="10"
              height="11"
              rx="2.5"
              fill={COLORS.steelMain}
            />
            <rect
              x="90"
              y="131"
              width="10"
              height="11"
              rx="2.5"
              fill={COLORS.goldDark}
            />

            {/* Cabeça e Rosto */}
            {/* Orelha Esquerda com Comunicador/Headset de Especialista */}
            <circle cx="57" cy="73" r="6.5" fill={COLORS.skinShadow} />
            <rect
              x="52"
              y="67"
              width="6"
              height="12"
              rx="3"
              fill={COLORS.goldMain}
              stroke={COLORS.stroke}
              strokeWidth="2"
            />
            {/* Orelha Direita */}
            <circle cx="115" cy="73" r="6.5" fill={COLORS.skinShadow} />

            {/* Relevo 3D da cabeça */}
            <circle cx="86" cy="73" r="28" fill={COLORS.skinShadow} />
            {/* Cabeça principal */}
            <circle cx="86" cy="69" r="28" fill={COLORS.skinLight} />

            {/* Bochechas */}
            <g fill={COLORS.cheek} opacity={mood === "happy" ? "0.65" : "0.35"}>
              <ellipse cx="66" cy="78" rx="5" ry="3.2" />
              <ellipse cx="108" cy="78" rx="5" ry="3.2" />
            </g>

            {/* Cabelo Preciso / Estilo Executivo Técnico */}
            <path
              d="M58 61 C57 37, 78 31, 100 34 C110 35, 118 43, 115 57 C106 47, 90 45, 74 49 C66 51, 61 55, 58 61 Z"
              fill={COLORS.suitDark}
            />
            <path
              d="M72 36 C84 27, 102 27, 110 38 C98 35, 86 36, 72 36 Z"
              fill={COLORS.suitMain}
            />

            {/* Expressão Facial */}
            {FACE_BY_MOOD[mood]}

            {/* ============================================================
                FEIXE DE ESCANEAMENTO CLÍNICO (DO MONÓCULO PARA O CRISTAL)
                ============================================================ */}
            {isActive && (
              <polygon
                className="scan-ray"
                points="108,72 154,68 154,104"
                fill={COLORS.lensCyan}
              />
            )}

            {/* ============================================================
                LUPA / MONÓCULO DE PRECISÃO NO OLHO DIREITO
                ============================================================ */}
            <g className="specialist-loupe">
              {/* Lente Translúcida Ciano */}
              <circle
                cx="98"
                cy="72"
                r="13.5"
                fill={COLORS.lensCyan}
                fillOpacity="0.22"
                stroke={COLORS.goldMain}
                strokeWidth="3.5"
              />
              {/* Aro Interno Metálico de Calibragem */}
              <circle
                cx="98"
                cy="72"
                r="10.5"
                stroke={COLORS.goldGlow}
                strokeWidth="1.2"
                strokeDasharray="4 3"
                fill="none"
              />
              {/* Pino Lateral do Monóculo Técnico */}
              <rect
                x="110"
                y="69"
                width="6"
                height="6"
                rx="2"
                fill={COLORS.goldDark}
              />
              {/* Reflexo na Lente */}
              <path
                d="M91 65 L95 62"
                stroke={COLORS.white}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>

            {/* Braço Direito Sustendo a Plataforma do Cristal de Maestria */}
            <path
              d="M106 108 L128 114 L142 108"
              stroke={COLORS.suitMain}
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Mão Estendida com Precisão */}
            <ellipse cx="146" cy="107" rx="8" ry="5" fill={COLORS.skinLight} />
          </g>

          {/* ==============================================================
              3. CRISTAL / DIAMANTE DE MAESTRIA LAPIDADO (ALTO VALOR TÉCNICO)
              ============================================================== */}
          <g className="mastery-gem">
            {/* Aura de Excelência atrás do Diamante */}
            {isActive && (
              <circle
                cx="154"
                cy="84"
                r="24"
                fill={COLORS.goldGlow}
                opacity="0.75"
              />
            )}

            {/* Polígono do Diamante Lapidado 3D */}
            {/* Face Superior Clara */}
            <polygon
              points="142,74 166,74 174,84 134,84"
              fill={COLORS.goldLight}
            />
            {/* Face Inferior Laranja Principal */}
            <polygon points="134,84 174,84 154,104" fill={COLORS.goldMain} />
            {/* Faceta Lateral Sombreada (Profundidade 3D) */}
            <polygon points="154,84 174,84 154,104" fill={COLORS.goldDark} />
            {/* Faceta Central Brilhante */}
            <polygon points="146,74 162,74 154,84" fill={COLORS.goldGlow} />
            {/* Contorno Nitidamente Lapidado */}
            <polygon
              points="142,74 166,74 174,84 154,104 134,84"
              stroke={COLORS.stroke}
              strokeWidth="3"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M134 84 H174 M142 74 L154 104 M166 74 L154 104"
              stroke={COLORS.stroke}
              strokeWidth="2"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Faíscas de Perfeição Técnica */}
            {isActive && (
              <g fill={COLORS.goldMain}>
                <path
                  className="precision-spark-1"
                  d="M154 44 L156.5 50.5 L163 53 L156.5 55.5 L154 62 L151.5 55.5 L145 53 L151.5 50.5 Z"
                />
                <path
                  className="precision-spark-2"
                  d="M182 76 L184 81 L189 83 L184 85 L182 90 L180 85 L175 83 L180 81 Z"
                />
              </g>
            )}
          </g>
        </svg>
      </div>
    );
  });

IndependentSpecialistMascot.displayName = "IndependentSpecialistMascot";

export default IndependentSpecialistMascot;
