import Link from "next/link";

const LEGAL = [
  { href: "/privacidade", label: "Privacidade" },
  { href: "/privacidade#armazenamento", label: "Cookies e armazenamento" },
];

/** Rodapé do site: instituição e links legais obrigatórios (LGPD). */
export function SiteFooter({ children }: { children?: React.ReactNode }) {
  return (
    <footer className="mt-12 flex flex-wrap items-start justify-between gap-6 border-t-2 border-rule pt-6 text-sm">
      <div className="space-y-3">
        <p className="font-semibold text-soft">Faculdade de Tecnologia e Inovação Senac DF</p>
        {children}
      </div>
      <nav aria-labelledby="footer-legal">
        <p id="footer-legal" className="mb-2 text-xs font-black uppercase tracking-wider text-ink">
          Legal
        </p>
        <ul className="space-y-1.5">
          {LEGAL.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="font-semibold text-soft transition-colors hover:text-pop">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </footer>
  );
}
