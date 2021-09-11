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
  ],
  callbacks: {
    async session(session, user) {
      if (session.user) {
        session.uid = user.id; // allow us to get the user ID from the session object
      }
      return session;
    },
    async redirect(url: string, baseUrl: string) {
      return url.startsWith(baseUrl) ? url : baseUrl + url; // allow relative urls
    },
  },
  adapter: DynamoDBAdapter(new AWS.DynamoDB.DocumentClient(), {
    tableName: process.env.USER_TABLE_NAME || "",
  }),
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/signin",
    verifyRequest: "/auth/signin?info=VerificationSent",
  },
});
