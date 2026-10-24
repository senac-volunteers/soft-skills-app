import React, { memo } from "react";

export type BrainMood = "idle" | "happy" | "thinking" | "error";

export interface BrainMascotProps extends React.HTMLAttributes<HTMLDivElement> {
  mood?: BrainMood;
  size?: number;
}

/* ==========================================================================
   1. Tokens de Design & Geometria Estática (Fora do Render)
   ========================================================================== */

const COLORS = {
  brainLight: "#ff9eb0",
  brainMain: "#ff7890",
  brainDark: "#d95b72",
  cheek: "#ff4d6d",
  stroke: "var(--color-blue-800, #001930)",
  shadow: "var(--color-blue-500, #002d58)",
  accent: "var(--color-orange-500, #fea842)",
  white: "#ffffff",
} as const;

const MOOD_LABELS: Record<BrainMood, string> = {
  idle: "Mascote cérebro calmo",
  happy: "Mascote cérebro comemorando",
  thinking: "Mascote cérebro pensando",
  error: "Mascote cérebro triste",
};

const BASE_CIRCLES = [
  { cx: 62, cy: 118, r: 26 },
  { cx: 138, cy: 118, r: 26 },
  { cx: 82, cy: 128, r: 24 },
  { cx: 118, cy: 128, r: 24 },
  { cx: 54, cy: 92, r: 24 },
  { cx: 146, cy: 92, r: 24 },
];

const BODY_CIRCLES = [
  { cx: 62, cy: 110, r: 26 },
  { cx: 138, cy: 110, r: 26 },
  { cx: 54, cy: 86, r: 24 },
  { cx: 146, cy: 86, r: 24 },
  { cx: 72, cy: 66, r: 25 },
  { cx: 128, cy: 66, r: 25 },
  { cx: 100, cy: 62, r: 24 },
  { cx: 82, cy: 120, r: 24 },
  { cx: 118, cy: 120, r: 24 },
  { cx: 100, cy: 95, r: 35 },
];

const BRAIN_FOLDS = [
  "M100 44 L100 62",
  "M100 132 L100 143",
  "M52 82 C62 78, 70 84, 68 94",
  "M48 110 C58 106, 66 112, 64 122",
  "M76 64 C84 68, 86 76, 80 82",
  "M148 82 C138 78, 130 84, 132 94",
  "M152 110 C142 106, 134 112, 136 122",
  "M124 64 C116 68, 114 76, 120 82",
];

/* ==========================================================================
   2. Subcomponentes Internos e Mapa de Expressões
   ========================================================================== */

interface EyeProps {
  cx: number;
  cy: number;
  r?: number;
  pupilOffset?: { dx: number; dy: number };
  secondarySparkle?: boolean;
}

const Eye: React.FC<EyeProps> = ({
  cx,
  cy,
  r = 8,
  pupilOffset = { dx: -2, dy: -3 },
  secondarySparkle = true,
}) => (
  <g>
    <circle cx={cx} cy={cy} r={r} fill={COLORS.stroke} />
    <circle
      cx={cx + pupilOffset.dx}
      cy={cy + pupilOffset.dy}
      r={r * 0.375}
      fill={COLORS.white}
    />
    {secondarySparkle && (
      <circle cx={cx + 3} cy={cy + 3} r={1.5} fill={COLORS.white} />
    )}
  </g>
);

