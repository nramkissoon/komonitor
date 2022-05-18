import { Box, chakra, Flex, Link, useColorModeValue } from "@chakra-ui/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import { TeamInvite } from "utils";
import { env as clientEnv } from "../../src/common/client-utils";
import { PageLayout } from "../../src/common/components/Page-Layout";
import { ddbClient, env } from "../../src/common/server-utils";
import {
  addTeamMember,
  getTeamById,
  removeInvite,
} from "../../src/modules/teams/server/db";
import { getUserById } from "../../src/modules/user/user-db";

export default function NewMemberPage({
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const errorCode = error as InviteErrors;
  const ErrorContent = (error: InviteErrors) => {
    switch (error) {
      case "errorAddingUserToTeam":
        return "A server error occurred. Please try again later or contact us.";
      case "inviteExpired":
        return "Your invite has expired, please contact your teammate to send a new invite.";
      case "inviteNotFoundOnTeam":
        return "We did not find a team invite for you in our system. The invite link may have expired or been deleted.";
      case "userNotSignedIn":
        return "You must sign in before clicking the invite link to be added to your team.";
    }
  };
  return (
    <PageLayout isAppPage={false}>
      <Flex
        justifyContent="center"
        flexDir="column"
        textAlign="center"
        alignItems={"center"}
        maxW="4xl"
        m="auto"
      >
        <Box fontWeight="extrabold" fontSize="6xl">
          Oops!
        </Box>
        <Box fontSize="2xl" fontWeight="medium">
          We were unable to add you to the team. {ErrorContent(errorCode)}
        </Box>
        <Box fontSize="2xl" fontWeight="medium" mt="20px">
          If you think this is a mistake, please{" "}
          <Link href="mailto:support@komonitor.com">
            <chakra.span
              color={useColorModeValue("blue.500", "blue.400")}
              _hover={{ color: "gray.500", cursor: "pointer" }}
            >
              contact us
            </chakra.span>
          </Link>
          .
        </Box>
      </Flex>
    </PageLayout>
  );
}

type InviteErrors =
  | "userNotSignedIn"
  | "inviteExpired"
  | "inviteNotFoundOnTeam"
  | "errorAddingUserToTeam";

const getTeamTokenFromCode = (code: string) => {
  const components = code.split("#");
  return {
    teamId: components[0],
    token: components[1],
  };
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const request = context.req;
  const response = context.res;
  const query = context.query;

  // handle no code in request -> redirect to home
  const { code } = query;

  if (!code) {
    return {
      redirect: {
        permanent: false,
        destination: clientEnv.BASE_URL,
      },
    };
  }

  // handle user not signed in
  const session = await getSession(context);
  if (!session || !session.uid) {
    return {
      props: {
        error: "userNotSignedIn" as InviteErrors,
      },
    };
  }

  const userId = session.uid as string;

  const user = await getUserById(ddbClient, env.USER_TABLE_NAME, userId);
  if (!user) {
    return {
      props: {
        error: "userNotSignedIn" as InviteErrors,
      },
    };
  }

  try {
    // handle team exists
    const teamIdAndToken = getTeamTokenFromCode(code as string);
    const teamId = teamIdAndToken.teamId;

    const team = await getTeamById(teamId);
    if (!team) {
      throw new Error("Team does not exist");
    }

    // handle invite not for signed in user
    let inviteFoundForUser = false;
    let inviteForUser: TeamInvite | undefined;
    for (let invite of team.invites) {
      if (
        invite.email === user.email &&
        invite.team_id_invite_code_composite_key === code
      ) {
        inviteFoundForUser = true;
        inviteForUser = invite;
      }
    }

    if (!inviteFoundForUser || !inviteForUser) {
      return {
        props: {
          error: "inviteNotFoundOnTeam" as InviteErrors,
        },
      };
    }

    // handle invite expired

    const now = new Date().getTime();

    if (now > inviteForUser.expiration) {
      return {
        props: {
          error: "inviteExpired" as InviteErrors,
        },
      };
    }

    // handle valid invite -> add user to team -> redirect to team
    const memberAdded = await addTeamMember(
      user,
      inviteForUser.email,
      team,
      inviteForUser.permission_level
    );

    if (memberAdded) {
      await removeInvite(team, inviteForUser.email);

      return {
        redirect: {
          permanent: false,
          destination: clientEnv.BASE_URL + "teams/" + teamId,
        },
      };
    } else {
      throw new Error("wat");
    }
  } catch (err) {
    return {
      redirect: {
        permanent: false,
        destination: clientEnv.BASE_URL,
      },
    };
  }
};
