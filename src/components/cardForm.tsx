import Link from "next/link";

interface CardProps{
    icon: any,
    title: string,
    description: string,
    url: string, // Ex.: "/autoavaliacao/{slug}"
    tabTitle?: number, // acessibilidade
    tabLink?: number, // acessibilidade
    info?: boolean, // Se true, habilita descrição do card, opcional
    duration?: number, // Duração do teste em minutos, opcional
    btnText?: string, // Texto custom do botão, opcional
}

const CardForm = ({ icon, title, description, url, tabLink, tabTitle, info, duration, btnText }: CardProps) => {
    return (
        <article className="bg-blue-50 border block border-blue-100 rounded-md max-w-72 min-w-[300px] hover:bg-blue-100 duration-300">
            <div className="flex items-center gap-2 text-blue-700 pl-4 pr-2 py-2.5">
                {icon}
                <h3 tabIndex={tabTitle}>
                    {title}
                </h3>
            </div>

            <hr className="border-blue-100" />

            <p className={`text-sm px-4 py-2.5 text-neutral-700 h-36 overflow-y-auto ${info ? "block" : "hidden"}`} tabIndex={-1}>
                {info ? description : ""}
            </p>
            <div className="relative mt-3 mb-6">
                {duration && 
                    <p className="absolute right-0 -bottom-8 text-sm text-blue-600 px-4 py-2.5">{`${duration}min`}</p>
                }
                <Link href={url}
                    className="block text-center text-sm bg-white border-2 border-blue-700 w-[140px] mx-auto mb-4 py-1"
                    tabIndex={tabLink}
                    aria-label={`Começar teste sobre ${title}`}
                    >
                    {btnText ? btnText : "Começar teste"}
                </Link>
            </div>
        </article>
    )
}

export default CardForm;