"use client";

import { createAuthClient } from "better-auth/react";
import { cloudflareClient } from "better-auth-cloudflare/client";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
  plugins: [cloudflareClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;
