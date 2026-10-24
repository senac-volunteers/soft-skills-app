"use client";
import { useId } from "react";
import { cn } from "@/lib/utils";

// Avatar vetorial do personagem (busto 160x160), conforme a identidade visual: a cabeça balança, o tronco respira,
// os olhos piscam e desviam o olhar, e a boca se move durante a fala. Animações em globals.css (.av).
const SKIN = "#E49C65", FEATURE = "#BD6C34", HAIR = "#56392D", TOP = "#FF7A59", HOOP = "#FFC83D";
const HAIR_BACK = "M41.0 140.0 C37.4 138.0 39.3 133.7 38.5 131.0 C37.7 128.3 37.2 125.8 36.0 124.0 C34.8 122.2 32.8 121.4 31.0 120.0 C29.2 118.6 26.7 117.3 25.0 115.5 C23.3 113.7 22.1 111.4 21.0 109.0 C19.9 106.6 18.9 103.8 18.5 101.0 C18.1 98.2 18.1 94.8 18.5 92.0 C18.9 89.2 20.1 86.8 21.0 84.5 C21.9 82.2 23.8 80.1 24.0 78.0 C24.2 75.9 23.0 74.3 22.5 72.0 C22.0 69.7 21.2 66.8 21.0 64.0 C20.8 61.2 20.8 57.7 21.5 55.0 C22.2 52.3 23.4 50.0 25.0 48.0 C26.6 46.0 28.8 44.3 31.0 43.0 C33.2 41.7 35.9 41.3 38.0 40.0 C40.1 38.7 42.0 37.0 43.5 35.0 C45.0 33.0 45.4 30.2 47.0 28.0 C48.6 25.8 50.7 23.7 53.0 22.0 C55.3 20.3 57.8 18.9 61.0 18.0 C64.2 17.1 68.3 16.6 72.0 16.5 C75.7 16.4 79.7 16.8 83.0 17.5 C86.3 18.2 89.3 19.5 92.0 21.0 C94.7 22.5 97.0 24.8 99.0 26.5 C101.0 28.2 102.2 30.8 104.0 31.5 C105.8 32.2 107.7 30.8 110.0 30.5 C112.3 30.2 115.3 29.7 118.0 30.0 C120.7 30.3 123.7 31.2 126.0 32.5 C128.3 33.8 130.3 35.8 132.0 38.0 C133.7 40.2 135.2 43.0 136.0 46.0 C136.8 49.0 136.7 52.7 137.0 56.0 C137.3 59.3 137.3 63.0 138.0 66.0 C138.7 69.0 140.1 71.2 141.0 74.0 C141.9 76.8 143.1 80.0 143.5 83.0 C143.9 86.0 143.9 89.2 143.5 92.0 C143.1 94.8 142.2 97.5 141.0 100.0 C139.8 102.5 137.7 105.0 136.0 107.0 C134.3 109.0 132.0 109.8 131.0 112.0 C130.0 114.2 130.5 117.3 130.0 120.0 C129.5 122.7 129.2 125.7 128.0 128.0 C126.8 130.3 125.2 132.2 123.0 134.0 C120.8 135.8 118.8 137.2 115.0 138.5 C111.2 139.8 105.8 141.1 100.0 142.0 C94.2 142.9 86.7 143.8 80.0 144.0 C73.3 144.2 66.5 143.7 60.0 143.0 C53.5 142.3 44.6 142.0 41.0 140.0Z";
const FRINGE = "M39.0 58.0 C39.0 54.8 39.3 49.2 42.0 45.0 C44.7 40.8 49.0 35.8 55.0 33.0 C61.0 30.2 70.2 28.5 78.0 28.0 C85.8 27.5 95.3 28.5 102.0 30.0 C108.7 31.5 114.0 33.8 118.0 37.0 C122.0 40.2 124.8 45.3 126.0 49.0 C127.2 52.7 126.2 56.2 125.5 59.0 C124.8 61.8 123.4 64.2 122.0 65.5 C120.6 66.8 118.8 67.0 117.0 67.0 C115.2 67.0 113.2 66.4 111.5 65.5 C109.8 64.6 108.0 62.8 106.5 61.5 C105.0 60.2 103.8 58.5 102.5 57.5 C101.2 56.5 99.8 55.5 98.5 55.5 C97.2 55.5 96.1 56.6 95.0 57.5 C93.9 58.4 92.9 59.9 91.8 60.6 C90.7 61.3 89.4 61.7 88.3 61.6 C87.2 61.5 86.0 61.0 85.0 60.3 C84.0 59.6 83.2 58.1 82.0 57.3 C80.8 56.4 79.3 55.4 78.0 55.2 C76.7 55.0 75.2 55.6 74.0 56.2 C72.8 56.8 71.7 57.9 70.5 58.8 C69.3 59.7 68.0 60.7 66.8 61.8 C65.6 62.9 64.4 64.2 63.2 65.3 C62.0 66.4 61.1 67.7 59.8 68.4 C58.5 69.2 57.0 69.6 55.5 69.8 C54.0 70.0 52.3 69.8 50.8 69.4 C49.3 69.0 47.9 68.3 46.4 67.4 C44.9 66.5 43.2 65.6 42.0 64.0 C40.8 62.4 39.0 61.2 39.0 58.0Z";

