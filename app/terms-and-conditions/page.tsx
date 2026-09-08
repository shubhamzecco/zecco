import type { Metadata } from "next";
import TermsConditionPage from "./components/terms";

export const metadata: Metadata = {
  title: "Terms & Conditions | Zecco Real Estate",
  description:
    "Review the terms and conditions for using Zecco Real Estate's platform, property listings, and advisory services.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
};

export default function TermsConditionsPage() {
  return <TermsConditionPage />;
}
