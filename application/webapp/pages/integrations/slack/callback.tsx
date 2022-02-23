import { Installation } from "@slack/oauth";
import { GetServerSideProps } from "next";
import { env as clientEnv } from "../../../src/common/client-utils";
import { ddbClient, env } from "../../../src/common/server-utils";
import { slackInstaller } from "../../../src/modules/integrations/slack/server";
import {
  addTeamSlackIntegration,
  getTeamSlackInstallations,
} from "../../../src/modules/teams/server/db";
import {
  addUserSlackInstallation,
  getUserSlackInstallations,
} from "../../../src/modules/user/user-db";

export default function Callback() {
  return <></>; // this page contains no content and is just meant as a redirect
}

const isOwnerIdTeam = (id: string) => {
  return id.split("#")[0] === "TEAM";
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const request = context.req;
  const response = context.res;

  const props: any = { props: {} };
  let slackInstallation: Installation<"v1" | "v2", boolean> | undefined;
  let ownerId;
  let slackError;

  await slackInstaller.handleCallback(request, response, {
    success: (installation, options, request, response) => {
      ownerId = options.metadata as string;
      slackInstallation = installation;
    },
    failure: (error, options) => {
      ownerId = options.metadata as string;
      slackError = error;
      props.redirect = {
        permanent: false,
        destination:
          clientEnv.BASE_URL +
          `${
            isOwnerIdTeam(ownerId) ? "teams/" + ownerId : "app"
          }/settings?tab=2&slackIntegrationCanceled=true`,
      };
    },
  });

  const isTeam = isOwnerIdTeam(ownerId ?? "");
  const id = (ownerId as unknown as string).split("#")[1];

  if (slackError) {
    return props;
  }

  // get all the current slack installation and check if an installation already exists for wrkspc + channel
  if (ownerId && slackInstallation !== undefined) {
    let installations = [];

    if (!isTeam) {
      installations = await getUserSlackInstallations(
        ddbClient,
        env.USER_TABLE_NAME,
        id
      );
    } else {
      installations = await getTeamSlackInstallations(id);
    }
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
          clientEnv.BASE_URL +
          `${
            isTeam ? "teams/" + id : "app"
          }/integrations?slackAlreadyInstalled=true`,
      };

      return props;
    }
  }

  // update the user then redirect back to settings page
  if (ownerId && slackInstallation) {
    let saved = false;
    if (!isTeam) {
      saved = await addUserSlackInstallation(
        ddbClient,
        env.USER_TABLE_NAME,
        id,
        slackInstallation
      );
    } else {
      saved = await addTeamSlackIntegration(id, slackInstallation);
    }

    if (saved) {
      props.redirect = {
        permanent: false,
        destination:
          env.BASE_URL +
          `${
            isTeam ? "teams/" + id : "app"
          }/integrations?slackIntegrationSuccess=true`,
      };
    }
  } else if (ownerId) {
    props.redirect = {
      permanent: false,
      destination:
        clientEnv.BASE_URL +
        `${
          isTeam ? "teams/" + id : "app"
        }/integrations?slackIntegrationSuccess=false`,
    };
  } else {
    // bruh shit broke no ownerId passed??????
  }
  return props;
};
