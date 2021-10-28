import type { NextPage } from "next";
import { PageLayout } from "../src/common/components/Page-Layout";
import { Banner } from "../src/modules/landing-page/Banner";
import { Features } from "../src/modules/landing-page/Features";

const Home: NextPage = () => {
  return (
    <PageLayout isAppPage={false}>
      <Banner />
      <Features />
      {/* <Flex>
        <Box mr="3em">
          <Heading
            as="h2"
            className="content"
            mb="500px"
            id="cum"
            pt="16px"
            mt="-16px"
          >
            cum
          </Heading>
          <Heading
            as="h2"
            className="content"
            mb="500px"
            id="shit"
            pt="16px"
            mt="-16px"
          >
            shit
          </Heading>
          <Heading as="h3" className="content" id="piss" pt="16px" mt="-16px">
            piss
          </Heading>
        </Box>
        <TableOfContents />
      </Flex> */}
    </PageLayout>
  );
};

export default Home;
