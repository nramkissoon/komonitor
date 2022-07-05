import { Box } from "@chakra-ui/react";
import { NextPage } from "next";
import { useSession } from "next-auth/react";
import React from "react";
import { PageLayout } from "../src/common/components/Page-Layout";
import { ComparisonTable } from "../src/modules/pricing-page/Comparison-Table";
import { ContactSection } from "../src/modules/pricing-page/Contact-Section";
import { PricingCards } from "../src/modules/pricing-page/Pricing-Cards";
import { PricingHeader } from "../src/modules/pricing-page/Pricing-Header";
import { useUserServicePlanProductId } from "../src/modules/user/client";

const Pricing: NextPage = () => {
  const { data: session, status } = useSession();
  const {
    data,
    isLoading: userServicePlanIsLoading,
    isError,
  } = useUserServicePlanProductId();

  const [showAnnualPricing, setShowAnnualPricing] = React.useState(false);

  const user = session && session?.user;
  const productId = data ? data.productId : undefined;
  return (
    <PageLayout
      isAppPage={false}
      seoProps={{
        title: "Pricing and Plan Information",
        description:
          "Online service for creating and managing monitors and alerts for your websites. Know when things go wrong and fix them before your customers even notice.",
      }}
    >
      <Box maxW="7xl" m="auto">
        <PricingHeader />
        <PricingCards
          user={user}
          productId={productId}
          showAnnualPricing={showAnnualPricing}
          setShowAnnualPricing={setShowAnnualPricing}
        />
        <ComparisonTable
          user={user}
          productId={productId}
          showAnnualPricing={showAnnualPricing}
        />
        <ContactSection />
      </Box>
    </PageLayout>
  );
};

export default Pricing;
