import type { Metadata } from "next";
import AboutZecco from "./about-zecco";

export const metadata: Metadata = {
  title: "About Zecco",
  description:
    "Learn how Zecco combines AI-driven property search with local expertise to help buyers and investors find the right home in Costa del Sol.",
  alternates: {
    canonical: "/about-zecco",
  },
};

export default function Page() {
  return <AboutZecco />;
}
