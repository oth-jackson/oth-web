import { betterAuth } from "better-auth";
import { withCloudflare } from "better-auth-cloudflare";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

const fallbackSecret =
  "local-better-auth-secret-change-me-please-32-plus";

const auth = betterAuth({
  // CLI-only config for schema generation (no Cloudflare context here).
  ...withCloudflare(
    {
      autoDetectIpAddress: true,
      geolocationTracking: true,
      cf: {},
      r2: {
        bucket: {} as any,
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
      },
    },
    {
      emailAndPassword: {
        enabled: true,
        disableSignUp: true,
      },
      session: {
        cookieCache: {
          enabled: true,
          maxAge: 5 * 60, // 5 minutes
        },
      },
      secret: process.env.BETTER_AUTH_SECRET ?? fallbackSecret,
      baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
      trustedOrigins: [
        "https://otherwise.dev",
        "http://localhost:3000",
        "http://localhost:8787",
      ],
    }
  ),
  database: drizzleAdapter({} as any, { provider: "sqlite" }),
});

export { auth };
export default auth;
