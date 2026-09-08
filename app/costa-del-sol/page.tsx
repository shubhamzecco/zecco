import type { Metadata } from "next";
import CostadelSol from "./costa-del-sol";

export const metadata: Metadata = {
  title: "Costa del Sol Areas & Properties | Zecco Real Estate",
  description:
    "Explore prime real estate locations, cities, and neighborhoods across Costa del Sol, Spain. Find luxury villas, apartments, and investment homes with Zecco.",
  alternates: {
    canonical: "/costa-del-sol",
  },
  openGraph: {
    title: "Costa del Sol Areas & Properties | Zecco Real Estate",
    description:
      "Explore prime real estate locations across Costa del Sol, Spain with Zecco.",
    url: "https://zw.appristine.co.in/costa-del-sol",
    type: "website",
  },
};

export default function CostaDelSolPage() {
  return <CostadelSol />;
}
