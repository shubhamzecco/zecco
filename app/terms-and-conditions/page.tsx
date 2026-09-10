import type { Metadata } from "next";
import TermsConditionPage from "./components/terms";
import { fetchTermsConditionsData } from "@/lib/legalApi";

// // export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: "Terms & Conditions | Zecco Real Estate",
  description:
    "Review the terms and conditions for using Zecco Real Estate's platform, property listings, and advisory services.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
  openGraph: {
    title: "Terms & Conditions | Zecco Real Estate",
    description:
      "Review the terms and conditions for using Zecco Real Estate's platform and advisory services.",
    url: "https://zw.appristine.co.in/terms-and-conditions",
    type: "website",
  },
};

export default async function TermsConditionsPage() {
  const initialData = await fetchTermsConditionsData();
  return <TermsConditionPage initialData={initialData} />;
}
