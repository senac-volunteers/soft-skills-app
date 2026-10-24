"use client";
//imports next e react
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

import { ArrowLeft, Check, ThumbsUp, TriangleAlert, Undo2 } from "lucide-react";

//imports para email
import { sendResults } from "@/actions/results.action";
import { sendResultsSchema, SendResultsValues } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

//componentes
import { Input } from "@/components/ui/input";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { Form, FormField, FormItem, FormMessage, FormControl } from "@/components/ui/form";
import { useIsMobile } from "@/hooks/use-mobile";
import { ResultsEmail } from "@/components/results-email";
import { Shell } from "@/components/game/shell";
import { TrailEmblem } from "@/components/game/icons";
import { TRAIL_STYLE } from "@/components/game/trail-card";
import { getTrail } from "@/game/trails";
import { cn } from "@/lib/utils";
import { LastResultEntry, LastResults } from "@/types/lastResults";

interface MotivationFactors {
  rs?: number;
  rp?: number;
  hb?: number;
  e?: number;
  p?: number;
}

export default function Client({
  quiz,
}: Readonly<{ quiz: Quiz }>) {
  const [points, setPoints] = useState<number>(0);
  const [success, setSuccess] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [feedbacks, setFeedbacks] = useState<{ [key: string]: string | number }[]>([]);
  const [higherPercentage, setHigherPercentage] = useState<string>('');
  const [autocratPercentage, setAutocratPercentage] = useState<number>(0);
  const [liberalPercentage, setLiberalPercentage] = useState<number>(0);
  const [democratPercentage, setDemocratPercentage] = useState<number>(0);
  const [firstGroupPoints, setFirstGroupPoints] = useState<number>(0);
  const [secondGroupPoints, setSecondGroupPoints] = useState<number>(0);
  const [thirdGroupPoints, setThirdGroupPoints] = useState<number>(0);
  const [fourthGroupPoints, setFourthGroupPoints] = useState<number>(0);
  const [fifthGroupPoints, setFifthGroupPoints] = useState<number>(0);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [motivationFactors, setMotivationFactors] = useState<MotivationFactors>();

  const isMobile = useIsMobile();

  const form = useForm({
    resolver: zodResolver(sendResultsSchema),
    defaultValues: { email: "", message: "" },
  });

  async function onSubmit(data: SendResultsValues) {
    // Quantidade de questões, que é o total de pontos
    const totalPoints = quiz.questions.length;
    setLoading(true);

    try {
      const resp = await sendResults(
        data.email,
        quiz.title,
        points,
        totalPoints,
        feedbacks
      );
      setLoading(false);
      setSuccess(resp.success);
      setMessage(resp.message);
    } catch (error: any) {
      setLoading(false);
      setSuccess(false);
      setMessage('Algo deu errado. Tente novamente mais tarde.');
    }
  }

  function recoverFeedback() {
    let feedback = [];
    if (localStorage.finalFeedback) {
      feedback = JSON.parse(localStorage.finalFeedback)

      // Baseado no valor de cada feedback ele retorna alguma informação
      // A princípio armazenado em options no json
      feedback.forEach((resp: number, id: any) => {

        // Conteúdo de feedbacks marcados com "Sim"
        if (resp === 1) {
          const questionId = quiz.questions[id].id;
          const questionTitle = quiz.questions[id].question;
          const questionFeedback = quiz.questions[id].feedback;

          // Define o conteúdo de feedbacks enviados por e-mail
          setFeedbacks(prevFeedbacks => [
            ...prevFeedbacks,
            {
              ['questionId']: questionId,
              ['questionTitle']: questionTitle,
              ['questionFeedback']: questionFeedback
            },
          ]);
        };
      });
    };
  };

  function getLastResults() {
    const lastResults = localStorage.getItem("lastResults");
    if (!lastResults) redirect("/autoavaliacao/" + quiz?.slug + "/iniciar");

    // Transforma o plaintext armazenado no localStorage em JSON
    const parsedResults: LastResults = JSON.parse(lastResults);

    if (parsedResults) {
      // Busca o quiz pelo ID armazenado no localStorage
      const quizResults = parsedResults.find(
        (result) => result.qID === quiz?.id
      );

      if (quizResults) {
        getGroupPoints(quizResults);
        getLeadershipResults(quizResults);
        getMotivationWorkResults(quizResults);
      } else {
        console.error("ERROR: quizResults não encontrado!");
      }
    } else {
      redirect("/autoavaliacao/" + quiz?.slug + "/iniciar");
    }
  }

  function getGroupPoints(quizResults: LastResultEntry) {
    // Verifica se o tipo do quiz é 3 (multiple group)
    if (quiz.type !== 3) return;

    const groupPoints1 = quizResults.lastResult?.group1 || 0;
    const groupPoints2 = quizResults.lastResult?.group2 || 0;
    const groupPoints3 = quizResults.lastResult?.group3 || 0;
    const groupPoints4 = quizResults.lastResult?.group4 || 0;
    const groupPoints5 = quizResults.lastResult?.group5 || 0;

    setFirstGroupPoints(groupPoints1);
    setSecondGroupPoints(groupPoints2);
    setThirdGroupPoints(groupPoints3);
    setFourthGroupPoints(groupPoints4);
    setFifthGroupPoints(groupPoints5);

  }

  function getLeadershipResults(quizResults: LastResultEntry) {
    // Verifica se o tipo do quiz é 2 (multiple choice)
    if (quiz.type !== 2) return;

    const autocrat = quizResults.lastResult?.autocrat || 0;
    const liberal = quizResults.lastResult?.liberal || 0;
    const democrat = quizResults.lastResult?.democrat || 0;

    // Define o estilo mais respondido
    const higher = Math.max(autocrat, liberal, democrat);
    if (higher === autocrat) setHigherPercentage('autocrat');
    if (higher === liberal) setHigherPercentage('liberal');
    if (higher === democrat) setHigherPercentage('democrat');

    // Setar os percentuais de cada estilo
    setAutocratPercentage(autocrat / quiz.questions.length * 100);
    setLiberalPercentage(liberal / quiz.questions.length * 100);
    setDemocratPercentage(democrat / quiz.questions.length * 100);
  };

  function getMotivationWorkResults(quizResults: LastResultEntry) {
    if (quiz.type !== 2) return;

    // Valor dos fatores de motivação
    const motivationWorkFactors = {
      rs: quizResults.lastResult?.RS !== undefined ? quizResults.lastResult?.RS : 0,
      rp: quizResults.lastResult?.RP !== undefined ? quizResults.lastResult?.RP : 0,
      hb: quizResults.lastResult?.HB !== undefined ? quizResults.lastResult?.HB : 0,
      e: quizResults.lastResult?.E !== undefined ? quizResults.lastResult?.E : 0,
      p: quizResults.lastResult?.P !== undefined ? quizResults.lastResult?.P : 0,
    }

    setMotivationFactors(motivationWorkFactors);
  }

  function getPoints() {
    // Verifica se o tipo do quiz é 1 (sim ou não)
    // para dar continuidade à função
    if (quiz.type !== 1) return;

    const lastPoints = localStorage.getItem("lastPoints");
    if (!lastPoints) redirect("/autoavaliacao/" + quiz?.slug + "/iniciar");

    // Transforma o plaintext armazenado no localStorage em JSON
    const parsedPoints = JSON.parse(lastPoints);

    if (parsedPoints) {
      // Busca o quiz pelo ID armazenado no localStorage
      const quizResultPoints = parsedPoints.find(
        (result: LastPoints) => result.qID === quiz?.id,
      );

      if (quizResultPoints) setPoints(quizResultPoints.lastPoints);
    };

    if (quiz.type === 1) recoverFeedback();
  };

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    setMessage('') // Limpar mensagem ao alterar email
  }, [form.watch("email")]);

  useEffect(() => {
    getPoints();
    getLastResults();
  }, [quiz?.id, quiz?.slug]);
  const getEQProfile = () => {
    const scores = {
      autoconhecimento: firstGroupPoints,
      autocontrole: secondGroupPoints,
      automotivacao: thirdGroupPoints,
      empatia: fourthGroupPoints,
      sociais: fifthGroupPoints
    };

    const highest = Object.keys(scores).reduce((a, b) => 
      scores[a as keyof typeof scores] > scores[b as keyof typeof scores] ? a : b
    );

    const profiles: Record<string, { title: string; color: string; desc: string }> = {
      autoconhecimento: { title: "🦉 Sábio Interior", color: "text-blue-500", desc: "Você tem uma clareza incrível sobre suas próprias emoções e limites." },
      autocontrole: { title: "🛡️ Fortaleza Emocional", color: "text-blue-600", desc: "Você gerencia a pressão e os impulsos com maestria nas situações difíceis." },
      automotivacao: { title: "🔥 Motor de Iniciativa", color: "text-orange-600", desc: "Seu otimismo e foco são inabaláveis diante de qualquer obstáculo." },
      empatia: { title: "❤️ Coração Empático", color: "text-rose-600", desc: "Você compreende e acolhe as emoções alheias com extrema sensibilidade." },
      sociais: { title: "🤝 Arquiteto de Conexões", color: "text-emerald-600", desc: "Construir relacionamentos positivos e colaborar é a sua maior virtude." }
    };

    return profiles[highest];
  };
