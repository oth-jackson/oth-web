import { drizzle } from "drizzle-orm/d1";
import { posts, images, schema } from "./schema";

// Define Environment interface that includes our D1 database binding
export interface Env {
  DB: D1Database;
  MEDIA_BUCKET: R2Bucket;
}

// Helper function to get database instance
export function getDB(env: Env) {
  return drizzle(env.DB, { schema });
}

// Export tables for convenience
export const tables = {
  posts: posts,
  images: images,
};

// Type for Posts (can be blogs or projects)
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
