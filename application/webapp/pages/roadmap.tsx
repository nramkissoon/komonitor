import { NextPage } from "next";
import { PageLayout } from "../src/common/components/Page-Layout";
import { RoadmapPageContent } from "../src/modules/roadmap-page/components";

const Roadmap: NextPage = () => {
  return (
    <PageLayout
      isAppPage={false}
      seoProps={{
        title: "Roadmap",
        description:
          "Komonitor roadmap highlighting new product features coming soon! Komonitor is an online service for creating and managing monitors and alerts for your websites. Know when things go wrong and fix them before your customers even notice.",
      }}
    >
      <RoadmapPageContent></RoadmapPageContent>
    </PageLayout>
  );
};

export default Roadmap;
