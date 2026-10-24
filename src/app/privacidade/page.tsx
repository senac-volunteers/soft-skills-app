import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Shell } from "@/components/game/shell";
import { SiteFooter } from "@/components/game/site-footer";

export const metadata: Metadata = {
  title: "Privacidade | Soft Skills Academy",
  description: "Como o Soft Skills Academy trata dados pessoais e o que fica salvo no seu navegador (LGPD).",
};

const UPDATED = "20 de outubro de 2026";

// Dados do controlador e do encarregado (LGPD art. 41) ainda não informados pela instituição.
// Preencher antes de publicar; enquanto estiverem vazios, a página mostra "a definir".
const CONTROLLER = {
  name: "Faculdade de Tecnologia e Inovação Senac DF",
  contact: "",
  dpo: "",
};

// Tudo o que o site guarda no navegador (localStorage). Nenhum cookie é usado.
const STORAGE = [
  { key: "ssa:game:v1", what: "Progresso nas trilhas, respostas, XP, sequência, meta diária e insígnias." },
  { key: "ssa:theme", what: "Tema escolhido (claro ou escuro)." },
  { key: "lastResults, lastPoints, finalFeedback", what: "Resultado da última trilha concluída, usado no relatório completo." },
];

function Pending() {
  return <span className="rounded-md bg-sun-100 px-1.5 font-extrabold text-night">a definir</span>;
}

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={id ? `${id}-t` : undefined} className="mb-8 scroll-mt-24">
      <h2 id={id ? `${id}-t` : undefined} className="mb-2 font-display text-xl font-semibold">
        {title}
      </h2>
      <div className="space-y-2 font-semibold leading-relaxed text-soft [&_b]:font-extrabold [&_b]:text-ink">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <Shell>
      <Link href="/sobre" className="mb-3 inline-flex items-center gap-1 text-sm font-extrabold text-pop hover:underline">
        <ArrowLeft className="size-4" /> Sobre
      </Link>
      <header className="mb-8">
        <p className="text-xs font-black uppercase tracking-[.12em] text-pop">Legal</p>
        <h1 className="mt-1 font-display text-3xl font-bold leading-tight">Política de privacidade</h1>
        <p className="mt-1 text-sm font-semibold text-soft">Última atualização: {UPDATED}</p>
      </header>

      <Section title="Resumo">
        <p>
          <b>Você não precisa criar conta.</b> As respostas e o progresso ficam salvos só no seu navegador. Este site não usa
          cookies nem ferramentas de rastreamento ou publicidade, e não vende nem repassa dados pessoais.
        </p>
      </Section>

      <Section title="Quem cuida dos dados">
        <p>
          Controlador: <b>{CONTROLLER.name}</b>. Contato: {CONTROLLER.contact ? <b>{CONTROLLER.contact}</b> : <Pending />}.
        </p>
        <p>
          Encarregado pelo tratamento de dados pessoais (LGPD, art. 41): {CONTROLLER.dpo ? <b>{CONTROLLER.dpo}</b> : <Pending />}.
        </p>
      </Section>

      <Section title="Quais dados e para quê">
        <p>
          <b>Respostas às trilhas.</b> Usadas para calcular seu perfil e o relatório. São processadas no seu próprio
          navegador e não são enviadas para nenhum servidor.
        </p>
        <p>
          <b>E-mail, se você pedir o relatório por e-mail.</b> Usado apenas para enviar aquele relatório, com base no seu
          pedido (LGPD, art. 7º, V). O envio é feito pelo serviço Resend, com servidores nos Estados Unidos (transferência
          internacional, art. 33). O endereço não é guardado em banco de dados nem usado para outras mensagens.
        </p>
      </Section>

      <Section id="armazenamento" title="Cookies e armazenamento no navegador">
        <p>
          O site <b>não usa cookies</b>. Para lembrar seu progresso, ele guarda algumas informações no armazenamento local
          do navegador (localStorage), que ficam só neste aparelho:
        </p>
        <ul className="space-y-2">
          {STORAGE.map((s) => (
            <li key={s.key} className="rounded-2xl border-2 border-rule p-3">
              <code className="font-mono text-sm font-bold text-ink">{s.key}</code>
              <p className="text-sm">{s.what}</p>
            </li>
          ))}
        </ul>
        <p>
          Esse armazenamento é necessário para o funcionamento do site, por isso não pedimos consentimento. Você pode apagar
          tudo a qualquer momento limpando os dados do site nas configurações do navegador.
        </p>
      </Section>

      <Section title="Por quanto tempo">
        <p>
          Os dados no navegador ficam até você apagá-los. O e-mail usado para enviar o relatório não é guardado por nós
          depois do envio.
        </p>
      </Section>

      <Section title="Seus direitos">
        <p>
          Pela LGPD (art. 18), você pode pedir confirmação de tratamento, acesso, correção, eliminação e informações sobre
          compartilhamento dos seus dados, além de revogar o consentimento. Para isso, fale com o encarregado pelo contato
          acima. Você também pode reclamar à Autoridade Nacional de Proteção de Dados (ANPD).
        </p>
      </Section>

      <Section title="Crianças e adolescentes">
        <p>O site é voltado a estudantes e profissionais. Não coletamos dados de identificação para usar as trilhas.</p>
      </Section>

      <Section title="Mudanças nesta política">
        <p>Se esta política mudar, a data de atualização no topo da página também muda.</p>
      </Section>

      <SiteFooter />
    </Shell>
  );
}
