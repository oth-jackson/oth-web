import { betterAuth } from "better-auth";
import { withCloudflare } from "better-auth-cloudflare";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { cookies, headers } from "next/headers";
import { getDB, type Env } from "@/db";

async function authBuilder() {
  const { env } = await getCloudflareContext({ async: true });
  const { cf } = getCloudflareContext();
  const db = getDB(env as Env);

  return betterAuth({
    ...withCloudflare(
      {
        autoDetectIpAddress: true,
        geolocationTracking: true,
        cf: cf || {},
        d1: {
          db,
          options: {
            debugLogs: false,
          },
        },
        r2: {
          bucket: (env as Env).MEDIA_BUCKET,
          maxFileSize: 5 * 1024 * 1024, // 5MB
          allowedTypes: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
        },
      },
      {
        emailAndPassword: {
          enabled: true,
          disableSignUp: true,
          autoSignIn: true,
        },
        advanced: {
          useSecureCookies: true,
          cookies: {
            session_token: {
              attributes: {
                path: "/",
                sameSite: "lax",
                secure: true,
              },
            },
            session_data: {
              attributes: {
                path: "/",
                sameSite: "lax",
                secure: true,
              },
            },
          },
        },
        session: {
          cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // 5 minutes
          },
        },
        secret: env.BETTER_AUTH_SECRET,
        baseURL: env.BETTER_AUTH_URL,
        trustedOrigins: [
          "https://otherwise.dev",
          "http://localhost:3000",
          "http://localhost:8787",
        ],
      }
    ),
  });
}

let authInstance: Awaited<ReturnType<typeof authBuilder>> | null = null;

export async function getAuth() {
  if (!authInstance) {
    authInstance = await authBuilder();
  }
  return authInstance;
}

export async function getSession() {
  const auth = await getAuth();
  const headersList = await headers();
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");

  const requestHeaders = new Headers(headersList);
  if (cookieHeader) {
    requestHeaders.set("cookie", cookieHeader);
  }

  return auth.api.getSession({ headers: requestHeaders });
}
