import { getSession } from "@/lib/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDB } from "@/db";
import { posts, images } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { Env } from "@/db";

async function authorizeAccess(
  env: Env,
  objectKey: string,
  session: unknown // Auth.js session (unknown shape)
): Promise<boolean> {
  if (
    session &&
    typeof session === "object" &&
    "user" in session &&
    (session as { user?: unknown }).user
  ) {
    // Authenticated user (admin in CMS) can access any R2 object via this proxy
    return true;
  }

  // For public (unauthenticated) users, check if the image is linked to a published post
  const db = getDB(env);
  try {
    // Check 1: Image is in postImagesTable (content images)
    const contentImageResults = await db
      .select({ p_id: posts.id })
      .from(posts)
      .innerJoin(images, eq(posts.id, images.postId))
      .where(
        and(
          eq(posts.status, "published"),
          eq(images.objectKey, objectKey)
        )
      )
      .limit(1);

    if (contentImageResults.length > 0) {
      return true;
    }

    // Check 2: Image is a featured image for a published post
    const featuredImageResults = await db
      .select({ id: posts.id })
      .from(posts)
      .where(
        and(
          eq(posts.status, "published"),
          eq(posts.image, `/api/media/${objectKey}`)
        )
      )
      .limit(1);

    return featuredImageResults.length > 0;
  } catch (dbError) {
    console.error(
      "Database error during media access check for public user:",
      dbError
    );
    return false; // Treat DB errors as non-accessible to be safe
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ objectKey: string[] }> }
) {
  const resolvedParams = await params;
  const objectKeySegments = resolvedParams.objectKey.map(decodeURIComponent);

  if (objectKeySegments.some((s) => s.includes("..") || s.includes("\\"))) {
    return new Response("Invalid object key", { status: 400 });
  }
  const objectKey = objectKeySegments.join("/");

  if (!objectKey) {
    return new Response("Missing object key", { status: 400 });
  }

  try {
    const cfContext = getCloudflareContext();
    const { env } = cfContext;
    const R2_BUCKET = env.MEDIA_BUCKET;

    if (!R2_BUCKET) {
      console.error("R2_BUCKET binding not found.");
      return new Response("Server configuration error", { status: 500 });
    }

    const session = await getSession();
    const isAdmin = !!session?.user;
    const isPublic = !isAdmin;

    // Check authorization
    const canAccess = await authorizeAccess(env, objectKey, session);

    if (!canAccess) {
      return new Response("Forbidden", { status: 403 });
    }

    if (request.headers.has("if-none-match")) {
      const r2ObjectHead = await R2_BUCKET.head(objectKey);
      if (
        r2ObjectHead &&
        request.headers.get("if-none-match") === r2ObjectHead.httpEtag
      ) {
        const headHeaders = new Headers();
        // For 304 responses, ETag and caching headers are sufficient.
        headHeaders.set("etag", r2ObjectHead.httpEtag);
        // Preserve original caching strategy for 304 responses
        if (isPublic) {
          headHeaders.set(
            "Cache-Control",
            "public, max-age=3600, stale-while-revalidate=604800"
          );
        } else {
          // Admin access
          headHeaders.set(
            "Cache-Control",
            "private, no-store, must-revalidate"
          );
        }
        return new Response(null, { status: 304, headers: headHeaders });
      }
    }

    // Now that access is confirmed, and it's not a 304, get the full object from R2
    const r2Object = await R2_BUCKET.get(objectKey);

    if (r2Object === null) {
      return new Response("Object Not Found", { status: 404 });
    }

    const headers = new Headers();
    // Avoid writeHttpMetadata to prevent serialization issues in dev adapters
    headers.set("etag", r2Object.httpEtag);
    headers.set(
      "Content-Type",
      r2Object.httpMetadata?.contentType ?? "application/octet-stream"
    );

    // Caching strategy
    if (isPublic) {
      // Use a moderate TTL for public assets so newly unpublished images expire reasonably quickly
      headers.set(
        "Cache-Control",
        "public, max-age=3600, stale-while-revalidate=604800"
      );
    } else {
      // Admin access
      headers.set("Cache-Control", "private, no-store, must-revalidate");
    }

    // HEAD method support
    if (request.method === "HEAD") {
      return new Response(null, { headers }); // same headers, no body
    }

    return new Response(r2Object.body, {
      headers,
      status: 200, // Explicitly set status 200 for successful GET
    });
  } catch (error) {
    console.error("Error in media route:", error);
    return new Response("Error fetching file", { status: 500 });
  }
}

// Handle HEAD requests explicitly by calling GET logic but stripping body
export async function HEAD(
  request: Request,
  context: { params: Promise<{ objectKey: string[] }> }
) {
  // Simply call the GET handler. The GET handler itself now checks request.method.
  // Or, more robustly, replicate GET logic but ensure no body is returned.
  // For simplicity here, we rely on GET's internal HEAD check,
  // but a more direct HEAD implementation would be ideal if GET becomes very complex.
  return GET(request, context);
}
