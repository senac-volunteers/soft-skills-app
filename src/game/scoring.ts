import { AnswerValue, Trail } from "./trails";

export interface ResultBar {
  label: string;
  value: number; // 0..100
  hint?: string;
}

export interface TrailResult {
  emoji: string;
  title: string;
  description: string;
  heading: string;
  bars: ResultBar[];
}

// Mesmos critérios da página de resultados original.
function compatibility(percentage: number) {
  if (percentage >= 80) return "Alta compatibilidade";
  if (percentage >= 30) return "Moderada compatibilidade";
  return "Baixa compatibilidade";
}

// Em caso de empate vence a última chave — mesmo critério da página de resultados original.
function maxKey<T extends string>(scores: Record<T, number>): T {
  return (Object.keys(scores) as T[]).reduce((a, b) => (scores[a] > scores[b] ? a : b));
}

function sumByCategory(answers: AnswerValue[]) {
  return answers.reduce<Record<string, number>>((acc, a) => {
    const [category, raw] = String(a).split("-");
    acc[category] = (acc[category] ?? 0) + (parseFloat(raw) || 0);
    return acc;
  }, {});
}

function countByCategory(answers: AnswerValue[], categories: string[]) {
  return categories.reduce<Record<string, number>>((acc, c) => {
    acc[c] = answers.filter((a) => a === c).length;
    return acc;
  }, {});
}

function ieGroups(answers: AnswerValue[]) {
  const groups = [0, 0, 0, 0, 0];
  answers.forEach((a, i) => {
    groups[Math.floor(i / 4)] += Number(a) || 0;
  });
  return groups;
}

