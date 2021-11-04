import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/roboto/100.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/900.css";
import { NextComponentType, NextPage, NextPageContext } from "next";
import {
  Provider as SessionProvider,
  signIn,
  useSession,
} from "next-auth/client";
import { DefaultSeo } from "next-seo";
import React from "react";
import theme from "../src/common/components/theme";

type Extensions = {
  requiresAuth?: boolean;
};

type ExtendedAppProps = {
  pageProps: any;
  Component: NextComponentType<NextPageContext, any, {}> & Extensions;
};

export type ExtendedNextPage = NextPage & Extensions;

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
        }}
        twitter={{
          handle: "@komonitor",
          site: "@komonitor",
          cardType: "summary_large_image",
        }}
      />
      <SessionProvider session={session}>
        {Component.requiresAuth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </SessionProvider>
    </ChakraProvider>
  );
}

const Auth = ({ children }: { children: React.ReactNode }) => {
  const [session, loading] = useSession();
  const isUser = session && session?.user; // get user if it exists on the session object

  React.useEffect(() => {
    if (loading) return;
    if (!isUser) signIn();
  }, [isUser, loading]);

  if (isUser) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return <div></div>;
};
