import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/roboto/100.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/900.css";
import { NextComponentType, NextPage, NextPageContext } from "next";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { DefaultSeo } from "next-seo";
import { useRouter } from "next/router";
import React from "react";
import { TeamProvider } from "../src/common/components/TeamProvider";
import theme from "../src/common/components/theme";

export interface ExtendedPageContext extends NextPageContext {}

type Extensions = {
  requiresAuth?: boolean;
};

type ExtendedAppProps = {
  pageProps: any;
  Component: NextComponentType<ExtendedPageContext, any, {}> & Extensions;
};

export type ExtendedNextPage = NextPage<{ isDemo?: boolean }, {}> & Extensions;

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: ExtendedAppProps) {
  return (
    <ChakraProvider theme={theme}>
      <DefaultSeo
        title={undefined}
        titleTemplate={"Komonitor | %s"}
        defaultTitle="Komonitor"
        openGraph={{
          type: "website",
          locale: "en_IE",
          url: "https://komonitor.com/",
          site_name: "Komonitor",
          images: [
            {
              url: "https://komonitor.com/og-image-1.png",
              width: 800,
              height: 600,
              alt: "Open Graph Komonitor Logo",
              type: "image/png",
            },
            {
              url: "https://komonitor.com/og-image-2.png",
              width: 900,
              height: 800,
              alt: "Open Graph Komonitor Logo",
              type: "image/png",
            },
          ],
        }}
      />
      <SessionProvider session={session}>
        {Component.requiresAuth ? (
          <Auth>
            <TeamProvider>
              <Component {...pageProps} />
            </TeamProvider>
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </SessionProvider>
    </ChakraProvider>
  );
}

const Auth = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const isUser = session && session?.user; // get user if it exists on the session object

  const router = useRouter();

  React.useEffect(() => {
    if (status === "loading") return;
    if (!isUser) signIn();
  }, [isUser, status]);

  if (isUser || router.pathname.startsWith("/demo")) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return <div></div>;
};
