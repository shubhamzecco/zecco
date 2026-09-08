import type { Metadata } from "next";
import PolicyPage from "./components/privacy_policy";
import { fetchPrivacyPolicyData } from "@/lib/legalApi";

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: "Privacy Policy | Zecco Real Estate",
  description:
    "Read Zecco Real Estate's Privacy Policy to understand how we collect, use, and protect your personal data in accordance with GDPR and Spanish laws.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | Zecco Real Estate",
    description:
      "Read Zecco Real Estate's Privacy Policy to understand how we protect your personal data.",
    url: "https://zw.appristine.co.in/privacy-policy",
    type: "website",
  },
};

export default async function PrivacyPolicyPage() {
  const initialData = await fetchPrivacyPolicyData();
  return <PolicyPage initialData={initialData} />;
}
