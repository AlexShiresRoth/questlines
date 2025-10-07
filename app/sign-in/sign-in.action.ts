"use server";

import { signIn } from "../auth";

export async function signInWithGithub() {
  return await signIn("github", { redirectTo: "/questline" });
}

export async function signInWithGoogle() {
  return await signIn("google", { redirectTo: "/questline" });
}

export async function signInWithFacebook() {
  return await signIn("facebook", { redirectTo: "/questline" });
}
