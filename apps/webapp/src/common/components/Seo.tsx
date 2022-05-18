import { NextSeo, NextSeoProps } from "next-seo";

export interface SEOProps
  extends Pick<NextSeoProps, "title" | "description" | "canonical"> {}

const SEO = ({ title, description, canonical }: SEOProps) => (
  <NextSeo
    title={title}
    description={description}
    openGraph={{ title, description }}
    titleTemplate={"%s"}
    canonical={canonical}
  />
);

export default SEO;
