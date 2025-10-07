import type { NextAuthConfig } from "next-auth";
import Facebook from "next-auth/providers/facebook";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export default {
  providers: [GitHub, Google, Facebook],
} satisfies NextAuthConfig;
