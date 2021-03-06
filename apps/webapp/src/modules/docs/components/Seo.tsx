import { NextSeo, NextSeoProps } from "next-seo";
import React from "react";

export interface SEOProps extends Pick<NextSeoProps, "title" | "description"> {}

const SEO = ({ title, description }: SEOProps) => (
  <NextSeo
    title={title}
    description={description}
    openGraph={{ title, description }}
    titleTemplate={"Komonitor Docs | %s"}
  />
);

export default SEO;