export function computeResult(trail: Trail, answers: AnswerValue[]): TrailResult {
  switch (trail.slug) {
    case "escala-de-criatividade": {
      const points = answers.filter((a) => a === 1).length;
      const pct = (points / trail.questions.length) * 100;
      const profile =
        pct >= 80
          ? { emoji: "🚀", title: "Mente Visionária", description: "Você tem uma capacidade excepcional de gerar ideias inovadoras e pensar fora da caixa." }
          : pct >= 50
            ? { emoji: "💡", title: "Pensador Criativo", description: "Você tem ótimas ideias e encontra soluções originais para os desafios do dia a dia." }
            : { emoji: "🛠️", title: "Solucionador Prático", description: "Sua abordagem é focada na execução prática e na aplicação de métodos eficientes." };
      return {
        ...profile,
        heading: "Seu nível de criatividade",
        bars: [{ label: "Pontuação criativa", value: pct, hint: `${points}/${trail.questions.length}` }],
      };
    }

    case "estilos-de-lideranca": {
      const counts = countByCategory(answers, ["autocrat", "liberal", "democrat"]);
      const total = trail.questions.length;
      const top = maxKey(counts as Record<"autocrat" | "liberal" | "democrat", number>);
      const profiles = {
        democrat: { emoji: "🌟", title: "Integrador Estratégico", description: "Você engaja o time, valoriza ideias e constrói resultados com colaboração." },
        liberal: { emoji: "🦅", title: "Mentor de Autonomia", description: "Você confia na equipe e oferece liberdade para que talentos independentes brilhem." },
        autocrat: { emoji: "⚙️", title: "Executor Focado", description: "Você é focado em resultados, garantindo disciplina, ritmo e direção clara." },
      };
      return {
        ...profiles[top],
        heading: "Seu estilo dominante",
        bars: [
          { label: "Democrático", value: (counts.democrat / total) * 100 },
          { label: "Liberal", value: (counts.liberal / total) * 100 },
          { label: "Autocrático", value: (counts.autocrat / total) * 100 },
        ],
      };
    }

    case "motivacao-no-trabalho": {
      const sums = sumByCategory(answers);
      const factors = { RS: sums.RS ?? 0, RP: sums.RP ?? 0, HB: sums.HB ?? 0, E: sums.E ?? 0, P: sums.P ?? 0 };
      const top = maxKey(factors);
      const profiles = {
        RP: { emoji: "🚀", title: "Especialista Independente", description: "Você é movido pelo desenvolvimento intelectual e pela autonomia." },
        HB: { emoji: "🧘", title: "Mestre da Harmonia", description: "O equilíbrio entre vida pessoal e bem-estar é sua maior força." },
        RS: { emoji: "🤝", title: "Agente de Impacto", description: "Colaborar e ajudar o próximo são essenciais para o seu sucesso." },
        E: { emoji: "🛡️", title: "Guardião da Estabilidade", description: "Você constrói bases sólidas e valoriza a segurança no futuro." },
        P: { emoji: "⭐", title: "Protagonista", description: "Ser referência e ter seu trabalho reconhecido são grandes combustíveis." },
      };
      const labels = {
        RP: "Realização profissional",
        HB: "Harmonia e bem-estar",
        RS: "Relações sociais",
        E: "Estabilidade",
        P: "Protagonismo",
      };
      return {
        ...profiles[top],
        heading: "O que mais te motiva",
        bars: (Object.keys(factors) as (keyof typeof factors)[])
          .sort((a, b) => factors[b] - factors[a])
          .map((k) => ({ label: labels[k], value: Math.min(100, factors[k]), hint: compatibility(factors[k]) })),
      };
    }

    default: {
      const g = ieGroups(answers);
      const keys = ["autoconhecimento", "autocontrole", "automotivacao", "empatia", "sociais"] as const;
      const scores = Object.fromEntries(keys.map((k, i) => [k, g[i]])) as Record<(typeof keys)[number], number>;
      const top = maxKey(scores);
      const profiles = {
        autoconhecimento: { emoji: "🦉", title: "Sábio Interior", description: "Você tem clareza sobre suas próprias emoções e limites." },
        autocontrole: { emoji: "🛡️", title: "Fortaleza Emocional", description: "Você gerencia a pressão e os impulsos com maestria." },
        automotivacao: { emoji: "🔥", title: "Motor de Iniciativa", description: "Seu otimismo e foco se mantêm diante dos obstáculos." },
        empatia: { emoji: "❤️", title: "Coração Empático", description: "Você compreende e acolhe as emoções dos outros com sensibilidade." },
        sociais: { emoji: "🤝", title: "Arquiteto de Conexões", description: "Construir relações positivas e colaborar é a sua maior virtude." },
      };
      const labels = ["Autoconhecimento", "Autocontrole", "Automotivação", "Empatia", "Habilidades sociais"];
      return {
        ...profiles[top],
        heading: "Sua maior força emocional",
        bars: g.map((v, i) => ({ label: labels[i], value: (v / 20) * 100, hint: `${v}/20` })),
      };
    }
  }
}

// Grava o resultado no mesmo formato usado pelas páginas antigas de resultado,
// permitindo abrir o "relatório completo" (com envio por e-mail) em /autoavaliacao/[slug]/resultados.
export function persistLegacyResult(trail: Trail, answers: AnswerValue[]) {
  const upsert = (key: string, entry: Record<string, unknown>, field: string) => {
    const stored = JSON.parse(localStorage.getItem(key) ?? "[]");
    const i = stored.findIndex((r: { qID: number }) => r.qID === trail.quizId);
    if (i >= 0) stored[i][field] = entry[field];
    else stored.push(entry);
    localStorage.setItem(key, JSON.stringify(stored));
  };

  if (trail.quizType === 1) {
    const points = answers.filter((a) => a === 1).length;
    upsert("lastPoints", { qID: trail.quizId, lastPoints: points }, "lastPoints");
    localStorage.setItem("finalFeedback", JSON.stringify(answers));
    return;
  }

  let lastResult: Record<string, number>;
  if (trail.quizType === 3) {
    const g = ieGroups(answers);
    lastResult = { group1: g[0], group2: g[1], group3: g[2], group4: g[3], group5: g[4] };
  } else if (String(answers[0]).includes("-")) {
    lastResult = sumByCategory(answers);
  } else {
    lastResult = countByCategory(answers, ["autocrat", "liberal", "democrat"]);
  }
  upsert("lastResults", { qID: trail.quizId, lastResult }, "lastResult");
}
