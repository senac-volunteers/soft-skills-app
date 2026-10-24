import type { Metadata } from "next";
import AboutContent from "./content";

export const metadata: Metadata = {
  title: "Sobre | Soft Skills Academy",
};

export default function Page() {
  return <AboutContent />;
}