const FACE_BY_MOOD: Record<BrainMood, React.ReactNode> = {
  idle: (
    <>
      <g className="eyes-blink">
        <Eye cx={82} cy={100} />
        <Eye cx={118} cy={100} />
      </g>
      <path
        d="M93 108 Q100 116 107 108"
        stroke={COLORS.stroke}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </>
  ),

  happy: (
    <>
      <path
        d="M74 102 Q82 92 90 102"
        stroke={COLORS.stroke}
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M110 102 Q118 92 126 102"
        stroke={COLORS.stroke}
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M90 107 Q100 124 110 107 Z" fill={COLORS.stroke} />
      <path
        d="M95 114 Q100 118 105 114"
        stroke={COLORS.brainMain}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </>
  ),

  thinking: (
    <>
      <path
        d="M75 88 Q82 85 88 89"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M112 86 Q118 82 125 86"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <Eye
        cx={82}
        cy={100}
        r={7.5}
        pupilOffset={{ dx: 2, dy: -4 }}
        secondarySparkle={false}
      />
      <Eye
        cx={118}
        cy={100}
        r={7.5}
        pupilOffset={{ dx: 2, dy: -4 }}
        secondarySparkle={false}
      />
      <circle cx={102} cy={112} r={4} fill={COLORS.stroke} />
    </>
  ),

  error: (
    <>
      <path
        d="M74 92 L88 96"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M126 92 L112 96"
        stroke={COLORS.stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <Eye
        cx={82}
        cy={103}
        r={7}
        pupilOffset={{ dx: -2, dy: -2 }}
        secondarySparkle={false}
      />
      <Eye
        cx={118}
        cy={103}
        r={7}
        pupilOffset={{ dx: -2, dy: -2 }}
        secondarySparkle={false}
      />
      <path
        d="M93 115 Q100 108 107 115"
        stroke={COLORS.stroke}
        strokeWidth="4"
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
  .brain-svg .brain-body { transform-origin: center bottom; }
  .brain-svg[data-mood="idle"] .brain-body { animation: brain-float 2.2s ease-in-out infinite; }
  .brain-svg[data-mood="happy"] .brain-body {
    animation: brain-jump 0.55s ease-in-out infinite;
    filter: drop-shadow(0 8px 16px rgba(254, 168, 66, 0.35));
  }
  .brain-svg[data-mood="thinking"] .brain-body { animation: brain-tilt 2.5s ease-in-out infinite; }
  .brain-svg[data-mood="error"] .brain-body { animation: brain-shake 0.5s ease-in-out; }

  .brain-svg .floor-shadow {
    transform-origin: center;
    animation: shadow-pulse 2.2s ease-in-out infinite;
  }
  .brain-svg[data-mood="happy"] .floor-shadow { animation: shadow-jump 0.55s ease-in-out infinite; }

  .brain-svg .eyes-blink {
    transform-origin: center 100px;
    animation: eye-blink 3.5s infinite;
  }

  .brain-svg .sparkle-1 {
    transform-origin: 40px 45px;
    animation: sparkle-twinkle 1.6s ease-in-out infinite;
  }
  .brain-svg .sparkle-2 {
    transform-origin: 165px 50px;
    animation: sparkle-twinkle 1.6s ease-in-out infinite 0.8s;
  }

  @media (prefers-reduced-motion: reduce) {
    .brain-svg * { animation: none !important; }
  }

  @keyframes brain-float {
    0%, 100% { transform: translateY(0px) scale(1.03, 0.97); }
    50% { transform: translateY(-12px) scale(0.98, 1.02); }
  }
  @keyframes brain-jump {
    0%, 100% { transform: translateY(0px) scale(1.08, 0.92); }
    50% { transform: translateY(-22px) scale(0.94, 1.06) rotate(3deg); }
  }
  @keyframes brain-tilt {
    0%, 100% { transform: translateY(-4px) rotate(-3deg); }
    50% { transform: translateY(-10px) rotate(4deg); }
  }
  @keyframes brain-shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-7px) rotate(-2deg); }
    40%, 80% { transform: translateX(7px) rotate(2deg); }
  }
  @keyframes shadow-pulse {
    0%, 100% { transform: scale(1); opacity: 0.22; }
    50% { transform: scale(0.78); opacity: 0.12; }
  }
  @keyframes shadow-jump {
    0%, 100% { transform: scale(1.05); opacity: 0.26; }
    50% { transform: scale(0.6); opacity: 0.08; }
  }
  @keyframes eye-blink {
    0%, 92%, 100% { transform: scaleY(1); }
    96% { transform: scaleY(0.08); }
  }
  @keyframes sparkle-twinkle {
    0%, 100% { transform: scale(0.6) rotate(0deg); opacity: 0.35; }
    50% { transform: scale(1.2) rotate(20deg); opacity: 1; }
  }
`;

/* ==========================================================================
   4. Componente Principal
   ========================================================================== */

export const BrainMascot: React.FC<BrainMascotProps> = memo(
  ({ mood = "idle", size = 90, className = "", onClick, ...rest }) => {
    const showSparkles = mood === "idle" || mood === "happy";
    const cheekOpacity = mood === "happy" ? 0.75 : 0.45;

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
          className="brain-svg overflow-visible"
          data-mood={mood}
        >
          {/* Sombra no chão */}
          <ellipse
            className="floor-shadow"
            cx="100"
            cy="175"
            rx="48"
            ry="9"
            fill={COLORS.shadow}
          />

          {/* Efeitos Externos (Faíscas ou Pensamento) */}
          {showSparkles && (
            <g fill={COLORS.accent}>
              <path
                className="sparkle-1"
                d="M40 33 L43 42 L52 45 L43 48 L40 57 L37 48 L28 45 L37 42 Z"
              />
              <path
                className="sparkle-2"
                d="M165 38 L167 45 L174 47 L167 49 L165 56 L163 49 L156 47 L163 45 Z"
              />
            </g>
          )}

          {mood === "thinking" && (
            <g fill={COLORS.accent} className="animate-pulse">
              <circle cx="152" cy="62" r="4" />
              <circle cx="164" cy="48" r="6" />
              <circle cx="176" cy="32" r="9" />
            </g>
          )}

          {/* Corpo do Cérebro */}
          <g className="brain-body">
            {/* Relevo 3D Inferior */}
            <g fill={COLORS.brainDark}>
              {BASE_CIRCLES.map((c, i) => (
                <circle key={`base-${i}`} {...c} />
              ))}
            </g>

            {/* Massa Principal */}
            <g fill={COLORS.brainMain}>
              {BODY_CIRCLES.map((c, i) => (
                <circle key={`body-${i}`} {...c} />
              ))}
            </g>

            {/* Brilhos Superiores */}
            <g stroke={COLORS.brainLight} strokeWidth="5" strokeLinecap="round">
              <path d="M62 56 C70 48, 84 48, 90 54" />
              <path d="M112 54 C120 48, 132 48, 138 56" />
            </g>

            {/* Sulcos do Cérebro */}
            <g
              stroke={COLORS.brainDark}
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
            >
              {BRAIN_FOLDS.map((d, i) => (
                <path key={`fold-${i}`} d={d} />
              ))}
            </g>

            {/* Bochechas */}
            <g fill={COLORS.cheek} opacity={cheekOpacity}>
              <ellipse cx="68" cy="110" rx="7" ry="4.5" />
              <ellipse cx="132" cy="110" rx="7" ry="4.5" />
            </g>

            {/* Expressão Facial Dinâmica */}
            {FACE_BY_MOOD[mood]}
          </g>
        </svg>
      </div>
    );
  }
);

BrainMascot.displayName = "BrainMascot";

export default BrainMascot;
