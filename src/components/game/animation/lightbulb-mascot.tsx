import React, { memo } from "react";

export type LightbulbMood = "idle" | "happy" | "thinking" | "error";

export interface LightbulbMascotProps
  extends React.HTMLAttributes<HTMLDivElement> {
  mood?: LightbulbMood;
  size?: number;
}

/* ==========================================================================
   1. Tokens de Design (Integrados ao tailwind-colors.css) & Geometria
   ========================================================================== */

const COLORS = {
  bulbGlow: "var(--color-orange-50, #fff6ec)",
  bulbLight: "var(--color-orange-200, #ffd7a8)",
  bulbMain: "var(--color-orange-400, #feb968)",
  bulbDark: "var(--color-orange-500, #fea842)",
  bulbDeep: "var(--color-orange-600, #e7993c)",
  bulbOffMain: "var(--color-blue-50, #e6eaee)",
  bulbOffDark: "var(--color-blue-100, #b0becb)",
  baseLight: "var(--color-blue-200, #8a9eb2)",
  baseMain: "var(--color-blue-400, #335779)",
  baseDark: "var(--color-blue-600, #002950)",
  stroke: "var(--color-blue-800, #001930)",
  shadow: "var(--color-blue-500, #002d58)",
  cheek: "#ff6b6b",
  white: "#ffffff",
} as const;

const MOOD_LABELS: Record<LightbulbMood, string> = {
  idle: "Lâmpada da criatividade acesa e brilhando",
  happy: "Lâmpada tendo um momento Eureka com brilho máximo",
  thinking: "Lâmpada piscando enquanto processa uma ideia",
  error: "Lâmpada apagada sem ideias",
};

const LIGHT_RAYS = [
  { x1: 100, y1: 24, x2: 100, y2: 10 }, // Topo central
  { x1: 48, y1: 42, x2: 36, y2: 30 }, // Diagonal superior esquerda
  { x1: 152, y1: 42, x2: 164, y2: 30 }, // Diagonal superior direita
  { x1: 34, y1: 84, x2: 18, y2: 84 }, // Lateral esquerda
  { x1: 166, y1: 84, x2: 182, y2: 84 }, // Lateral direita
  { x1: 54, y1: 122, x2: 42, y2: 132 }, // Diagonal inferior esquerda
  { x1: 146, y1: 122, x2: 158, y2: 132 }, // Diagonal inferior direita
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
  r = 6.5,
  pupilOffset = { dx: -1.8, dy: -2.2 },
}) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill={COLORS.stroke} />
    <circle
      cx={cx + pupilOffset.dx}
      cy={cy + pupilOffset.dy}
      r={r * 0.38}
      fill={COLORS.white}
    />
    <circle cx={cx + 2.2} cy={cy + 2.2} r={1.3} fill={COLORS.white} />
  </g>
);

const FACE_BY_MOOD: Record<LightbulbMood, React.ReactNode> = {
  idle: (
    <>
      <g className="bulb-eyes-blink">
        <Eye cx={82} cy={88} />
        <Eye cx={118} cy={88} />
      </g>
      <path
        d="M93 97 Q100 104 107 97"
        stroke={COLORS.stroke}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),

  happy: (
    <>
      {/* Olhos felizes de Eureka! (^ ^) */}
      <path
        d="M74 90 Q82 80 90 90"
        stroke={COLORS.stroke}
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M110 90 Q118 80 126 90"
        stroke={COLORS.stroke}
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Sorriso aberto radiante */}
      <path d="M90 96 Q100 112 110 96 Z" fill={COLORS.stroke} />
      <path
        d="M95 103 Q100 107 105 103"
        stroke={COLORS.cheek}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </>
  ),

  thinking: (
    <>
      {/* Sobrancelhas de quem está quase tendo uma ideia */}
      <path
        d="M75 76 L88 78"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M112 74 Q118 69 125 74"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <Eye cx={82} cy={88} r={6} pupilOffset={{ dx: 2, dy: -3 }} />
      <Eye cx={118} cy={88} r={6} pupilOffset={{ dx: 2, dy: -3 }} />
      <circle cx={102} cy={99} r={3.8} fill={COLORS.stroke} />
    </>
  ),

  error: (
    <>
      {/* Olhos cansados / Lâmpada queimada ou apagada */}
      <path
        d="M74 82 L88 86"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M126 82 L112 86"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M76 91 Q82 95 88 91"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M112 91 Q118 95 124 91"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M93 104 Q100 97 107 104"
        stroke={COLORS.stroke}
        strokeWidth="3.8"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),
};