// Quiz 1: Criatividade
  const getCreativityProfile = () => {
    const percentage = (points / quiz.questions.length) * 100;
    if (percentage >= 80) return { title: "🚀 Mente Visionária", color: "text-blue-500", desc: "Você tem uma capacidade excepcional de gerar ideias inovadoras e pensar fora da caixa." };
    if (percentage >= 50) return { title: "💡 Pensador Criativo", color: "text-blue-600", desc: "Você tem ótimas ideias e consegue encontrar soluções originais para os desafios do dia a dia." };
    return { title: "🛠️ Solucionador Prático", color: "text-emerald-600", desc: "Sua abordagem é mais focada na execução prática e na aplicação de métodos eficientes." };
  };

  // Quiz 2: Liderança
  const getLeadershipProfile = () => {
    if (higherPercentage === 'democrat') return { title: "🌟 Integrador Estratégico", color: "text-blue-600", desc: "Você engaja o time, valoriza ideias e constrói resultados através da colaboração." };
    if (higherPercentage === 'liberal') return { title: "🦅 Mentor de Autonomia", color: "text-emerald-600", desc: "Você confia na equipe, oferecendo liberdade para que talentos independentes brilhem." };
    if (higherPercentage === 'autocrat') return { title: "⚙️ Executor Focado", color: "text-orange-600", desc: "Você é focado em resultados, garantindo disciplina, ritmo e direcionamento claro." };
    return { title: "Líder em Formação", color: "text-neutral-600", desc: "Avaliando seu perfil dominante..." };
  };

  // Quiz 4: Motivação
  const getMotivationProfile = () => {
    if (!motivationFactors) return null;
    const highestFactor = Object.keys(motivationFactors).reduce((a, b) => 
      (motivationFactors[a as keyof MotivationFactors] || 0) > (motivationFactors[b as keyof MotivationFactors] || 0) ? a : b
    );
    const profiles: Record<string, { title: string; color: string; desc: string }> = {
      rp: { title: "🚀 Especialista Independente", color: "text-blue-500", desc: "Você é movido pelo desenvolvimento intelectual e autonomia." },
      hb: { title: "🧘 Mestre da Harmonia", color: "text-emerald-600", desc: "O equilíbrio entre vida pessoal e bem-estar é sua maior força." },
      rs: { title: "🤝 Agente de Impacto", color: "text-blue-600", desc: "Colaborar e ajudar o próximo são essenciais para o seu sucesso." },
      e:  { title: "🛡️ Guardião da Estabilidade", color: "text-amber-600", desc: "Você constrói bases sólidas e valoriza a segurança no futuro." },
      p:  { title: "⭐  EMBAIXADOR DO SUCESSO", color: "text-rose-600", desc: "Status, admiração e reconhecimento são seus grandes combustíveis." }
    };
    return profiles[highestFactor];
    
  };//
  const getCompatibilityText = (percentage: number) => {
  if (percentage >= 80) {
    // Cobre 100% e 83%
    return "Alta compatibilidade";
  }
  if (percentage >= 30) {
    // Cobre 66% e 34% (ou 33%)
    return "Moderada compatibilidade";
  }
  // Cobre 17%, 16% e 0%
  return "Baixa compatibilidade";
};
  
  const trail = getTrail(quiz.slug);
  const style = TRAIL_STYLE[trail?.color ?? "sea"];
  const total = quiz.questions.length;

  const profile =
    quiz.id === 1 ? { heading: "Seu nível de criatividade", ...getCreativityProfile() }
    : quiz.id === 2 && higherPercentage ? { heading: "Seu estilo dominante", ...getLeadershipProfile() }
    : quiz.id === 3 ? { heading: "Sua maior força emocional", ...getEQProfile() }
    : quiz.id === 4 && motivationFactors ? { heading: "Seu motor profissional", ...getMotivationProfile()! }
    : null;
  // Os títulos começam com o emoji: separa para mostrar o emoji no selo.
  const [profileEmoji, ...profileWords] = (profile?.title ?? "").trim().split(/\s+/);

  const leadership = { autocrat: "Autocrático", liberal: "Liberal", democrat: "Democrático" } as const;

  return (
    <Shell>
      <Link href={trail ? `/trilha/${trail.slug}/resultado` : "/"} className="mb-3 inline-flex items-center gap-1 text-sm font-extrabold text-pop hover:underline">
        <ArrowLeft className="size-4" /> Seu perfil
      </Link>

      <header className="mb-6 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[.12em] text-pop">Relatório completo</p>
          <h1 className="font-display text-3xl font-bold leading-tight" aria-label={`${quiz.title} - Resultados obtidos`}>
            {quiz.title}
          </h1>
          <p className="font-semibold text-soft">Autoavaliação</p>
        </div>
        {trail && <TrailEmblem slug={trail.slug} className="size-16 shrink-0" />}
      </header>

      {profile && (
        <section className={cn("relative overflow-hidden rounded-[28px] px-5 py-6 text-center text-night", style.card, style.shadow)}>
          <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/40" aria-hidden="true" />
          <p className={cn("relative text-xs font-black uppercase tracking-widest", style.strong)}>{profile.heading}</p>
          <div className="relative mx-auto my-4 grid size-24 place-items-center rounded-full border-[6px] border-sun bg-purple-50 text-5xl shadow-[0_6px_0_var(--color-orange-700)]" aria-hidden="true">
            {profileEmoji}
          </div>
          <h2 className="relative font-display text-3xl font-bold leading-tight">{profileWords.join(" ")}</h2>
          <p className="relative mt-2 font-semibold opacity-90">{profile.desc}</p>
        </section>
      )}

      {quiz.id === 1 && (
        <section className="mt-8" aria-label={`Sua pontuação: ${points} de ${total}`}>
          <h2 className="mb-4 font-display text-xl font-semibold">Sua pontuação</h2>
          <div className="flex items-center gap-5 rounded-2xl border-2 border-rule p-5">
            <div className="relative grid size-24 shrink-0 place-items-center rounded-full" style={{ background: `conic-gradient(var(--color-orange-500) ${(points / total) * 360}deg, var(--panel2) 0)` }}>
              <span className="grid size-[76px] place-items-center rounded-full bg-canvas font-display text-2xl font-bold tabular-nums">
                {points}
                <span className="text-sm text-soft">/{total}</span>
              </span>
            </div>
            <p className="font-semibold text-soft">Situações em que você se identificou com uma atitude criativa. Quanto mais perto de {total}, mais forte é sua veia criativa.</p>
          </div>
        </section>
      )}

      {quiz.id === 2 && (
        <>
          <section className="mt-8 space-y-4" aria-label={`Sua pontuação: Autocrática ${autocratPercentage.toFixed(0)}% Liberal ${liberalPercentage.toFixed(0)}% Democrática ${democratPercentage.toFixed(0)}%`}>
            <h2 className="font-display text-xl font-semibold">Sua pontuação</h2>
            {(
              [
                ["autocrat", "Autocrática", autocratPercentage],
                ["liberal", "Liberal", liberalPercentage],
                ["democrat", "Democrática", democratPercentage],
              ] as const
            ).map(([key, label, value]) => (
              <ScoreBar key={key} label={label} value={value} hint={`${value.toFixed(0)}%`} highlight={higherPercentage === key} />
            ))}
          </section>

          {higherPercentage && (
            <section className="mt-8 space-y-3">
              <h2 className="font-display text-xl font-semibold">
                Seu perfil de liderança: <span className="text-pop">{leadership[higherPercentage as keyof typeof leadership]}</span>
              </h2>
              <p className="font-semibold leading-relaxed text-soft">
                {higherPercentage === "autocrat" &&
                  "Caracteriza-se por um controle centralizado e unilateral, onde o líder toma todas as decisões importantes e define as direções sem consulta ou colaboração com a equipe. Embora esse estilo possa ser eficaz em situações em que a rapidez na tomada de decisões é crucial ou onde a disciplina é necessária, ele também apresenta desvantagens significativas."}
                {higherPercentage === "liberal" &&
                  "O líder liberal permite que a equipe trabalhe de forma autônoma, sem intervenção direta, confiando que os membros experientes e competentes possam tomar suas próprias decisões e se autogerenciar. Esse estilo de liderança funciona melhor com equipes qualificadas e independentes, mas pode ser inadequado onde os membros precisam de mais orientação e apoio."}
                {higherPercentage === "democrat" &&
                  "O líder democrático, também conhecido como participativo, envolve o grupo nas decisões e incentiva o debate, delegando responsabilidades e aceitando opiniões divergentes. Esse estilo promove alto engajamento e qualidade nos resultados, mas pode tornar a tomada de decisões e a execução das tarefas mais lentas devido à necessidade de considerar todas as opiniões."}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-mint-100 p-4 text-night">
                  <p className="mb-1 flex items-center gap-2 font-display font-semibold text-mint-700">
                    <ThumbsUp className="size-4" /> Pontos fortes
                  </p>
                  <p className="text-sm font-semibold">
                    {higherPercentage === "autocrat" && "O líder autocrático foca nas atividades, conseguindo manter a equipe concentrada nas tarefas e nos objetivos, gerando alta produtividade."}
                    {higherPercentage === "liberal" && "Estimula a autonomia, criatividade e desenvolvimento de habilidades, favorecendo profissionais qualificados."}
                    {higherPercentage === "democrat" && "Foco nas pessoas e alto engajamento, resultando em produção de alta qualidade."}
                  </p>
                </div>
                <div className="rounded-2xl bg-coral-100 p-4 text-night">
                  <p className="mb-1 flex items-center gap-2 font-display font-semibold text-coral-700">
                    <TriangleAlert className="size-4" /> Pontos de atenção
                  </p>
                  <p className="text-sm font-semibold">
                    {higherPercentage === "autocrat" &&
                      "A falta de participação nas decisões pode gerar insatisfação entre os membros da equipe, levando a um ambiente de trabalho pouco motivador e possivelmente até à resistência passiva. Embora a produtividade possa ser alta, a qualidade dos resultados pode ser comprometida pela falta de autonomia da equipe."}
                    {higherPercentage === "liberal" && "Pode gerar sensação de abandono e permitir que erros passem despercebidos devido à falta de supervisão."}
                    {higherPercentage === "democrat" && "Pode causar lentidão nas atividades devido à necessidade de discussão e consideração de todas as ideias."}
                  </p>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {quiz.id === 3 && (
        <section className="mt-8">
          <h2 className="font-display text-xl font-semibold">Sua pontuação detalhada</h2>
          <p className="mb-4 mt-1 text-sm font-semibold text-soft">
            A Inteligência Emocional é a combinação de 5 habilidades. Quanto mais próximo de {total}, mais desenvolvida é a habilidade.
          </p>
          <ul className="space-y-3">
            {[
              ["Autoconhecimento", "Capacidade de reconhecer emoções, limites e qualidades pessoais com clareza.", firstGroupPoints],
              ["Autocontrole", "Capacidade de gerenciar impulsos, emoções e reações em situações desafiadoras.", secondGroupPoints],
              ["Automotivação", "Capacidade de manter foco, iniciativa e otimismo diante de obstáculos.", thirdGroupPoints],
              ["Empatia", "Capacidade de compreender emoções alheias com sensibilidade e respeito.", fourthGroupPoints],
              ["Habilidades sociais", "Capacidade de construir relacionamentos positivos com comunicação e colaboração.", fifthGroupPoints],
            ].map(([label, desc, value]) => (
              <li key={label} className="rounded-2xl border-2 border-rule p-4" aria-label={`${label}: ${value} de ${total} pontos. ${desc}`}>
                <ScoreBar label={String(label)} value={(Number(value) / total) * 100} hint={`${value}/${total}`} />
                <p className="mt-2 text-sm font-semibold text-soft">{desc}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {quiz.id === 4 && (
        <section className="mt-8">
          <h2 className="mb-4 font-display text-xl font-semibold">Seus fatores de motivação</h2>
          <ul className="space-y-3">
            {(
              [
                ["rp", "RP · Realização profissional", "Valorização de situações no trabalho que envolvem o desenvolvimento intelectual, a independência de pensamento e a autonomia de decisão."],
                ["hb", "HB · Harmonia e bem-estar pessoal", "Valorização de situações no trabalho que proporcionam equilíbrio entre vida pessoal e profissional, favorecem o bem-estar físico e emocional e contribuem para a satisfação no dia a dia."],
                ["rs", "RS · Relações sociais", "Valorização de situações no trabalho que envolvam ajudar, colaborar, servir e contribuir com a sociedade ou os necessitados."],
                ["e", "E · Estabilidade", "Valorização de situações no trabalho que garantem segurança, estabilidade financeira e tranquilidade em relação ao futuro."],
                ["p", "P · Protagonista", "Valorização de situações no trabalho que envolvem admiração, status, reconhecimento e respeito por parte de colegas e sociedade."],
              ] as const
            ).map(([key, label, desc]) => {
              const value = motivationFactors?.[key] || 0;
              return (
                <li key={key} className="rounded-2xl border-2 border-rule p-4" aria-label={`${label}: ${getCompatibilityText(value)}. ${desc}`}>
                  <ScoreBar label={label} value={Math.min(100, value)} hint={getCompatibilityText(value)} />
                  <p className="mt-2 text-sm font-semibold text-soft">{desc}</p>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        <Link href={trail ? `/trilha/${trail.slug}` : `/autoavaliacao/${quiz.slug}/iniciar`} className="btn-3d ghost">
          <Undo2 className="size-5" /> Refazer trilha
        </Link>
        <Link href="/" className="btn-3d">
          Outras trilhas
        </Link>
      </div>

        {/*
          Pra entender como funciona o form do shadcn
          https://ui.shadcn.com/docs/components/form
        */}
        {/*  
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mb-20 mt-7" noValidate>
            <h1 className="leading-5 font-medium text-neutral-800">
              Deseja receber seus resultados?
            </h1>
            <p className="text-sm text-neutral-600 mb-3">Receba seu resultado por email</p>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormMessage />
                  <FormControl >
                    <Input
                      className="focus-visible:ring-blue-500"
                      type="email"
                      placeholder="Insira seu email aqui"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <button
              className="bg-blue-600 hover:bg-blue-600 text-white font-medium py-2 px-7 min-w-32 mx-auto block my-5 w-fit rounded-full">
              Enviar feedback
            </button>
            {loading &&
              <div className="border-4 border-blue-500 border-r-transparent rounded-full size-9 mx-auto animate-spin"></div>
            }
            {!success && message && // Erro
              <p className="text-red-600 bg-red-100 font-medium py-2.5 px-5 rounded-md flex items-center justify-between flex-wrap">
                {message}
                <TriangleAlert className="size-4 min-w-4" />
              </p>
            }
            {success && message && // Sucesso
              <p className="text-green-600 bg-green-100 font-medium py-2.5 px-5 rounded-md flex items-center justify-between flex-wrap">
                {message}
                <Check className="size-4 min-w-4" />
              </p>
            }
          </form>
        </Form>
        */}
    </Shell>
  );
}

/** Barra de pontuação no estilo das trilhas; a mais alta fica destacada. */
function ScoreBar({ label, value, hint, highlight }: { label: string; value: number; hint: string; highlight?: boolean }) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-3 text-sm font-extrabold">
        <span className={cn(highlight && "text-pop")}>{label}</span>
        <span className="whitespace-nowrap text-pop tabular-nums">{hint}</span>
      </div>
      <div className="h-4 overflow-hidden rounded-full bg-panel2">
        <div className={cn("h-full rounded-full transition-[width] duration-1000 ease-out", highlight === false ? "bg-brand/50" : "bg-brand")} style={{ width: `${Math.max(4, value)}%` }} />
      </div>
    </div>
  );
}
