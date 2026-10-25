"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import BrainMascot from "@/components/game/animation/brain-mascot";
import ConsistencyMascot from "@/components/game/animation/consistency-mascot";
import TotalEnergyMascot from "@/components/game/animation/energy-mascot";
import ExplorerMascot from "@/components/game/animation/explorer-mascot";
import FirstStepMascot from "@/components/game/animation/first-step-mascot";
import LeaderMascot from "@/components/game/animation/leader-mascot";
import LightbulbMascot from "@/components/game/animation/lightbulb-mascot";
import MountainClimberMascot from "@/components/game/animation/motivation-mascot";
import { AnswerValue, TRAILS, getTrail } from "./trails";
import { persistLegacyResult } from "./scoring";

export interface TrailProgress {
  answers: (AnswerValue | null)[];
  current: number;
  completed: boolean;
  completions: number;
}

export interface GameState {
  xp: number;
  streak: { count: number; lastDay: string | null };
  badges: string[];
  voice: boolean;
  trails: Record<string, TrailProgress>;
  /** Dias (y-m-d) em que houve pelo menos uma resposta; guarda os últimos 30. */
  activeDays: string[];
  /** Respostas dadas hoje, para a meta diária. */
  daily: { day: string | null; count: number };
}

export interface Badge {
  id: string;
  emoji: ReactNode;
  title: string;
  description: string;
}

export const XP_PER_ANSWER = 10;
export const XP_TRAIL_BONUS = 50;

const MASCOT_CLASS = "size-full [&_svg]:size-full";

export const BADGES: Badge[] = [
  {
    id: "primeiro-passo",
    emoji: <FirstStepMascot className={MASCOT_CLASS} />,
    title: "Primeiro passo",
    description: "Responda sua primeira pergunta.",
  },
  ...TRAILS.map((t) => ({
    id: `trilha-${t.slug}`,
    emoji: {
      "inteligencia-emocional": <BrainMascot className={MASCOT_CLASS} />,
      "estilos-de-lideranca": <LeaderMascot className={MASCOT_CLASS} />,
      "motivacao-no-trabalho": (
        <MountainClimberMascot className={MASCOT_CLASS} />
      ),
      "escala-de-criatividade": <LightbulbMascot className={MASCOT_CLASS} />,
    }[t.slug] ?? <LightbulbMascot className={MASCOT_CLASS} />,
    title: t.title,
    description: `Conclua a trilha de ${t.title}.`,
  })),
  {
    id: "explorador",
    emoji: <ExplorerMascot className={MASCOT_CLASS} />,
    title: "Explorador completo",
    description: "Conclua todas as trilhas.",
  },
  {
    id: "sequencia-3",
    emoji: <ConsistencyMascot className={MASCOT_CLASS} />,
    title: "Constância",
    description: "Pratique 3 dias seguidos.",
  },
  {
    id: "xp-300",
    emoji: <TotalEnergyMascot className={MASCOT_CLASS} />,
    title: "Energia total",
    description: "Acumule 300 XP.",
  },
];

const STORAGE_KEY = "ssa:game:v1";

const INITIAL: GameState = {
  xp: 0,
  streak: { count: 0, lastDay: null },
  badges: [],
  voice: false,
  trails: {},
  activeDays: [],
  daily: { day: null, count: 0 },
};

export const DAILY_GOAL = 5;

