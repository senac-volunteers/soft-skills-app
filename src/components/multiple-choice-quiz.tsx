"use client"
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Button from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NavigateQuestion from "./navigableQuestion";
import { LastResultEntry } from "@/types/lastResults";

const MultipleChoiceQuiz = ({ quiz }: { quiz: Quiz }) => {
  const quizLength = quiz.questions.length;

  // Numero da questão, deve começar em 0
  const [questionID, setQuestionID] = useState<number>(0);
  const [alternatives, setAlternatives] = useState<Alternatives[]>([]);
  const [selectedAlternatives, setSelectedAlternatives] = useState<string[]>(Array(quizLength).fill(''));
  const [accessibleMode, setAccessibleMode] = useState(false);

  const router = useRouter();

  const inputRef = useRef<(HTMLInputElement | null)[]>([]);
  const questionRef = useRef<HTMLDivElement>(null);

  // Mostrar botão de confirmar apenas na ultima questão
  const allQuestionsSelected = questionID === quizLength - 1;

  function navigateQuestion(value: number) {
    if (questionID > 0 && value < 0) {
      setQuestionID(questionID - 1);
    }
    if (questionID < quizLength - 1 && value > 0) {
      setQuestionID(questionID + 1);
    }
  }

  // Função para navegar apenas com as setas do teclado
  function handleKeyDown(event: React.KeyboardEvent, currentIndex: number) {
    const key = event.key;

    if (key === 'ArrowDown' || key === 'ArrowRight') {
      event.preventDefault();
      const nextIndex = (currentIndex + 1) % alternatives.length;
      inputRef.current[nextIndex]?.focus();
    } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
      event.preventDefault();
      const prevIndex = currentIndex === 0 ? alternatives.length - 1 : currentIndex - 1;
      inputRef.current[prevIndex]?.focus();
    } else if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      // Seleciona a alternativa atual
      const newSelectedAlternatives: any = [...selectedAlternatives];
      newSelectedAlternatives[questionID] = alternatives[currentIndex].categoryValue;
      setSelectedAlternatives(newSelectedAlternatives);

      // Avança para próxima questão automaticamente
      setTimeout(() => {
        navigateQuestion(1);
      }, 100);
    }
  }

  function storeResult() {
    // Define dinamicamente os possíveis tipos de resposta
    const categories = ["autocrat", "liberal", "democrat",];

    // Conta e preenche automaticamente a pontuação respectiva de cada categoria
    const resultCounts = selectedAlternatives[0]?.includes("-") ? 
      (selectedAlternatives ?? []).reduce((acc, item) => {
        const [category, valueStr] = item.split("-");
        const value = parseFloat(valueStr) || 0;

        acc[category] = (acc[category] || 0) + value;
        return acc;
      }, {} as Record<string, number>) : 
      categories.reduce((acc, category) => {
        acc[category] = selectedAlternatives?.filter(a => a === category).length || 0;
        return acc;
      }, {} as Record<string, number>);

    // Lê resultados anteriores
    const storedResults = JSON.parse(localStorage.getItem("lastResults") ?? "[]");
    const quizResultIndex = storedResults.findIndex(
      (result: LastResultEntry) => result.qID === quiz?.id
    );

    // Atualiza ou adiciona o resultado
    if (quizResultIndex >= 0) {
      storedResults[quizResultIndex].lastResult = resultCounts;
    } else {
      storedResults.push({
        qID: quiz?.id,
        lastResult: resultCounts,
      });
    }

    // Persiste no localStorage
    localStorage.setItem("lastResults", JSON.stringify(storedResults));
  }

  function shuffle(array: Alternatives[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function confirmAnswers() {
    storeResult();
    router.push(`/autoavaliacao/${quiz.slug}/resultados`);
  }

  useEffect(() => {
    if (accessibleMode) {
      // Sempre foca na pergunta primeiro quando muda de questão
      questionRef.current?.focus();
    }
  }, [questionID]);

  useEffect(() => {
    const shuffledAlternatives = shuffle(quiz.questions[questionID].alternatives!);
    setAlternatives(shuffledAlternatives);
  }, [questionID])

  useEffect(() => {
    // Após as alternativas serem definidas, define o foco inicial
    if (alternatives.length > 0) {
      // Se já existe uma resposta selecionada, prepara para focar nela
      const selectedIndex = alternatives.findIndex(alt => alt.categoryValue === selectedAlternatives[questionID]);
      const focusIndex = selectedIndex >= 0 ? selectedIndex : 0;

      // Pequeno delay para permitir que a pergunta seja focada primeiro
      // setTimeout(() => {
      //   // Só foca na opção se não estivermos focando na pergunta
      //   if (document.activeElement !== questionRef.current) {
      //     inputRef.current[focusIndex]?.focus();
      //   }
      // }, 200);
    }
  }, [alternatives, selectedAlternatives, questionID]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" && !accessibleMode) {
        setAccessibleMode(true);
      }
    };
    const handleClick = (e: MouseEvent) => {
      if (e.isTrusted) {
        setAccessibleMode(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClick);
    };
  }, [accessibleMode]);

  return (
    <section className="w-full py-24">
      <div className="mx-3 mt-10 px-5 md:mx-auto md:w-[520px]">
        {/* Cabeçalho da questão com foco para leitores de tela */}
        <div className="focus:outline-none">
          <p
            ref={questionRef}
            tabIndex={0}
            className="mb-3 text-xl font-medium p-2"
            role="heading"
            aria-level={2}
            aria-live="polite"
          >
            {(questionID + 1) + ". " + quiz.questions[questionID].question}
          </p>

          {/* Informação adicional para leitores de tela */}
          <p className="sr-only" style={{ userSelect: "none" }}>
            Questão {questionID + 1} de {quizLength}.
            Use as setas do teclado para navegar entre as opções,
            Enter ou Espaço para selecionar,
            Tab para navegar entre elementos.
          </p>
        </div>

        {/* Fieldset para agrupar os checkboxes */}
        <fieldset className="my-3 border-t border-b">
          <legend className="sr-only" style={{ userSelect: "none" }}>
            Selecione uma alternativa para a questão {questionID + 1}
          </legend>

          <ul
            className="flex flex-col justify-center"
            role="group"
            aria-labelledby={`question-${questionID}`}
            aria-required="true"
          >
            {alternatives.map((alternative, index) => (
              <li
                key={alternative.id}
                className="py-2"
                role="none"
              >
                <label
                  htmlFor={`${alternative.id}-${questionID}`}
                  className="flex gap-2 items-start cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <input
                    ref={(el) => { inputRef.current[index] = el }}
                    type="checkbox"
                    name={`question-${questionID}`}
                    className="checked:accent-blue-700 mt-1.5 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 rounded"
                    id={`${alternative.id}-${questionID}`}
                    value={alternative.id}
                    checked={selectedAlternatives[questionID] === alternative.categoryValue}
                    onChange={() => {
                      const newSelectedAlternatives: any = [...selectedAlternatives];
                      newSelectedAlternatives[questionID] = alternative.categoryValue;
                      setSelectedAlternatives(newSelectedAlternatives);

                      // Pequeno delay antes de navegar automaticamente
                      setTimeout(() => {
                        navigateQuestion(1);
                      }, 100);
                    }}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    aria-describedby={`alternative-${index}-desc`}
                  />
                  <div>
                    <span aria-hidden="true">
                      {index === 0 && 'a) '}
                      {index === 1 && 'b) '}
                      {index === 2 && 'c) '}
                      {index === 3 && 'd) '}
                      {index === 4 && 'e) '}
                    </span>
                    <span id={`alternative-${index}-desc`}>
                      {alternative.text}
                    </span>
                  </div>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        {/* Barra de progresso com informação acessível */}
        <div
          className="bg-blue-100 rounded-full"
          role="progressbar"
          aria-valuenow={((questionID + 1) / quizLength) * 100}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progresso do questionário: ${questionID + 1} de ${quizLength} questões completadas`}
        >
          <div
            className="bg-blue-700 h-2 rounded-full mt-6 duration-300"
            style={{ width: `${(100 * questionID + 100) / quizLength}%` }}
          />
        </div>

        {/* Texto do progresso visível */}
        <p className="text-sm text-gray-600 mt-2 text-center">
          Questão {questionID + 1} de {quizLength}
        </p>

        {/* Botão de confirmar com melhor acessibilidade */}
        {selectedAlternatives.indexOf("") === -1 && (
          <Button
            title="Confirmar respostas"
            className={
              allQuestionsSelected
                ? "w-full mx-auto mt-10 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                : "hidden"
            }
            func={confirmAnswers}
            aria-label="Confirmar todas as respostas e ver resultados"
          />
        )}

        <NavigateQuestion navigateQuestion={navigateQuestion} />
      </div>
    </section>
  )
}

export default MultipleChoiceQuiz;