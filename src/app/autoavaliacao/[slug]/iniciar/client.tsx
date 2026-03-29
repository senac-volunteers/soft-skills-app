"use client"
import GoBackButton from "@/components/goBackButton";
import Header from "@/components/header";
import MultipleChoiceQuiz from "@/components/multiple-choice-quiz";
import MultipleGroupQuiz from "@/components/multiple-group-quiz";
import YNQuiz from "@/components/yn-quiz";

export default function Client({
  quiz,
}: Readonly<{ quiz: Quiz }>) {

  return (
    <>
      {/* <Header /> */}
      
      {/* Obs: quiz.type === 0 significa que não tem um formulário */}
      {/* quiz.type = 1, renderiza o quiz de Sim ou Não*/}
      {quiz.type === 1 && <YNQuiz quiz={quiz} />}
      {/* quiz.type = 2, renderiza o quiz de multiplas escolhas*/}
      {quiz.type === 2 && <MultipleChoiceQuiz quiz={quiz} />}
      {/* quiz.type = 3, renderiza o quiz de multiplas escolhas, com pontuação dividida entre grupos*/}
      {quiz.type === 3 && <MultipleGroupQuiz quiz={quiz} />}

      {/* Botão de goBack posicionado abaixo dos forms para manter acessibilidade ao navegar com TAB - hierarquia DOM HTML */}
      <GoBackButton tabButton={0} style="absolute top-[7vh] left-[50vw]"/>
    </>
  );
}
