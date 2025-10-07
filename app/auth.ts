import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import client from "./mongo-client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
  pages: {
    signIn: "/sign-in",
  },
  trustHost: true,
  ...authConfig,
});
