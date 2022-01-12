import AWS from "aws-sdk";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { DynamoDBAdapter } from "../../../src/modules/auth/dynamodb-adapter";
import { sendVerificationRequest } from "../../../src/modules/auth/send-verification-request";

AWS.config.update({ region: "us-east-1" });

export default NextAuth({
  providers: [
    Providers.Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number.parseInt(process.env.EMAIL_SERVER_PORT || ""),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: sendVerificationRequest,
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: "read:user",
    }),
  ],
  callbacks: {
    async session(session, user) {
      if (session.user) {
        session.uid = String(user.id); // allow us to get the user ID from the session object
      }
      return session;
    },
    async redirect(url: string, baseUrl: string) {
      return url.startsWith(baseUrl) ? url : baseUrl + url; // allow relative urls
    },
  },
  adapter: DynamoDBAdapter(
    new AWS.DynamoDB.DocumentClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID_KOMONITOR as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_KOMONITOR as string,
      },
    }),
    {
      tableName: process.env.USER_TABLE_NAME || "",
    }
  ),
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/signin",
    verifyRequest: "/auth/signin?info=VerificationSent",
    newUser: "/app/new-user",
  },
});