function Eyeball({ cx, cy, rx, ry, lidY, pupil, pr }: { cx: number; cy: number; rx: number; ry: number; lidY: number; pupil: [number, number]; pr: number }) {
  const id = useId();
  return (
    <>
      <clipPath id={id}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
      </clipPath>
      <g className="eyeball" style={{ transformOrigin: `${cx}px ${lidY}px` }}>
        <g clipPath={`url(#${id})`}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" />
          <g className="pup">
            <circle cx={pupil[0]} cy={pupil[1]} r={pr} fill="#3F3F3F" />
          </g>
        </g>
      </g>
    </>
  );
}

export function DudaAvatar({ talking, className }: { talking?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 160 160"
      className={cn("av idle-nod", talking && "talking", className)}
      style={{ "--bt": "4.4s", "--bd": ".8s", "--gx": "-2px" } as React.CSSProperties}
      aria-hidden="true"
    >
      {/* Cabelo de trás: atrás do tronco, mas com a mesma animação da cabeça para balançar junto com ela. */}
      <g className="head">
        <path d={HAIR_BACK} fill={HAIR} />
      </g>
      <g className="torso">
        <path d="M63 118 V104 Q63 100 67 100 H95 Q99 100 99 104 V118 Q99.5 120 103 120.5 Q111 121.5 115 127 L133 161 H29 L47 127 Q51 121.5 59 120.5 Q62.5 120 63 118Z" fill={TOP} />
      </g>
      <g className="head">
        <circle cx="45.8" cy="73.5" r="8.6" fill={SKIN} />
        <circle cx="115.2" cy="73.5" r="8.6" fill={SKIN} />
        <g fill="none" stroke={HOOP} strokeWidth="3">
          <circle cx="43.3" cy="88.5" r="10.2" />
          <circle cx="117.7" cy="88.5" r="10.2" />
        </g>
        <path d="M45.8 42 H115.2 V96 Q115.2 109 102.2 109 H58.8 Q45.8 109 45.8 96Z" fill={SKIN} />
        <Eyeball cx={70.5} cy={73.5} rx={9.9} ry={7.8} lidY={73} pupil={[73.2, 74.4]} pr={3.7} />
        <Eyeball cx={92.7} cy={73.5} rx={9.9} ry={7.8} lidY={73} pupil={[89.6, 74.4]} pr={3.7} />
        <g className="brows">
          <path d="M60.6 73 V70.5 C60.6 66.5 62.5 64 66 63.2 C69.5 62.2 75 62 78 63.4 C80 64.4 80.5 66.5 80.5 69 V73Z" fill={FEATURE} />
          <path d="M82.8 73 V69.5 C82.8 65.5 85 62.6 89 61.7 C93 60.9 98.5 60.9 101 62.3 C102.3 63.2 102.6 65 102.6 67 V73Z" fill={FEATURE} />
        </g>
        <path d="M80.5 77.8 C81.6 80.3 84.6 82 84.4 84.6 C84.2 86.8 82.4 87.6 80.5 87.6 C78.6 87.6 76.6 86.8 76.6 84.6 C76.4 82 79.4 80.3 80.5 77.8Z" fill={FEATURE} />
        <g className="mouth">
          <path d="M71.8 88.4 C73.2 92.8 79 95 86.2 92.2" stroke={FEATURE} strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <path d={FRINGE} fill={HAIR} />
      </g>
    </svg>
  );
}