export function dayKey(d: Date) {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function today() {
  const d = new Date();
  return dayKey(d);
}

function yesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function emptyProgress(total: number): TrailProgress {
  return {
    answers: Array(total).fill(null),
    current: 0,
    completed: false,
    completions: 0,
  };
}

function withBadges(state: GameState): GameState {
  const earned = new Set(state.badges);
  const progress = Object.values(state.trails);
  if (
    progress.some((p) => p.answers.some((a) => a !== null) || p.completions > 0)
  )
    earned.add("primeiro-passo");
  TRAILS.forEach((t) => {
    if ((state.trails[t.slug]?.completions ?? 0) > 0)
      earned.add(`trilha-${t.slug}`);
  });
  if (TRAILS.every((t) => (state.trails[t.slug]?.completions ?? 0) > 0))
    earned.add("explorador");
  if (state.streak.count >= 3) earned.add("sequencia-3");
  if (state.xp >= 300) earned.add("xp-300");
  return earned.size === state.badges.length
    ? state
    : { ...state, badges: Array.from(earned) };
}

function bumpStreak(streak: GameState["streak"]): GameState["streak"] {
  const t = today();
  if (streak.lastDay === t) return streak;
  return {
    count: streak.lastDay === yesterday() ? streak.count + 1 : 1,
    lastDay: t,
  };
}

interface GameContextValue {
  state: GameState;
  ready: boolean;
  level: number;
  progressOf: (slug: string) => TrailProgress;
  answer: (
    slug: string,
    index: number,
    value: AnswerValue
  ) => { xpGained: number; finished: boolean; newBadges: string[] };
  restart: (slug: string) => void;
  toggleVoice: () => void;
  resetAll: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(INITIAL);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...INITIAL, ...JSON.parse(raw) });
    } catch {
      /* armazenamento indisponível: segue com estado inicial */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignora */
    }
  }, [state, ready]);

  const progressOf = useCallback(
    (slug: string) => {
      const total = getTrail(slug)?.questions.length ?? 0;
      const p = state.trails[slug];
      return p && p.answers.length === total ? p : emptyProgress(total);
    },
    [state.trails]
  );

  const answer = useCallback<GameContextValue["answer"]>(
    (slug, index, value) => {
      const trail = getTrail(slug)!;
      const prev = progressOf(slug);
      const firstTime = prev.answers[index] === null && prev.completions === 0;
      const answers = [...prev.answers];
      answers[index] = value;
      const finished = answers.every((a) => a !== null);
      let xpGained = firstTime ? XP_PER_ANSWER : 0;
      if (finished && prev.completions === 0) xpGained += XP_TRAIL_BONUS;

      if (finished) persistLegacyResult(trail, answers as AnswerValue[]);

      const next: GameState = withBadges({
        ...state,
        xp: state.xp + xpGained,
        streak: bumpStreak(state.streak),
        activeDays: state.activeDays.includes(today())
          ? state.activeDays
          : [...state.activeDays, today()].slice(-30),
        daily: {
          day: today(),
          count: (state.daily.day === today() ? state.daily.count : 0) + 1,
        },
        trails: {
          ...state.trails,
          [slug]: {
            answers,
            current: finished ? index : index + 1,
            completed: finished,
            completions: prev.completions + (finished ? 1 : 0),
          },
        },
      });
      const newBadges = next.badges.filter((b) => !state.badges.includes(b));
      setState(next);
      return { xpGained, finished, newBadges };
    },
    [state, progressOf]
  );

  const restart = useCallback((slug: string) => {
    setState((s) => {
      const total = getTrail(slug)?.questions.length ?? 0;
      const prev = s.trails[slug];
      return {
        ...s,
        trails: {
          ...s.trails,
          [slug]: {
            ...emptyProgress(total),
            completions: prev?.completions ?? 0,
          },
        },
      };
    });
  }, []);

  const toggleVoice = useCallback(
    () => setState((s) => ({ ...s, voice: !s.voice })),
    []
  );
  const resetAll = useCallback(() => {
    // Também apaga os resultados guardados no formato antigo, usados pelo relatório completo.
    try {
      ["lastResults", "lastPoints", "finalFeedback"].forEach((k) =>
        localStorage.removeItem(k)
      );
    } catch {
      /* armazenamento indisponível */
    }
    setState((s) => ({ ...INITIAL, voice: s.voice }));
  }, []);

  const value = useMemo(
    () => ({
      state,
      ready,
      level: Math.floor(state.xp / 100) + 1,
      progressOf,
      answer,
      restart,
      toggleVoice,
      resetAll,
    }),
    [state, ready, progressOf, answer, restart, toggleVoice, resetAll]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame precisa estar dentro de <GameProvider>");
  return ctx;
}

export function answeredCount(p: TrailProgress) {
  return p.completed
    ? p.answers.length
    : p.answers.filter((a) => a !== null).length;
}
