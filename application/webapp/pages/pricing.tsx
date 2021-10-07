import { NextPage } from "next";
import React from "react";
import { Header } from "../src/common/components/Header";
import { PageContainer } from "../src/common/components/Page-Container";
import { ComparisonTable } from "../src/modules/pricing-page/Comparison-Table";
import { ContactSection } from "../src/modules/pricing-page/Contact-Section";
import { PricingCards } from "../src/modules/pricing-page/Pricing-Cards";
import { PricingHeader } from "../src/modules/pricing-page/Pricing-Header";

const Pricing: NextPage = () => {
  return (
    <>
      {Header()}
      <PageContainer>
        <PricingHeader />
        <PricingCards />
        <ComparisonTable />
        <ContactSection />
      </PageContainer>
    </>
  );
};

export default Pricing;
