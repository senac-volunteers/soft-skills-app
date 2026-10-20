'use client'
import GoBackButton from "@/components/goBackButton";
import Header from "@/components/header";
import { Clock, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Client({
  quiz
}: Readonly<{ quiz: Quiz }>) {
  const [hasResults, setHasResults] = useState<boolean>(false)
  useEffect(() => {
    const lastResults = localStorage.getItem('lastPoints') ?? localStorage.getItem('lastResults');

    if (lastResults) {
      setHasResults(true)
    }
  }, [])

  return (
    <>
      {/* <Header /> */}
      <GoBackButton redirect="/" tabButton={1}/>

      <main className="py-20 sm:py-44">
        <div className="flex flex-col sm:flex-row gap-10 max-w-xs sm:max-w-4xl mx-auto">
          <Image src={"/" + quiz.image} alt={quiz.alt} width={400} height={400} className="w-72 min-w-72 sm:w-1/2" priority tabIndex={2}/>
          <section className="space-y-7">
            <div>
              <h1 className="text-3xl font-bold text-blue-700" tabIndex={3} aria-label={`${quiz.title}`}>{quiz.title}</h1>
              <h2 className="text-2xl font-semibold text-neutral-400">{quiz.type === 0 ? "Curso" :"Autoavaliação"}</h2>
            </div>
            <hr />
            <div className="max-w-sm space-y-4 text-neutral-800">
              <p 
              className="whitespace-pre-wrap wrap-break-word" 
              tabIndex={4}
              >
                {quiz.description}
              </p>
              {quiz.duration != 0 && 
              <>
                <div className="flex items-center gap-2">
                  <Clock className="size-4" /> <span>{quiz.duration} min</span>
                </div>
                <p className="text-base text-neutral-500">
                  Suas respostas são mantidas em sigilo.
                </p>
              </>
              }
            </div>
            <Link href={quiz.url != "" ? quiz.url : `/autoavaliacao/${quiz.slug}/iniciar`}
              className="bg-blue-700 hover:bg-blue-600 block text-center text-white font-bold py-3 px-6 rounded-full"
              aria-label="Começar teste"
              tabIndex={5}
              >
              Começar
            </Link>

            {(quiz.duration != 0 && hasResults) &&
              <Link href={`/autoavaliacao/${quiz.slug}/resultados`}
                className="flex justify-center items-center gap-2 text-neutral-600 font-medium hover:underline"
                aria-label="Consultar último resultado"
                tabIndex={6}
                >
                <ExternalLink className="size-4" />
                Ver últimos resultados
              </Link>
            }
          </section>
        </div>
      </main>
    </>
  );
}
