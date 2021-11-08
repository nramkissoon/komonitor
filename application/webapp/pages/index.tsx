import type { NextPage } from "next";
import { PageLayout } from "../src/common/components/Page-Layout";
import { Banner } from "../src/modules/landing-page/Banner";
import { ComingSoon } from "../src/modules/landing-page/Coming-Soon";
import { CTA } from "../src/modules/landing-page/Cta";
import { Features } from "../src/modules/landing-page/Features";
import { NoCode } from "../src/modules/landing-page/Nocode";

const Home: NextPage = () => {
  return (
    <PageLayout
      isAppPage={false}
      seoProps={{
        description:
          "Komonitor is an online service for creating and managing monitors and alerts for your websites.",
      }}
    >
      <Banner />
      <NoCode />
      <Features />
      <ComingSoon />
      <CTA />
    </PageLayout>
  );
};

export default Home;
