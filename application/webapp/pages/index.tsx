import type { NextPage } from "next";
import { PageLayout } from "../src/common/components/Page-Layout";

const Home: NextPage = () => {
  return <PageLayout isAppPage={false}></PageLayout>;
};

export default Home;
