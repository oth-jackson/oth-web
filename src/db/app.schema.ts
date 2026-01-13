import {
  sqliteTable,
  text,
  integer,
  uniqueIndex,
  index,
} from "drizzle-orm/sqlite-core";

// Schema for storing posts (e.g., blogs, projects)
export const posts = sqliteTable(
  "posts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    content: text("content").notNull(), // Stores the actual MD content
    contentType: text("content_type").notNull(), // 'blog' or 'project'
    author: text("author"),
    date: text("date").notNull(),
    tags: text("tags"), // Comma-separated tags
    image: text("image"),
    featured: integer("featured", { mode: "boolean" }).default(false),
    // CMS specific fields
    status: text("status"), // e.g., 'draft', 'published'
    publishDate: text("publish_date"), // Store as ISO string or similar
    createdAt: text("created_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
    updatedAt: text("updated_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  (table) => ({
    contentTypeSlugIndex: uniqueIndex("content_type_slug_idx").on(
      table.contentType,
      table.slug
    ),
    postsStatusIdx: index("posts_status_idx").on(table.status),
  })
);

// Schema for linking images to posts
export const images = sqliteTable(
  "images",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    postId: integer("post_id")
      .references(() => posts.id, { onDelete: "cascade" })
      .notNull(),
    objectKey: text("object_key").notNull(), // e.g., 30082045-18c8-4a48-bf44-542cc4e14d08.png
  },
  (table) => ({
    postImageObjectKeyIdx: uniqueIndex("post_image_object_key_idx").on(
      table.postId,
      table.objectKey
    ),
    postImagesObjectKeyIdx: index("post_images_object_key_idx").on(
      table.objectKey
    ),
  })
);
