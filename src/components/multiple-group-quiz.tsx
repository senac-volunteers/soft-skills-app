"use client"
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Button from "./button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NavigateQuestion from "./navigableQuestion";

interface GroupResults {
  qID: number,
  groupResults: [
    group1: number,
    group2: number,
    group3: number,
    group4: number,
    group5: number,
  ],
}

const MultipleGroupQuiz = ({ quiz }: { quiz: Quiz }) => {
    const quizLength = quiz.questions.length;

    // Numero da questão, deve começar em 0
    const [questionID, setQuestionID] = useState<number>(0);
    const [alternatives, setAlternatives] = useState<Alternatives[]>([]);
    const [selectedAlternatives, setSelectedAlternatives] = useState<number[]>(Array(quizLength).fill(0));
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

    // Função para navegar com as setas do teclado
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
            newSelectedAlternatives[questionID] = alternatives[currentIndex].weigth;
            setSelectedAlternatives(newSelectedAlternatives);

            // Avança para próxima questão automaticamente
            setTimeout(() => {
                navigateQuestion(1);
            }, 100);
        }
    }

    function storeResult() {
        // Separa o array maior de length 20 em 5 arrays de length 4
        const groupSize = 4;
        const groups = [];
        const groupResults: Record<string, number> = {
            group1: 0,
            group2: 0,
            group3: 0,
            group4: 0,
            group5: 0,
        }

        for (let i = 0; i < selectedAlternatives.length; i += groupSize) {
            groups.push(selectedAlternatives.slice(i, i + groupSize));
        }

        // Armazena valor das respostas obtidas durante o questionário, por grupo
        groups.forEach((group, index) => {
            const resp1 = group?.filter((alternative) => alternative === 1).length * 1;
            const resp2 = group?.filter((alternative) => alternative === 2).length * 2;
            const resp3 = group?.filter((alternative) => alternative === 3).length * 3;
            const resp4 = group?.filter((alternative) => alternative === 4).length * 4;
            const resp5 = group?.filter((alternative) => alternative === 5).length * 5;

            const total = resp1 + resp2 + resp3 + resp4 + resp5;
            groupResults[`group${index + 1}`] = total;
        });

        let storedResults = JSON.parse(localStorage.getItem("lastResults") ?? "[]");
        const quizResultIndex = storedResults.findIndex(
            (result: GroupResults) => result.qID === quiz?.id
        );

        if (quizResultIndex >= 0) {
            storedResults[quizResultIndex].lastResult = {
                group1: groupResults.group1,
                group2: groupResults.group2,
                group3: groupResults.group3,
                group4: groupResults.group4,
                group5: groupResults.group5
            };
        } else {
            storedResults.push({
                qID: quiz?.id,
                lastResult: {
                    group1: groupResults.group1,
                    group2: groupResults.group2,
                    group3: groupResults.group3,
                    group4: groupResults.group4,
                    group5: groupResults.group5
                },
            });
        }

        localStorage.setItem("lastResults", JSON.stringify(storedResults));
    }

    function confirmAnswers() {
        storeResult();
        router.push(`/autoavaliacao/${quiz.slug}/resultados`);
    }

    useEffect(() => {
        const alternatives = quiz.questions[questionID].alternatives!;
        setAlternatives(alternatives);
    }, [questionID])

    useEffect(() => {
        if (accessibleMode) {
            // Foca na questão atual quando muda
            questionRef.current?.focus();
        }
    }, [questionID, alternatives, selectedAlternatives]);

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
                <div
                    ref={questionRef}
                    tabIndex={1}
                    className="mb-3 text-xl font-medium"
                    role="heading"
                    aria-level={2}
                    aria-live="polite"
                >
                    <p className="mb-3 text-xl font-medium">
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

                {/* Fieldset para agrupar os radio buttons */}
                <fieldset className="my-3 border-t border-b">
                    <legend className="sr-only" style={{ userSelect: "none" }}>
                        Selecione uma alternativa para a questão {questionID + 1}
                    </legend>

                    <ul
                        className="flex flex-col justify-center"
                        role="radiogroup"
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
                                        type="radio"
                                        name={`question-${questionID}`}
                                        className="checked:accent-blue-700 mt-1.5 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-2 focus:outline-blue-500 focus:outline-offset-2 rounded"
                                        id={`${alternative.id}-${questionID}`}
                                        value={alternative.id}
                                        checked={selectedAlternatives[questionID] === alternative.weigth}
                                        onChange={() => {
                                            const newSelectedAlternatives: any = [...selectedAlternatives];
                                            newSelectedAlternatives[questionID] = alternative.weigth;
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
                {selectedAlternatives.indexOf(0) === -1 && (
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

                <NavigateQuestion
                    navigateQuestion={navigateQuestion}
                />
            </div>
        </section>
    )
};

export default MultipleGroupQuiz;