import quizzes from "@/app/quizzes.json";

// Valor salvo para cada resposta. Mantém o mesmo formato usado pelos quizzes antigos:
// sim/não => 1 | 0, escala => peso (1..5), múltipla escolha => categoryValue.
export type AnswerValue = string | number;

export interface TrailOption {
  key: string;
  value: AnswerValue;
  text: string;
}

export interface TrailQuestion {
  id: number;
  prompt: string;
  statement?: string;
  options: TrailOption[];
}

export interface Trail {
  quizId: number;
  slug: string;
  title: string;
  tagline: string;
  color: TrailColor;
  quizType: number;
  questions: TrailQuestion[];
  courseUrl?: string;
}

export type TrailColor = "coral" | "sea" | "sun" | "mint";

interface TrailMeta {
  slug: string;
  title: string;
  tagline: string;
  color: TrailColor;
}

const TRAIL_META: TrailMeta[] = [
  { slug: "inteligencia-emocional", title: "Inteligência Emocional", tagline: "Reconheça e lide com suas emoções", color: "coral" },
  { slug: "estilos-de-lideranca", title: "Estilos de Liderança", tagline: "Descubra como você conduz uma equipe", color: "sea" },
  { slug: "motivacao-no-trabalho", title: "Motivação no Trabalho", tagline: "Entenda o que te move no dia a dia", color: "sun" },
  { slug: "escala-de-criatividade", title: "Criatividade", tagline: "Meça sua veia criativa", color: "mint" },
];

// Embaralhamento determinístico: a ordem fica estável ao retomar o progresso.
function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let s = seed * 9301 + 49297;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildQuestions(quiz: Quiz): TrailQuestion[] {
  return quiz.questions.map((q) => {
    // Sim / Não
    if (quiz.type === 1) {
      return {
        id: q.id,
        prompt: "Você se identifica com esta frase?",
        statement: q.question,
        options: [
          { key: "sim", value: 1, text: "Sim, me identifico" },
          { key: "nao", value: 0, text: "Não me identifico" },
        ],
      };
    }

    // Escala de frequência (Nunca → Sempre)
    if (quiz.type === 3) {
      return {
        id: q.id,
        prompt: "Com que frequência isso acontece com você?",
        statement: q.question,
        options: (q.alternatives ?? []).map((alt) => ({ key: alt.id, value: alt.weigth ?? 0, text: alt.text })),
      };
    }

    // Múltipla escolha: a ordem é embaralhada (de forma estável) para não revelar a categoria.
    const options = (q.alternatives ?? []).map((alt) => ({ key: alt.id, value: alt.categoryValue ?? "", text: alt.text }));
    return { id: q.id, prompt: q.question, options: seededShuffle(options, quiz.id * 100 + q.id) };
  });
}

const course = (quizzes as Quiz[]).find((q) => q.slug === "curso-inteligencia-emocional");

export const TRAILS: Trail[] = TRAIL_META.map((meta) => {
  const quiz = (quizzes as Quiz[]).find((q) => q.slug === meta.slug)!;
  return {
    ...meta,
    quizId: quiz.id,
    quizType: quiz.type,
    questions: buildQuestions(quiz),
    courseUrl: meta.slug === "inteligencia-emocional" ? course?.url : undefined,
  };
});

export function getTrail(slug: string): Trail | undefined {
  return TRAILS.find((t) => t.slug === slug);
}