/* ==========================================================================
   3. Estilos de Animação (Brilho Pulsante, Raios de Luz e Filamento)
   ========================================================================== */

const ANIMATION_STYLES = `
  .bulb-svg .bulb-body {
    transform-origin: 100px 155px;
  }
  .bulb-svg[data-mood="idle"] .bulb-body {
    animation: bulb-float 2.4s ease-in-out infinite;
    filter: drop-shadow(0 0 12px rgba(254, 168, 66, 0.45));
  }
  .bulb-svg[data-mood="happy"] .bulb-body {
    animation: bulb-eureka 0.55s ease-in-out infinite;
    filter: drop-shadow(0 0 22px rgba(254, 168, 66, 0.8));
  }
  .bulb-svg[data-mood="thinking"] .bulb-body {
    animation: bulb-flicker-tilt 2s ease-in-out infinite;
  }
  .bulb-svg[data-mood="error"] .bulb-body {
    animation: bulb-off-drop 0.5s ease-out forwards;
  }

  /* Aura luminosa atrás da lâmpada */
  .bulb-svg .bulb-aura {
    transform-origin: 100px 84px;
    animation: aura-pulse 1.8s ease-in-out infinite;
  }
  .bulb-svg[data-mood="happy"] .bulb-aura {
    animation: aura-intense 0.55s ease-in-out infinite;
  }
  .bulb-svg[data-mood="thinking"] .bulb-aura {
    animation: aura-flicker 1.2s infinite;
  }

  /* Raios de luz pulsando alternados */
  .bulb-svg .light-ray-even {
    transform-origin: 100px 84px;
    animation: ray-shoot 1.6s ease-in-out infinite;
  }
  .bulb-svg .light-ray-odd {
    transform-origin: 100px 84px;
    animation: ray-shoot 1.6s ease-in-out infinite 0.8s;
  }
  .bulb-svg[data-mood="happy"] .light-ray-even,
  .bulb-svg[data-mood="happy"] .light-ray-odd {
    animation-duration: 0.6s;
  }

  /* Filamento interno incandescente */
  .bulb-svg .bulb-filament {
    animation: filament-glow 1.2s ease-in-out infinite alternate;
  }

  /* Estrelinhas de criatividade */
  .bulb-svg .idea-sparkle-1 {
    transform-origin: 34px 56px;
    animation: sparkle-pop 1.5s ease-in-out infinite;
  }
  .bulb-svg .idea-sparkle-2 {
    transform-origin: 168px 60px;
    animation: sparkle-pop 1.5s ease-in-out infinite 0.75s;
  }

  /* Sombra no chão */
  .bulb-svg .floor-shadow {
    transform-origin: center;
    animation: shadow-float 2.4s ease-in-out infinite;
  }

  /* Piscar de olhos */
  .bulb-svg .bulb-eyes-blink {
    transform-origin: 100px 88px;
    animation: eye-blink 3.5s infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .bulb-svg * { animation: none !important; }
  }

  @keyframes bulb-float {
    0%, 100% { transform: translateY(0px) scale(1.02, 0.98); }
    50% { transform: translateY(-12px) scale(0.98, 1.02); }
  }
  @keyframes bulb-eureka {
    0%, 100% { transform: translateY(0px) scale(1.06, 0.94); }
    50% { transform: translateY(-20px) scale(0.95, 1.05) rotate(2deg); }
  }
  @keyframes bulb-flicker-tilt {
    0%, 100% { transform: translateY(-2px) rotate(-3deg); }
    50% { transform: translateY(-8px) rotate(3deg); }
  }
  @keyframes bulb-off-drop {
    0% { transform: translateY(0); }
    100% { transform: translateY(5px) rotate(-2deg); }
  }
  @keyframes aura-pulse {
    0%, 100% { transform: scale(0.92); opacity: 0.45; }
    50% { transform: scale(1.12); opacity: 0.8; }
  }
  @keyframes aura-intense {
    0%, 100% { transform: scale(1); opacity: 0.65; }
    50% { transform: scale(1.26); opacity: 0.95; }
  }
  @keyframes aura-flicker {
    0%, 100% { opacity: 0.2; transform: scale(0.85); }
    40% { opacity: 0.65; transform: scale(1.02); }
    45% { opacity: 0.15; transform: scale(0.82); }
    75% { opacity: 0.7; transform: scale(1.05); }
  }
  @keyframes ray-shoot {
    0%, 100% { transform: scale(0.88); opacity: 0.35; }
    50% { transform: scale(1.14); opacity: 1; }
  }
  @keyframes filament-glow {
    0% { opacity: 0.65; stroke-width: 3.5px; }
    100% { opacity: 1; stroke-width: 5px; }
  }
  @keyframes sparkle-pop {
    0%, 100% { transform: scale(0.5) rotate(0deg); opacity: 0.3; }
    50% { transform: scale(1.25) rotate(25deg); opacity: 1; }
  }
  @keyframes shadow-float {
    0%, 100% { transform: scale(1); opacity: 0.22; }
    50% { transform: scale(0.75); opacity: 0.11; }
  }
  @keyframes eye-blink {
    0%, 92%, 100% { transform: scaleY(1); }
    96% { transform: scaleY(0.08); }
  }
`;

