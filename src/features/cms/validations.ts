import { z } from "zod";

// Base schema reflecting the data coming from the editor form (PostItem-like)
export const postSchemaBase = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  slug: z
    .string()
    .min(1, { message: "Slug is required." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must be lowercase alphanumeric with hyphens.",
    }),
  contentType: z.enum(["blog", "project"], {
    errorMap: () => ({
      message: "Content type must be 'blog' or 'project'.",
    }),
  }),
  content: z.string().min(1, { message: "Content cannot be empty." }),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date must be YYYY-MM-DD." }),
  description: z.string().nullable().optional(), // Allow empty string, null, or undefined
  author: z.string().nullable().optional(),
  tags: z.array(z.string().min(1)).optional(), // Array of non-empty strings, optional array
  image: z
    .string()
    .regex(/^\/api\/media\/[a-zA-Z0-9._-]+$/, {
      message: "Image path must be in the format /api/media/filename.ext",
    })
    .nullable()
    .optional(), // Optional valid URL or null/empty
  featured: z.boolean().optional(),
  status: z.enum(["draft", "published"]).optional(),
  publishDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Publish date must be YYYY-MM-DD.",
    })
    .nullable()
    .optional(),
});

// Schema for creating posts (uses the base, but makes slug optional initially)
export const createPostInputSchema = postSchemaBase
  .omit({ slug: true }) // Remove the strict slug from base
  .extend({
    // Add slug back as optional, letting server handle generation if needed
    slug: z
      .string()
      // Allow empty string OR the valid slug pattern
      .regex(/^$|^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: "Slug must be lowercase alphanumeric with hyphens or empty.",
      })
      .optional(), // Make it optional (allows undefined)
  });

// Schema for updating posts (all fields from base are optional)
export const updatePostInputSchema = postSchemaBase.partial();

// We can infer the TypeScript types from the schemas if needed elsewhere
export type CreatePostInput = z.infer<typeof createPostInputSchema>;
export type UpdatePostInput = z.infer<typeof updatePostInputSchema>;
