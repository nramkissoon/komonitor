import { GetStaticProps } from "next";
import { ExtendedNextPage } from "../_app";
import Page from "./../app/index";

const Index: ExtendedNextPage = ({ isDemo }) => <Page isDemo={isDemo} />;

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      isDemo: true,
    },
  };
};

export default Index;
