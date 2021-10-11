import { NextPage } from "next";
import React from "react";
import { PageLayout } from "../src/common/components/Page-Layout";
import { ComparisonTable } from "../src/modules/pricing-page/Comparison-Table";
import { ContactSection } from "../src/modules/pricing-page/Contact-Section";
import { PricingCards } from "../src/modules/pricing-page/Pricing-Cards";
import { PricingHeader } from "../src/modules/pricing-page/Pricing-Header";

const Pricing: NextPage = () => {
  return (
    <PageLayout isAppPage={false}>
      <PricingHeader />
      <PricingCards />
      <ComparisonTable />
      <ContactSection />
    </PageLayout>
  );
};

export default Pricing;
