import { ChakraProvider } from "@chakra-ui/react";
import {
  Provider as SessionProvider,
  signIn,
  useSession,
} from "next-auth/client";
import React from "react";
import { NextComponentType, NextPage, NextPageContext } from "next";

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
    <ChakraProvider>
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

  return <div>Loading... </div>;
};
