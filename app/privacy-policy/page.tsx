import type { Metadata } from "next";
import PolicyPage from "./components/privacy_policy";

export const metadata: Metadata = {
  title: "Privacy Policy | Zecco Real Estate",
  description:
    "Read Zecco Real Estate's Privacy Policy to understand how we collect, use, and protect your personal data.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return <PolicyPage />;
}
