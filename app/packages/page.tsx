import type { Metadata } from "next";
import MainLayout from "@/components/layouts/main-layout";
import PricingPlans from "../../components/section/PricingPlans";
import { serverFetchPackageList } from "@/lib/serverActions";

// export const dynamic = "force-dynamic";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Pricing Plans & Packages | Zecco Real Estate",
  description:
    "Choose your Zecco plan to unlock the full power of our AI-driven property network and Spanish real estate marketing solutions.",
  alternates: {
    canonical: "/packages",
  },
};

export default async function PackagePlan() {
  const initialData = await serverFetchPackageList({
    search: "",
    limit: 12,
    page: 1,
    status: true,
  });

  return (
    <MainLayout chatBotWidget={false}>
      <div className="-mt-8">
        <PricingPlans
          heading="Choose your Zecco plan"
          description="Unlock the full power of our AI-driven distribution network and dominate the Spanish property market."
          initialData={initialData}
        />
      </div>
    </MainLayout>
  );
}
