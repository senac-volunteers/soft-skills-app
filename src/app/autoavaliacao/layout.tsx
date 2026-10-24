"use client";
import { usePathname } from "next/navigation";

// As telas antigas do questionário ainda não têm versão escura: ficam no tema claro.
// O relatório já usa a identidade nova e segue o tema escolhido.
export default function LightOnlyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.endsWith("/resultados")) return <>{children}</>;
  return (
    <div data-theme="light" className="min-h-dvh bg-neutral-50 text-foreground">
      {children}
    </div>
  );
}
