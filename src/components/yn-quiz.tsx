
"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NavigateQuestion from "./navigableQuestion";

/*
NOTA: Em algumas partes do código é possível notar
que utiliza-se do total das questões - 1 como em

function nextQuestion() {
  if (questionID < quizLength - 1) setQuestionID(questionID + 1)
}

Isso é porque o array começa em 0 e por isso é
preciso usar o total de questões - 1

-----------
Obs: allQuestionsSelected define uma array onde serão armazenadas as respostas do quiz
const allQuestionsSelected = selectedQuestions.every(selectedValue => selectedValue != 0);

0 -> nenhuma opção selecionada
1 -> reduz em um a pontuação final
2 -> adiciona em um a pontuação final

*/

const YNQuiz = ({ quiz }: { quiz: Quiz }) => {
  const quizLength = quiz.questions.length;

  const router = useRouter();

  // Numero da questão, deve começar em 0
  const [questionID, setQuestionID] = useState<number>(0);

  // Pontos iniciais equivalente ao total de perguntas
  const [points, setPoints] = useState<number>(quizLength);

  const [selectedQuestions, setSelectedQuestions] = useState<number[]>(Array(quizLength).fill(0));
  const allQuestionsSelected = selectedQuestions.every(selectedValue => selectedValue != 0);

  function nextQuestion() {
    if (questionID < quizLength - 1) setQuestionID(questionID + 1);
  }

  function subtractPoints() {
    if (points > 0 && selectedQuestions[questionID] != 1) setPoints(points - 1);
    const newSelectedQuestions = [...selectedQuestions];
    newSelectedQuestions[questionID] = 1; // Marca a opção selecionada
    setSelectedQuestions(newSelectedQuestions);

    nextQuestion();
  }

  function adjustPoints() {
    // Se a questão já foi selecionada anteriormente devolve o ponto
    if (selectedQuestions[questionID] === 1) {
      setPoints(points + 1);
    }

    const newSelectedQuestions = [...selectedQuestions];
    newSelectedQuestions[questionID] = 2; // Marca a opção selecionada 
    setSelectedQuestions(newSelectedQuestions);

    nextQuestion();
  }

  function navigateQuestion(value: number) {
    if (questionID > 0 && value < 0) setQuestionID(questionID - 1); // Retorna para a questão anterior
    if (questionID < quizLength - 1 && value > 0) setQuestionID(questionID + 1); // Avança para a próxima questão
  }

  function storePoints() {
    const lastPoints = points || 0;
    let storedResults = JSON.parse(localStorage.getItem("lastPoints") ?? "[]");
    const quizResultIndex = storedResults.findIndex(
      (result: LastPoints) => result.qID === quiz?.id
    );

    // Se o quiz ja tiver sido respondido, substitui os pontos
    if (quizResultIndex >= 0) {
      storedResults[quizResultIndex].lastPoints = lastPoints;
    } else {
      storedResults.push({ qID: quiz?.id, lastPoints: lastPoints });
    }

    localStorage.setItem("lastPoints", JSON.stringify(storedResults));
  }

  function storeFeedback() {
    //Armazena valor das respostas obtidas durante o questionário -> resgatar em resultados para conversão correspondente
    let feedbacks = selectedQuestions;
    localStorage.setItem("finalFeedback", JSON.stringify(feedbacks))
  }

  // Ao terminar o quiz, salva os pontos e redireciona para o resultado
  function persistPoints() {
    storePoints();
    storeFeedback();
    router.push(`/autoavaliacao/${quiz.slug}/resultados`);
  }

  return (
    <section className="w-full py-24">
      <div className="mx-3 md:mx-auto md:w-[520px] text-center text-xl lg:text-2xl">
        <p className="h-20 mt-10">
          {(questionID + 1) + ". " + quiz.questions[questionID].question}
        </p>
        <div className="flex justify-evenly items-center my-20">
          <Button
            className={
              selectedQuestions[questionID] === 2
                ? "bg-blue-700! text-white!"
                : " "
            }
            title="Sim"
            func={adjustPoints}
          />
          <Button
            className={
              selectedQuestions[questionID] === 1
                ? "bg-blue-700! text-white!"
                : " "
            }
            title="Não"
            func={subtractPoints}
          />
        </div>
        <div className="w-full h-2 bg-blue-100 rounded-full">
          <div
            className="bg-blue-700 h-2 rounded-full duration-300"
            // Calcula o percentual de completude das questões do valor total de questões
            style={{ width: `${(100 * questionID + 100) / quizLength}%` }}
          />
        </div>
        <div>
          <Button
            title={"Confirmar respostas"}
            className={
              // Se todas as questões tiverem sido respondidas, mostrar o botão
              allQuestionsSelected
                ? `w-9/12 mt-10`
                : "hidden"
            }
            func={persistPoints}
          />
        </div>
        <NavigateQuestion navigateQuestion={navigateQuestion} />
        
      </div>
    </section>
  )
};

export default YNQuiz;