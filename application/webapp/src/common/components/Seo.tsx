import { NextSeo, NextSeoProps } from "next-seo";

export interface SEOProps extends Pick<NextSeoProps, "title" | "description"> {}

const SEO = ({ title, description }: SEOProps) => (
  <NextSeo
    title={title}
    description={description}
    openGraph={{ title, description }}
    titleTemplate={"Komonitor | %s"}
  />
);

export default SEO;
