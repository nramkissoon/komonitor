import { DynamoDB, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { DynamoDBAdapter } from "../../../src/modules/auth/dynamodb-adapter";
import { sendVerificationRequest } from "../../../src/modules/auth/send-verification-request";

const config: DynamoDBClientConfig = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_KOMONITOR as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_KOMONITOR as string,
  },
  region: "us-east-1",
};

const client = DynamoDBDocument.from(new DynamoDB(config), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});

export default NextAuth({
  providers: [
    EmailProvider({
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
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: "read:user",
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        session.uid = String(user.id); // allow us to get the user ID from the session object
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl + url; // allow relative urls
    },
  },
  adapter: DynamoDBAdapter(client, {
    tableName: process.env.USER_TABLE_NAME || "",
  }),
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/signin",
    verifyRequest: "/auth/signin?info=VerificationSent",
    newUser: "/app",
  },
});
