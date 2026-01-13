import { getDB, tables, type Post, type NewPost, type Env } from "@/db"; // Updated type imports
import { eq, and, desc, type SQL } from "drizzle-orm";
import { posts } from "@/db/schema"; // Import postsTable directly

type GetPostsOptions = {
  status?: "published" | "all"; // "all" is default
  featured?: boolean; // Add featured filter option
};

// Fetch all entries by type (blogs or projects) with optimized filtering
export async function getAllPosts(
  env: Env,
  contentType: "blog" | "project",
  options?: GetPostsOptions
) {
  const db = getDB(env);
  const conditions: SQL[] = [eq(tables.posts.contentType, contentType)];

  // Add status filter
  if (options?.status === "published") {
    conditions.push(eq(tables.posts.status, "published"));
  }

  // Add featured filter at database level for better performance
  if (options?.featured !== undefined) {
    conditions.push(eq(tables.posts.featured, options.featured));
  }

  const query = db
    .select()
    .from(tables.posts)
    .where(and(...conditions));

  // Optimize ordering based on status
  if (options?.status === "published") {
    // Sort by publishDate (desc), then by date (desc) as a fallback for items published on the same day without a specific time
    query.orderBy(desc(tables.posts.publishDate), desc(tables.posts.date));
  } else {
    query.orderBy(desc(tables.posts.date));
  }

  return query.all();
}

// Fetch post by slug and type
export async function getPostBySlug(
  env: Env,
  slug: string,
  contentType: "blog" | "project",
  options?: GetPostsOptions
) {
  const db = getDB(env);
  const conditions: SQL[] = [
    eq(tables.posts.slug, slug),
    eq(tables.posts.contentType, contentType),
  ];

  if (options?.status === "published") {
    conditions.push(eq(tables.posts.status, "published"));
  }

  const result = await db
    .select()
    .from(tables.posts)
    .where(and(...conditions))
    .get();
  return result ?? null;
}

// Fetch all post slugs and their content types for generateStaticParams
export async function getAllPostSlugs(env: Env, options?: GetPostsOptions) {
  const db = getDB(env);
  const conditions: SQL[] = []; // Start with an empty array for conditions

  if (options?.status === "published") {
    conditions.push(eq(tables.posts.status, "published"));
  }

  try {
    const query = db
      .select({
        slug: tables.posts.slug,
        contentType: tables.posts.contentType,
      })
      .from(tables.posts);

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    const results = await query.all();

    return results
      .filter(
        (item) =>
        item.contentType === "blog" ||
        item.contentType === "project"
      )
      .map((item) => ({
        slug: item.slug,
        contentType: item.contentType as "blog" | "project",
      }));
  } catch (error) {
    console.warn("Failed to fetch post slugs. Returning empty list.", error);
    return [];
  }
}

// Define the shape of the object returned for frontend display
// This is derived from Post but includes parsed tags etc.
export type PostItem = ReturnType<typeof formatPostsForDisplay>[number];

// Format an array of Post objects for list display
export function formatPostsForDisplay(entries: Post[]) {
  return entries.map((item) => ({
    id: item.id, // Use numeric ID from DB
    title: item.title,
    slug: item.slug,
    description: item.description || "",
    date: item.date, // Keep original date field
    author: item.author,
    tags: item.tags
      ? item.tags.split(",").map((tag: string) => tag.trim())
      : [],
    image: item.image || null, // Default to null if no image
    featured: item.featured || false,
    contentType: item.contentType as "blog" | "project",
    status: (item.status as "draft" | "published" | null) || "draft", // Add status, default to draft
    publishDate: item.publishDate, // Add publishDate (as string or null)
    content: item.content, // Include content body
  }));
}

// Insert new post
export async function insertPost(
  env: Env,
  post: Omit<NewPost, "id" | "createdAt" | "updatedAt">
): Promise<{ insertedId: number } | null> {
  // Modified return type
  const db = getDB(env);
  try {
    const result = await db
      .insert(posts) // Use direct import postsTable
      .values({
        ...post,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning({ insertedId: posts.id }); // Use .returning()

    return result[0] ?? null; // Return the first element containing the ID, or null if fails
  } catch (error) {
    console.error("Error inserting post:", error);
    // Depending on how you want to handle errors, you might throw, or return null/specific error structure
    throw error; // Re-throw for the action to handle, or return null
  }
}

// Update existing post
export async function updatePostRow(
  env: Env,
  id: number,
  post: Partial<Omit<Post, "id" | "createdAt" | "updatedAt">> // Updated type
) {
  const db = getDB(env);
  return db
    .update(tables.posts) // Use tables.posts
    .set({
      ...post,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(tables.posts.id, id))
    .run();
}

// Delete post
export async function deletePostRow(env: Env, id: number) {
  const db = getDB(env);
  return db.delete(tables.posts).where(eq(tables.posts.id, id)).run(); // Use tables.posts
}
