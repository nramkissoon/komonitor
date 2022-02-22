import { useRouter } from "next/router";
import { PageLayout } from "../../../src/common/components/Page-Layout";
import { ExtendedNextPage } from "../../_app";

const Page: ExtendedNextPage = () => {
  const router = useRouter();
  const { teamId } = router.query;
  console.log(teamId);
  return (
    <PageLayout isAppPage maxW={["sm", "xl", "3xl", "5xl", "6xl"]}>
      This is the {teamId} Team
    </PageLayout>
  );
};

Page.requiresAuth = true;
export default Page;
