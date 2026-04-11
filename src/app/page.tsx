import Github from "@/assets/icons/github";
import CardForm from "@/components/cardForm";
import Header from "@/components/header";
import { Brain, Users, BarChart4, Puzzle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="pt-20 pb-36 px-0">
        <div className="fixed inset-0 -z-10 h-screen w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#0064c3_100%)]"></div>
        <div className="max-w-sm sm:max-w-2xl mx-auto">
          <header className="text-center space-y-7 mb-72 sm:mt-20">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-700" tabIndex={1}>
              Soft Skills Academy
            </h1>
            <p className="text-lg sm:text-xl text-neutral-600 font-medium" tabIndex={2}>
              Questionários de autoavaliação para ajudá-lo(a) a desenvolver suas habilidades comportamentais.
            </p>
          </header>
          <section className="px-6 py-4 pb-7 mb-20 bg-white border rounded-lg space-y-4 relative">
            <figure>
              <Image src={'/mountain.svg'} width={350} height={350} alt="Mulher com mochila caminha em direção a uma grande árvore, com montanhas suaves e sol ao fundo, representando a busca por seus objetivos pessoais" className="w-80 absolute top-0 right-0 -translate-y-full -z-10" tabIndex={3}/>
            </figure>
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-xl text-blue-600 sm:whitespace-nowrap whitespace-normal" tabIndex={4}>Testes de Autoavaliação de SoftSkills</h2>
              <hr className="w-full border-blue-100" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-wrap justify-center items-center">

              <CardForm
                icon={<Brain className="size-4" />}
                title="Inteligência Emocional"
                description="Inteligência emocional é um conceito em psicologia que descreve a capacidade de reconhecer e avaliar os seus próprios sentimentos e os dos outros, assim como a capacidade de lidar com eles."
                url="/autoavaliacao/inteligencia-emocional"
                duration={2}
                tabTitle={5}
                tabLink={6}
              />
              
              {/* apenas comentando para mostrar no commit */}

              <CardForm
                icon={<Brain className="size-4" />}
                title="Curso de Inteligência Emocional"
                description=""
                url="/autoavaliacao/curso-inteligencia-emocional"
                btnText="Começar curso"
                tabTitle={7}
                tabLink={8}
              />

              <CardForm
                icon={<Users className="size-4" />}
                title="Estilos de Liderança"
                description="Existem várias abordagens de liderança amplamente reconhecidas, mas de acordo com o autor Kurt Lewin, os estilos mais clássicos de liderança são: democrática, liberal e autocrática. Assim, o estilo democrático enfatiza a participação, o liberal permite autonomia e o autocrático centraliza o poder decisório."
                url="/autoavaliacao/estilos-de-lideranca"
                duration={2}
                tabTitle={9}
                tabLink={10}
              />

              <CardForm
                icon={<BarChart4 className="size-4" />}
                title="Motivação no Trabalho"
                description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Adipisci veritatis libero reprehenderit accusamus neque, quasi animi voluptatibus itaque quidem commodi nihil, reiciendis a enim natus esse cum beatae eos quod."
                url="/autoavaliacao/motivacao-no-trabalho"
                duration={2}
                tabTitle={11}
                tabLink={12}
              />

              <CardForm
                icon={<Puzzle className="size-4" />}
                title="Criatividade"
                description="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Adipisci veritatis libero reprehenderit accusamus neque, quasi animi voluptatibus itaque quidem commodi nihil, reiciendis a enim natus esse cum beatae eos quod."
                url="/autoavaliacao/escala-de-criatividade"
                duration={2}
                tabTitle={13}
                tabLink={14}
              />
            </div>
          </section>

          {/* Footer */}
          <footer className="text-neutral-600 text-xs text-center sm:text-sm w-full mb-10">
            <p>&copy; 2024 Soft Skills Check. Todos os direitos reservados.</p>
            <p>Faculdade de Tecnologia e Inovação Senac DF</p>
          </footer>
          <Link
            href={'https://github.com/senac-volunteers/soft-skills-app'}
            target="_blank"
            referrerPolicy="no-referrer"
            className="w-fit block mx-auto focus:outline-4 focus:outline-blue-500 focus:outline-offset-2 rounded"
          >
            <Github className="size-5 text-neutral-700" />
          </Link>
        </div>
      </main>
    </>
  );
}