import { InstallProvider } from "@slack/oauth";
import { env } from "../../../common/server-utils";

export const slackInstaller = new InstallProvider({
  clientId: env.SLACK_CLIENT_ID,
  clientSecret: env.SLACK_CLIENT_SECRET,
  stateSecret: env.SLACK_STATE_SECRET,
  // Null out the installation store because we are using user DB instead
  installationStore: {
    fetchInstallation: async (query) => new Promise({} as any),
    deleteInstallation: async (query) => {},
    storeInstallation: async (installation) => {},
  },
});
