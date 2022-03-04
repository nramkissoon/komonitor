import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import nodemailer from "nodemailer";
import { createNewInvite, TeamPermissionLevel } from "utils";
import { env } from "../../../src/common/server-utils";
import {
  PLAN_PRODUCT_IDS,
  TEAM_MEMBER_LIMITS,
} from "../../../src/modules/billing/plans";
import {
  getTeamById,
  removeInvite,
  saveInvite,
  userIsMember,
} from "../../../src/modules/teams/server/db";
import { teamInvitationInputSchema } from "../../../src/modules/teams/server/validation";

const html = ({ code, teamId }: { code: string; teamId: string }) => {
  code = code.replace("#", "%23");
  return `
  <body style="padding: 20px; border-radius: 20px;">
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style=" max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif;">
        Hey there! You were sent a team invite from ${teamId}!
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif;">
        You need to be signed in to Komonitor in order to use the team invite link below. <a href="${
          env.BASE_URL
        }auth/signin" target="_blank">Sign in now.</a>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;"><a href="${
              env.BASE_URL + "teams/new-member?code=" + code
            }" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; font-weight: bold;">Join Team!</a></td>
          </tr>
          <tr>
            <td align="center" style="border-radius: 5px;">
            You can also copy and paste this invite link into a new browser tab. <a href="${
              env.BASE_URL + "teams/new-member?code=" + code
            }" target="_blank"  font-family: Helvetica, Arial, sans-serif; font-weight: bold;">
              ${env.BASE_URL + "teams/new-member?code=" + code}
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif;">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
  `;
};

async function createHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const userId = session.uid as string;

    const { teamId } = req.query;
    const { email, permission } = req.body;

    // check if admin, if not res.status(403)

    const team = await getTeamById(teamId as string);

    if (!team) {
      res.status(400);
      return;
    }

    if (!userIsMember(userId, team)) {
      res.status(403);
      return;
    }

    // validate email and check if email does not exist in team invite list already

    if (!teamInvitationInputSchema.safeParse({ email, permission }).success) {
      console.log("invalid inputs for invitation:", email, permission);
      res.status(400);
      return;
    }

    for (let invite of team.invites) {
      if (invite.email === email) {
        console.log("invite for email already exists on team:", teamId);
        res.status(400);
        return;
      }
    }

    // check team member list len is under capacity
    const memberTotal = team.members.length;
    if (
      team.product_id === PLAN_PRODUCT_IDS.PRO &&
      memberTotal === TEAM_MEMBER_LIMITS.PRO
    ) {
      console.log("team member limit reached:", teamId);
      res.status(403);
      return;
    }
    if (
      team.product_id === PLAN_PRODUCT_IDS.BUSINESS &&
      memberTotal === TEAM_MEMBER_LIMITS.BUSINESS
    ) {
      console.log("team member limit reached:", teamId);
      res.status(403);
      return;
    }

    // create new invite

    const invite = createNewInvite(
      email,
      teamId as string,
      permission as TeamPermissionLevel
    );

    // send invite, if error -> throw
    const transport = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number.parseInt(process.env.EMAIL_SERVER_PORT || ""),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    await transport.sendMail({
      to: email,
      from: process.env.EMAIL_FROM,
      subject: `You have been invited to join Komonitor`,
      text: "Komonitor team invitation",
      html: html({
        code: invite.team_id_invite_code_composite_key,
        teamId: teamId as string,
      }),
    });

    // save invite to team

    const saved = await saveInvite(team, invite);

    res.status(200);
    return;
  } catch (err) {
    res.status(500);
    return;
  }
}

async function deleteHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  try {
    const userId = session.uid as string;

    const { teamId } = req.query;
    const { email } = req.body;

    // check if admin, if not res.status(403)

    const team = await getTeamById(teamId as string);

    if (!team) {
      res.status(400);
      return;
    }

    if (!userIsMember(userId, team)) {
      res.status(403);
      return;
    }

    // validate email and check if email exists in team invite list already

    const removed = removeInvite(team, email);

    if (!removed) throw new Error("invite removal failure");

    res.status(200);
    return;
  } catch (err) {
    res.status(500);
    return;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (session) {
    switch (req.method) {
      case "POST":
        await createHandler(req, res, session);
        break;
      case "DELETE":
        await deleteHandler(req, res, session);
        break;
      default:
        res.status(405);
        break;
    }
  } else {
    res.status(401);
  }
  res.end();
}
