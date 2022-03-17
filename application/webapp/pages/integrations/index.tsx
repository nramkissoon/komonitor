import { useRouter } from "next/router";
import { PageLayout } from "../../src/common/components/Page-Layout";

export default function Integrations() {
  const { tab } = useRouter().query;
  return <PageLayout isAppPage={false}>asdasd</PageLayout>;
}
