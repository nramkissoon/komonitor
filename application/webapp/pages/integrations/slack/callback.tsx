import { Installation } from "@slack/oauth";
import { GetServerSideProps } from "next";
import { env as clientEnv } from "../../../src/common/client-utils";
import { ddbClient, env } from "../../../src/common/server-utils";
import { slackInstaller } from "../../../src/modules/integrations/slack/server";
import {
  addUserSlackInstallation,
  getUserSlackInstallations,
} from "../../../src/modules/user/user-db";

export default function Callback() {
  return <></>; // this page contains no content and is just meant as a redirect
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const request = context.req;
  const response = context.res;

  const props: any = { props: {} };
  let slackInstallation: Installation<"v1" | "v2", boolean> | undefined;
  let userId;
  let slackError;

  await slackInstaller.handleCallback(request, response, {
    success: (installation, metadata, request, response) => {
      userId = metadata.metadata;
      slackInstallation = installation;
    },
    failure: (error) => {
      slackError = error;
      props.redirect = {
        permanent: false,
        destination:
          clientEnv.BASE_URL +
          `app/settings?tab=2&slackIntegrationCanceled=true`,
      };
    },
  });

  if (slackError) {
    return props;
  }

  // get all the current slack installation and check if an installation already exists for wrkspc + channel
  if (userId && slackInstallation !== undefined) {
    const installations = await getUserSlackInstallations(
      ddbClient,
      env.USER_TABLE_NAME,
      userId
    );
    const alreadyInstalled =
      installations.find(
        (installation) =>
          installation.team?.id === slackInstallation?.team?.id &&
          installation.incomingWebhook?.channelId ===
            slackInstallation?.incomingWebhook?.channelId
      ) !== undefined;

    if (alreadyInstalled) {
      props.redirect = {
        permanent: false,
        destination:
          clientEnv.BASE_URL + `app/integrations?slackAlreadyInstalled=true`,
      };

      return props;
    }
  }

  // update the user then redirect back to settings page
  if (userId && slackInstallation) {
    const saved = await addUserSlackInstallation(
      ddbClient,
      env.USER_TABLE_NAME,
      userId,
      slackInstallation
    );
    if (saved) {
      props.redirect = {
        permanent: false,
        destination:
          env.BASE_URL + `app/integrations?slackIntegrationSuccess=true`,
      };
    }
  } else {
    props.redirect = {
      permanent: false,
      destination:
        clientEnv.BASE_URL + `app/integrations?slackIntegrationSuccess=false`,
    };
  }
  return props;
};