/* ==========================================================================
   4. Componente Principal
   ========================================================================== */

export const LightbulbMascot: React.FC<LightbulbMascotProps> = memo(
  ({ mood = "idle", size = 90, className = "", onClick, ...rest }) => {
    const isLit = mood !== "error";
    const glassMain = isLit ? COLORS.bulbMain : COLORS.bulbOffMain;
    const glassDark = isLit ? COLORS.bulbDark : COLORS.bulbOffDark;

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
          className="bulb-svg overflow-visible"
          data-mood={mood}
        >
          {/* Sombra no chão */}
          <ellipse
            className="floor-shadow"
            cx="100"
            cy="182"
            rx="38"
            ry="7.5"
            fill={COLORS.shadow}
          />

          {/* ==============================================================
              1. CAMADA DE BRILHO EXTERNO (Aura Difusa + Raios + Faíscas)
              ============================================================== */}
          {isLit && (
            <g>
              {/* Aura circular pulsante atrás do vidro */}
              <circle
                className="bulb-aura"
                cx="100"
                cy="84"
                r="64"
                fill={COLORS.bulbLight}
              />
              <circle
                className="bulb-aura"
                cx="100"
                cy="84"
                r="52"
                fill={COLORS.bulbGlow}
              />

              {/* Raios de Luz ao redor da lâmpada */}
              <g
                stroke={mood === "happy" ? COLORS.bulbDeep : COLORS.bulbDark}
                strokeWidth="5"
                strokeLinecap="round"
              >
                {LIGHT_RAYS.map((ray, index) => (
                  <line
                    key={`ray-${index}`}
                    className={
                      index % 2 === 0 ? "light-ray-even" : "light-ray-odd"
                    }
                    {...ray}
                  />
                ))}
              </g>

              {/* Estrelas de Criatividade / Ideia Brilhante */}
              <g fill={COLORS.bulbDeep}>
                <path
                  className="idea-sparkle-1"
                  d="M34 46 L36.5 53.5 L44 56 L36.5 58.5 L34 66 L31.5 58.5 L24 56 L31.5 53.5 Z"
                />
                <path
                  className="idea-sparkle-2"
                  d="M168 50 L170.5 57.5 L178 60 L170.5 62.5 L168 70 L165.5 62.5 L158 60 L165.5 57.5 Z"
                />
              </g>
            </g>
          )}

          {/* ==============================================================
              2. CORPO DA LÂMPADA (Soquete + Bulbo 3D + Filamento + Rosto)
              ============================================================== */}
          <g className="bulb-body">
            {/* Contato Elétrico Inferior (Ponta preta/azul-escura da base) */}
            <path d="M88 156 Q100 170 112 156 Z" fill={COLORS.stroke} />

            {/* Rosca Metálica da Base (Soquete E27 estilo cartoon) */}
            {/* Sombra 3D do soquete */}
            <rect
              x="76"
              y="132"
              width="48"
              height="26"
              rx="10"
              fill={COLORS.baseDark}
            />
            {/* Corpo principal do soquete */}
            <rect
              x="76"
              y="128"
              width="48"
              height="24"
              rx="9"
              fill={COLORS.baseMain}
            />
            {/* Anéis de relevo da rosca metálica */}
            <path
              d="M80 137 H120"
              stroke={COLORS.baseDark}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M80 145 H120"
              stroke={COLORS.baseDark}
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Brilho lateral da rosca */}
            <path
              d="M82 132 V147"
              stroke={COLORS.baseLight}
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Bulbo de Vidro - Camada de Sombra 3D Flat (Relevo Inferior) */}
            <path
              d="M100 38 C71 38, 52 59, 52 86 C52 104, 63 116, 72 126 C75 130, 77 134, 78 136 H122 C123 134, 125 130, 128 126 C137 116, 148 104, 148 86 C148 59, 129 38, 100 38 Z"
              fill={glassDark}
            />

            {/* Bulbo de Vidro - Camada Principal Iluminada */}
            <path
              d="M100 32 C71 32, 52 53, 52 80 C52 98, 63 110, 72 120 C75 124, 77 128, 78 130 H122 C123 128, 125 124, 128 120 C137 110, 148 98, 148 80 C148 53, 129 32, 100 32 Z"
              fill={glassMain}
            />

            {/* Miolo Radiante Interno (Quando acesa) */}
            {isLit && (
              <circle
                cx="100"
                cy="78"
                r="33"
                fill={COLORS.bulbLight}
                opacity="0.65"
              />
            )}

            {/* Filamento Incandescente (Desenho de energia criativa no topo interno) */}
            <path
              className={isLit ? "bulb-filament" : ""}
              d="M88 68 C84 54, 96 48, 100 58 C104 48, 116 54, 112 68"
              stroke={isLit ? COLORS.bulbGlow : COLORS.baseLight}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Reflexo de Vidro Curvo no Canto Superior Esquerdo */}
            <path
              d="M64 68 C66 54, 76 44, 90 42"
              stroke={COLORS.white}
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
            <circle cx="62" cy="80" r="3" fill={COLORS.white} opacity="0.85" />

            {/* Bochechas Coradas */}
            {isLit && (
              <g
                fill={COLORS.cheek}
                opacity={mood === "happy" ? "0.7" : "0.45"}
              >
                <ellipse cx="68" cy="96" rx="6.5" ry="4" />
                <ellipse cx="132" cy="96" rx="6.5" ry="4" />
              </g>
            )}

            {/* Expressão Facial Dinâmica */}
            {FACE_BY_MOOD[mood]}
          </g>
        </svg>
      </div>
    );
  }
);

LightbulbMascot.displayName = "LightbulbMascot";

export default LightbulbMascot;
