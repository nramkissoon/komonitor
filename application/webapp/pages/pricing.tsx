import { NextPage } from "next";
import React from "react";
import { PageLayout } from "../src/common/components/Page-Layout";
import { ComparisonTable } from "../src/modules/pricing-page/Comparison-Table";
import { ContactSection } from "../src/modules/pricing-page/Contact-Section";
import { PricingCards } from "../src/modules/pricing-page/Pricing-Cards";
import { PricingHeader } from "../src/modules/pricing-page/Pricing-Header";

const Pricing: NextPage = () => {
  return (
    <PageLayout
      isAppPage={false}
      seoProps={{
        title: "Pricing",
        description:
          "Komonitor is an online service for creating and managing monitors and alerts for your websites. Know when things go wrong and fix them before your customers even notice.",
      }}
    >
      <PricingHeader />
      <PricingCards />
      <ComparisonTable />
      <ContactSection />
    </PageLayout>
  );
};

export default Pricing;
