import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@/game/store";
import { ButtonWave } from "@/components/game/button-wave";

const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fredoka",
});

export const metadata: Metadata = {
  title: "Soft Skills Academy",
  description: "Trilhas gamificadas de autoavaliação de soft skills",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfeff" },
    { media: "(prefers-color-scheme: dark)", color: "#001325" },
  ],
};

// Aplica o tema antes da primeira pintura: escolha salva ou, sem ela, o tema do sistema.
const themeScript = `try{var t=localStorage.getItem("ssa:theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${nunito.variable} ${fredoka.variable} font-sans`}>
        <GameProvider>{children}</GameProvider>
        <ButtonWave />
      </body>
    </html>
  );
}
