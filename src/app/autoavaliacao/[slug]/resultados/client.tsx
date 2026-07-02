"use client";
//imports next e react
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

import { Check, TriangleAlert, Undo2 } from "lucide-react";

//imports para email
import { sendResults } from "@/actions/results.action";
import { sendResultsSchema, SendResultsValues } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

//componentes
import Header from "@/components/header";
import { Input } from "@/components/ui/input";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { Form, FormField, FormItem, FormMessage, FormControl } from "@/components/ui/form";
import { useIsMobile } from "@/hooks/use-mobile";
import { ResultsEmail } from "@/components/results-email";
import GoBackButton from "@/components/goBackButton";
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
      autoconhecimento: { title: "🦉 Sábio Interior", color: "text-purple-600", desc: "Você tem uma clareza incrível sobre suas próprias emoções e limites." },
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
    if (percentage >= 80) return { title: "🚀 Mente Visionária", color: "text-purple-600", desc: "Você tem uma capacidade excepcional de gerar ideias inovadoras e pensar fora da caixa." };
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
      rp: { title: "🚀 Especialista Independente", color: "text-purple-600", desc: "Você é movido pelo desenvolvimento intelectual e autonomia." },
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
  
  return (
    <>
      {/* <Header /> */}
      <GoBackButton tabButton={1} redirect="/" />

      <div className="mx-auto py-32 max-w-xs sm:max-w-4xl sm:px-5">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-blue-700 w-max "
            aria-label={`${quiz.title} - Resultados obtidos`}
            tabIndex={2}
          >
            {quiz.title}
          </h1>
          <h2 className="text-2xl font-semibold text-neutral-400">Autoavaliação</h2>
        </div>
        <div className="flex flex-col items-start">
          {quiz.id === 1 && (
            <>
           {/* --- CARD GAMIFICADO --- */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-8 mb-10 mt-4 text-center shadow-sm" tabIndex={3}>
                <p className="text-sm text-neutral-500 uppercase tracking-widest font-bold mb-3">Seu Nível de Criatividade</p>
                <h2 className={`text-4xl sm:text-5xl font-extrabold ${getCreativityProfile()?.color} mb-4`}>{getCreativityProfile()?.title}</h2>
                <p className="text-neutral-600 font-medium text-lg">{getCreativityProfile()?.desc}</p>
              </div>
              <p className="text-lg text-neutral-600"
                tabIndex={4}
                aria-label={`Sua pontuação: ${points} pontos`}
              >
                {points}<span className="text-neutral-600 text-4xl">/{quiz.questions.length}</span>
              </p>
            </>
          )}

          {quiz.id === 2 && (
            <>
            {/* --- CARD GAMIFICADO --- */}
              {higherPercentage && (
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-8 mb-10 mt-4 text-center shadow-sm w-full" tabIndex={3}>
                  <p className="text-sm text-neutral-500 uppercase tracking-widest font-bold mb-3">Seu Estilo Dominante</p>
                  <h2 className={`text-4xl sm:text-5xl font-extrabold ${getLeadershipProfile()?.color} mb-4`}>{getLeadershipProfile()?.title}</h2>
                  <p className="text-neutral-600 font-medium text-lg">{getLeadershipProfile()?.desc}</p>
                </div>
              )}
              <h1 className="text-xl font-medium text-neutral-800"
                tabIndex={3}
                aria-label={`Sua pontuação: Autocrática ${autocratPercentage.toFixed(0)}% Liberal ${liberalPercentage.toFixed(0)}% Democrática ${democratPercentage.toFixed(0)}%`}
              >
                Sua pontuação
              </h1>
              <div className="flex flex-col sm:flex-row justify-between w-full mt-4">
                <div className="flex-1">
                  <p className="text-neutral-600 text-lg">Autocrática</p>
                  <p className="font-light text-blue-700 text-5xl my-2 mb-5">
                    {autocratPercentage.toFixed(0)}%
                  </p>

                  <p className="text-neutral-600 text-lg">Liberal</p>
                  <p className="font-light text-blue-700 text-5xl my-2 mb-5">
                    {liberalPercentage.toFixed(0)}%
                  </p>

                  <p className="text-neutral-600 text-lg">Democrática</p>
                  <p className="font-light text-blue-700 text-5xl my-2 mb-5">
                    {democratPercentage.toFixed(0)}%
                  </p>
                </div>

                <div className="flex-1">
                  <p className="text-neutral-600 text-lg"
                    tabIndex={4}
                    aria-label="Seu perfil de liderança:"
                    aria-describedby={`${higherPercentage == 'autocrat' ? "Autocrático" : higherPercentage == 'liberal' ? "Liberal" : "Democrático"}`}
                  >
                    Seu perfil de liderança
                  </p>
                  <p className="font-light text-blue-700 text-5xl my-2 mb-5">
                    {higherPercentage === 'autocrat' && <>Autocrático</>}
                    {higherPercentage === 'liberal' && <>Liberal</>}
                    {higherPercentage === 'democrat' && <>Democrático</>}
                  </p>

                  <p className="my-4">
                    {higherPercentage === 'autocrat' && (
                      <p tabIndex={5}>
                        Caracteriza-se por um controle centralizado e unilateral, onde
                        o líder toma todas as decisões importantes e define as direções
                        sem consulta ou colaboração com a equipe. Embora esse estilo
                        possa ser eficaz em situações em que a rapidez na tomada de
                        decisões é crucial ou onde a disciplina é necessária, ele também
                        apresenta desvantagens significativas.
                      </p>
                    )}

                    {higherPercentage === 'liberal' && (
                      <p tabIndex={5}>
                        O líder liberal permite que a equipe trabalhe de forma autônoma,
                        sem intervenção direta, confiando que os membros experientes e
                        competentes possam tomar suas próprias decisões e se autogerenciar.
                        Esse estilo de liderança funciona melhor com equipes qualificadas
                        e independentes, mas pode ser inadequado onde os membros precisam
                        de mais orientação e apoio.
                      </p>
                    )}

                    {higherPercentage === 'democrat' && (
                      <p tabIndex={5}>
                        O líder democrático, também conhecido como participativo, envolve
                        o grupo nas decisões e incentiva o debate, delegando responsabilidades
                        e aceitando opiniões divergentes. Esse estilo promove alto engajamento
                        e qualidade nos resultados, mas pode tornar a tomada de decisões
                        e a execução das tarefas mais lentas devido à necessidade de considerar
                        todas as opiniões.
                      </p>
                    )}
                  </p>

                  <p className="font-semibold" tabIndex={6}>
                    Pontos fortes:
                  </p>
                  <p>
                    {higherPercentage === 'autocrat' && (
                      <p tabIndex={7}>
                        O líder autocrático apresenta foca nas atividades, conseguindo
                        manter a equipe concentrada nas tarefas e nos objetivos,
                        gerando alta produtividade.
                      </p>
                    )}

                    {higherPercentage === 'liberal' && (
                      <p tabIndex={7}>
                        Estimula a autonomia, criatividade e desenvolvimento de habilidades,
                        favorecendo profissionais qualificados.
                      </p>
                    )}

                    {higherPercentage === 'democrat' && (
                      <p tabIndex={7}>
                        Foco nas pessoas e alto engajamento, resultando em produção de
                        alta qualidade.
                      </p>
                    )}
                  </p>

                  <p className="font-semibold mt-4" tabIndex={8}>
                    Pontos fracos:
                  </p>
                  <p>
                    {higherPercentage === 'autocrat' && (
                      <p tabIndex={9}>
                        A falta de participação nas decisões pode gerar insatisfação entre os
                        membros da equipe, levando a um ambiente de trabalho pouco motivador
                        e possivelmente até à resistência passiva. Embora a produtividade possa
                        ser alta, a qualidade dos resultados pode ser comprometida pela falta
                        de autonomia da equipe.
                      </p>
                    )}

                    {higherPercentage === 'liberal' && (
                      <p tabIndex={9}>
                        Pode gerar sensação de abandono e permitir que erros passem despercebidos
                        devido à falta de supervisão.
                      </p>
                    )}

                    {higherPercentage === 'democrat' && (
                      <p tabIndex={9}>
                        Pode causar lentidão nas atividades devido à necessidade de discussão
                        e consideração de todas as ideias.
                      </p>
                    )}
                  </p>
                </div>
              </div>
            </>
          )}

          {quiz.id === 3 && (
            <>

             {/* --- NOVA SEÇÃO DE GAMIFICAÇÃO: INTELIGÊNCIA EMOCIONAL --- */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-8 mb-10 mt-4 text-center shadow-sm" tabIndex={3}>
                <p className="text-sm text-neutral-500 uppercase tracking-widest font-bold mb-3">
                  Sua Maior Força Emocional
                </p>
                <h2 className={`text-4xl sm:text-5xl font-extrabold ${getEQProfile()?.color} mb-4`}>
                  {getEQProfile()?.title}
                </h2>
                <p className="text-neutral-600 font-medium text-lg">
                  {getEQProfile()?.desc}
                </p>
              </div>
              {/* --------------------------------------------------------- */}

              <h1 className="text-xl font-medium text-neutral-800">Sua pontuação detalhada</h1>
              <div tabIndex={3} className="text-sm text-neutral-600 mt-2 mb-6">
                <p>A Inteligência Emocional é a combinação de 5 habilidades: Autoconhecimento, Autocontrole, Automotivação, Empatia e Habilidades Sociais.</p>
                <p className="mt-2">Quanto mais próximo de {quiz.questions.length}, mais desenvolvida é a habilidade.</p>
              </div>

              {/* pontuação de habilidades de Autoconhecimento */}
              <p className="text-sm text-neutral-600"
                tabIndex={4}
                aria-label="Habilidades de Autoconhecimento: Capacidade de reconhecer emoções, limites e qualidades pessoais com clareza."
              >
                <span className="font-bold text-black">Habilidades de Autoconhecimento: </span>
                Capacidade de reconhecer emoções, limites e qualidades pessoais com clareza.
              </p>
              <p className="font-light text-blue-700 text-7xl my-4"
                tabIndex={5}
                aria-label={`${firstGroupPoints} pontos`}
              >
                {firstGroupPoints}
              </p>
              <p className="text-neutral-600 text-lg">/ {quiz.questions.length}</p>
              <br />

              {/* pontuação de habilidades de autocontrole */}
              <p className="text-sm text-neutral-600"
                tabIndex={6}
                aria-label="Habilidades de Autocontrole: Capacidadede gerenciar impulsos, emoções e reações em situações desafiadoras."
              >
                <span className="font-bold text-black">Habilidades de Autocontrole: </span>
                Capacidadede gerenciar impulsos, emoções e reações em situações desafiadoras.
              </p>
              <p className="font-light text-blue-700 text-7xl my-4"
                tabIndex={7}
                aria-label={`${secondGroupPoints} pontos`}
              >
                {secondGroupPoints}
              </p>
              <p className="text-neutral-600 text-lg">/ {quiz.questions.length}</p>
              <br />

              {/* pontuação de habilidades de automotivação */}
              <p className="text-sm text-neutral-600"
                tabIndex={8}
                aria-label="Habilidades de Automotivação: Capacidade de manter foco, iniciativa e otimismo diante de obstáculos."
              >
                <span className="font-bold text-black">Habilidades de Automotivação: </span>
                Capacidade de manter foco, iniciativa e otimismo diante de obstáculos.
              </p>
              <p className="font-light text-blue-700 text-7xl my-4"
                tabIndex={9}
                aria-label={`${thirdGroupPoints} pontos`}
              >
                {thirdGroupPoints}
              </p>
              <p className="text-neutral-600 text-lg">/ {quiz.questions.length}</p>
              <br />

              {/* pontuação de habilidades de empatia */}
              <p className="text-sm text-neutral-600"
                tabIndex={10}
                aria-label="Habilidades de Empatia: Capacidade de compreender emoções alheias com sensibilidade e respeito."
              >
                <span className="font-bold text-black">Habilidades de Empatia: </span>
                Capacidade de compreender emoções alheias com sensibilidade e respeito.
              </p>
              <p className="font-light text-blue-700 text-7xl my-4"
                tabIndex={11}
                aria-label={`${fourthGroupPoints} pontos`}
              >
                {fourthGroupPoints}
              </p>
              <p className="text-neutral-600 text-lg">/ {quiz.questions.length}</p>
              <br />

              {/* pontuação de habilidades sociais */}
              <p className="text-sm text-neutral-600"
                tabIndex={12}
                aria-label="Habilidades Sociais: Capacidade de contruir relacionamentos positivos com comunicação e colaboração."
              >
                <span className="font-bold text-black">Habilidades Sociais: </span>
                Capacidade de contruir relacionamentos positivos com comunicação e colaboração.
              </p>
              <p className="font-light text-blue-700 text-7xl my-4"
                tabIndex={13}
                aria-label={`${fifthGroupPoints} pontos`}
              >
                {fifthGroupPoints}
              </p>
              <p className="text-neutral-600 text-lg">/ {quiz.questions.length}</p>
              <br />

            </>
          )}

          {quiz.id === 4 && (
            <>
              {/* --- CARD GAMIFICADO --- */}
              {motivationFactors && (
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-8 mb-10 mt-4 text-center shadow-sm" tabIndex={3}>
                  <p className="text-sm text-neutral-500 uppercase tracking-widest font-bold mb-3">Seu Motor Profissional</p>
                  <h2 className={`text-4xl sm:text-5xl font-extrabold ${getMotivationProfile()?.color} mb-4`}>{getMotivationProfile()?.title}</h2>
                  <p className="text-neutral-600 font-medium text-lg">{getMotivationProfile()?.desc}</p>
                </div>
              )}

             {/* RP - Relações Profissionais  */}
              <h2 className="font-bold">RP - Relações Profissionais</h2>
              <p className="text-sm text-neutral-600"
                tabIndex={4}
                aria-label="RP - Relações Profissionais: Valorização de situações no trabalho que envolvem o desenvolvimento intelectual, a independência de pensamento e a autonomia de decisão."
              >
                Valorização de situações no trabalho que envolvem o desenvolvimento intelectual, a independência de pensamento e a autonomia de decisão.
              </p>
              <p className="font-light text-blue-700 text-3xl my-4"
                tabIndex={5}
                aria-label={getCompatibilityText(motivationFactors?.rp || 0)}
              >
                {getCompatibilityText(motivationFactors?.rp || 0)}
              </p>
              <br />

              {/* HB – Harmonia e bem-estar pessoal */}
              <h2 className="font-bold">HB - Harmonia e bem-estar pessoal</h2>
              <p className="text-sm text-neutral-600"
                tabIndex={6}
                aria-label="HB - Harmonia e bem-estar pessoal: Valorização de situações no trabalho que proporcionam equilíbrio entre vida pessoal e profissional, favorecem o bem-estar físico e emocional e contribuem para a satisfação no dia a dia."
              >
                Valorização de situações no trabalho que proporcionam equilíbrio entre vida pessoal e profissional, favorecem o bem-estar físico e emocional e contribuem para a satisfação no dia a dia.
              </p>
              <p className="font-light text-blue-700 text-3xl my-4"
                tabIndex={7}
                aria-label={getCompatibilityText(motivationFactors?.hb || 0)}
              >
                {getCompatibilityText(motivationFactors?.hb || 0)}
              </p>
              <br />

              {/* RS – Relações sociais */}
              <h2 className="font-bold">RS – Relações sociais</h2>
              <p className="text-sm text-neutral-600"
                tabIndex={8}
                aria-label="RS – Relações sociais: Valorização de situações no trabalho que envolvam ajudar, colaborar, servir e contribuir com a sociedade ou os necessitados."
              >
                Valorização de situações no trabalho que envolvam ajudar, colaborar, servir e contribuir com a sociedade ou os necessitados.
              </p>
              <p className="font-light text-blue-700 text-3xl my-4"
                tabIndex={9}
                aria-label={getCompatibilityText(motivationFactors?.rs || 0)}
              >
                {getCompatibilityText(motivationFactors?.rs || 0)}
              </p>
              <br />

              {/* E - Estabilidade */}
              <h2 className="font-bold">E - Estabilidade</h2>
              <p className="text-sm text-neutral-600"
                tabIndex={10}
                aria-label="E - Estabilidade: Valorização de situações no trabalho que garantem segurança, estabilidade financeira e tranquilidade em relação ao futuro."
              >
                Valorização de situações no trabalho que garantem segurança, estabilidade financeira e tranquilidade em relação ao futuro.
              </p>
              <p className="font-light text-blue-700 text-3xl my-4"
                tabIndex={11}
                aria-label={getCompatibilityText(motivationFactors?.e || 0)}
              >
                {getCompatibilityText(motivationFactors?.e || 0)}
              </p>
              <br />

              {/* P – Prestígio */}
              <h2 className="font-bold">P - Protagonista</h2>
              <p className="text-sm text-neutral-600"
                tabIndex={12}
                aria-label="P - Protagonista: Valorização de situações no trabalho que envolvem admiração, status, reconhecimento e respeito por parte de colegas e sociedade."
              >
                Valorização de situações no trabalho que envolvem admiração, status, reconhecimento e respeito por parte de colegas e sociedade.
              </p>
              <p className="font-light text-blue-700 text-3xl my-4"
                tabIndex={13}
                aria-label={getCompatibilityText(motivationFactors?.p || 0)}
              >
                {getCompatibilityText(motivationFactors?.p || 0)}
              </p>
              <br />
              </>
          )}
          <Link
            href={`/autoavaliacao/` + quiz.slug + `/iniciar`}
            className="text-blue-700 w-fit my-4 mb-4 flex items-center gap-1 hover:underline focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 rounded">
            <Undo2 className="size-4" />
            Refazer teste
          </Link>

          <hr className="my-4 w-full" />

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
      </div >
    </>
  );
}
