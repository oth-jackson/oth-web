import type { MetadataRoute } from "next";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getAllPostSlugs } from "@/features/cms/data/posts";
import type { Env } from "@/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://otherwise.dev";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Fetch dynamic posts
  try {
    const cfContext = getCloudflareContext();
    if (!cfContext.env.DB) {
      console.warn("Database binding not found for sitemap generation");
      return staticPages;
    }

    const env = cfContext.env as Env;
    const posts = await getAllPostSlugs(env, { status: "published" });

    const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/posts/${post.contentType}/${post.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

    return [...staticPages, ...postPages];
  } catch (error) {
    console.warn("Failed to fetch posts for sitemap:", error);
    return staticPages;
  }
}
