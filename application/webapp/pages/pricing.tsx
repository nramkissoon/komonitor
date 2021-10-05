import { NextPage } from "next";
import React from "react";
import { Header } from "../src/common/components/Header";
import { PageContainer } from "../src/common/components/Page-Container";
import { PricingCards } from "../src/modules/pricing-page/Pricing-Cards";
import { PricingHeader } from "../src/modules/pricing-page/Pricing-Header";

const Pricing: NextPage = () => {
  return (
    <>
      {Header()}
      <PageContainer>
        <PricingHeader />
        <PricingCards />
      </PageContainer>
    </>
  );
};

export default Pricing;
