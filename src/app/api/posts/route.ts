import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/features/cms/data/posts";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Env } from "@/db";

// Types for better type safety
interface PostsQueryParams {
  type: "blog" | "project";
  status: "published" | "all";
  featured?: boolean;
}

// Constants
const CACHE_DURATION = 300; // 5 minutes in seconds
const MAX_AGE = `max-age=${CACHE_DURATION}`;

// Input validation and sanitization
function validateAndParseParams(searchParams: URLSearchParams): {
  params: PostsQueryParams | null;
  error: string | null;
} {
  const type = searchParams.get("type");
  const status = searchParams.get("status");
  const featured = searchParams.get("featured");

  // Validate required type parameter
  if (!type) {
    return {
      params: null,
      error:
        "Missing required 'type' parameter. Must be 'blog' or 'project'.",
    };
  }

  if (type !== "blog" && type !== "project") {
    return {
      params: null,
      error:
        "Invalid 'type' parameter. Must be 'blog' or 'project'.",
    };
  }

  // Validate optional status parameter
  const validatedStatus = status === "published" ? "published" : "all";

  // Validate optional featured parameter
  let validatedFeatured: boolean | undefined;
  if (featured !== null) {
    if (featured === "true") {
      validatedFeatured = true;
    } else if (featured === "false") {
      validatedFeatured = false;
    } else if (featured !== "") {
      return {
        params: null,
        error:
          "Invalid 'featured' parameter. Must be 'true', 'false', or omitted.",
      };
    }
  }

  return {
    params: {
      type: type as "blog" | "project",
      status: validatedStatus,
      featured: validatedFeatured,
    },
    error: null,
  };
}

export async function GET(request: NextRequest) {
  const startTime = performance.now();

  try {
    // Parse and validate query parameters
    const { searchParams } = new URL(request.url);
    const { params, error } = validateAndParseParams(searchParams);

    if (error || !params) {
      return NextResponse.json(
        { error: error || "Invalid parameters" },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );
    }

    // Get Cloudflare context with error handling
    let cfContext;
    try {
      cfContext = await getCloudflareContext({ async: true });
    } catch (contextError) {
      console.error("Failed to get Cloudflare context:", contextError);
      return NextResponse.json(
        { error: "Internal server error: Unable to access database context" },
        {
          status: 500,
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );
    }

    if (!cfContext.env.DB) {
      console.error("Database binding 'DB' not found in Cloudflare context");
      return NextResponse.json(
        { error: "Internal server error: Database not available" },
        {
          status: 500,
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );
    }

    const envForDB = cfContext.env as Env;

    // Fetch posts with optimized query options
    const queryOptions = {
      status: params.status,
    };

    let posts;
    try {
      posts = await getAllPosts(envForDB, params.type, queryOptions);
    } catch (dbError) {
      console.error("Database query failed:", dbError);
      return NextResponse.json(
        { error: "Failed to fetch posts from database" },
        {
          status: 500,
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );
    }

    // Apply featured filter if not handled at database level
    let filteredPosts = posts;
    if (params.featured !== undefined) {
      filteredPosts = posts.filter(
        (post) => Boolean(post.featured) === params.featured
      );
    }

    // Validate response data
    if (!Array.isArray(filteredPosts)) {
      console.error("Invalid posts data structure returned from database");
      return NextResponse.json(
        { error: "Internal server error: Invalid data structure" },
        {
          status: 500,
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );
    }

    // Performance logging for monitoring
    const duration = performance.now() - startTime;
    if (duration > 1000) {
      // Log slow queries (>1s)
      console.warn(
        `Slow API response: /api/posts took ${duration.toFixed(2)}ms`,
        {
          type: params.type,
          status: params.status,
          featured: params.featured,
          resultCount: filteredPosts.length,
        }
      );
    }

    // Return successful response with appropriate caching headers
    return NextResponse.json(filteredPosts, {
      status: 200,
      headers: {
        "Cache-Control": MAX_AGE,
        "CDN-Cache-Control": MAX_AGE,
        "Vercel-CDN-Cache-Control": MAX_AGE,
        "Content-Type": "application/json",
        // Add ETag for better caching
        ETag: `"${Buffer.from(
          JSON.stringify({
            type: params.type,
            status: params.status,
            featured: params.featured,
            count: filteredPosts.length,
            lastModified:
              filteredPosts[0]?.updatedAt || new Date().toISOString(),
          })
        ).toString("base64")}"`,
      },
    });
  } catch (error) {
    // Log the full error for debugging
    console.error("Unexpected error in /api/posts:", error);

    // Return generic error to client
    return NextResponse.json(
      {
        error: "An unexpected error occurred while fetching posts",
        // Include error ID for tracking in production
        errorId: `posts-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-cache",
        },
      }
    );
  }
}
