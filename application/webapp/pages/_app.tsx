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
import { TeamCheckoutNotCompleteModal } from "../src/common/components/Team-Checkout-Not-Complete-Modal";
import theme from "../src/common/components/theme";
import { useTeam } from "../src/modules/teams/client";

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
            <TeamSubscriptionChecker>
              <Component {...pageProps} />
            </TeamSubscriptionChecker>
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
  const { teamId } = router.query;

  const { team, teamFetchError, teamIsLoading } = useTeam(teamId as string);

  React.useEffect(() => {
    if (status === "loading") return;
    if (!isUser) signIn();
  }, [isUser, status]);

  // auth for teams
  if (teamId && !teamIsLoading && !teamFetchError && team) {
    return <React.Fragment>{children}</React.Fragment>;
  } else if (teamId && !team && !teamIsLoading) {
    // not authed for team
    return <div>You do not have access to this team.</div>;
  } else if (teamIsLoading) {
    return <div></div>;
  } else if (isUser || router.pathname.startsWith("/demo")) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return <div>Loading...</div>;
};

/*
  Wrapper component for checking if a team has a valid subscription status.
  This is a client side check, API's should check sub status on backend.
  Shows a modal to prompt user to complete checkout or change payment method if invalid sub status.
*/
const TeamSubscriptionChecker = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { teamId } = router.query;

  const { team, teamFetchError, teamIsLoading } = useTeam(teamId as string);
  if ((!team && !teamIsLoading) || (team && team.subscription_status))
    return <React.Fragment>{children}</React.Fragment>;
  if (team && !team.subscription_status)
    return (
      <div>
        {children}
        <TeamCheckoutNotCompleteModal team={team} />
      </div>
    );
  return <React.Fragment>{children}</React.Fragment>;
};
