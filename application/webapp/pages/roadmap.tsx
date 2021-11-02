import { NextPage } from "next";
import { PageLayout } from "../src/common/components/Page-Layout";
import { RoadmapPageContent } from "../src/modules/roadmap-page/components";

const Roadmap: NextPage = () => {
  return (
    <PageLayout isAppPage={false}>
      <RoadmapPageContent></RoadmapPageContent>
    </PageLayout>
  );
};

export default Roadmap;
