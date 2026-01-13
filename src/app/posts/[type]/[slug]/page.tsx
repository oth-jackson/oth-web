import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Navigation } from "@/features/layout/components/navigation";
import { Footer } from "@/features/layout/components/footer";
import { getAllPostSlugs, getPostBySlug } from "@/features/cms/data/posts";
import { ProxiedImage } from "@/features/cms/components/ProxiedImage";
import type { Post, Env } from "@/db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Badge } from "@/ui/badge";

export async function generateStaticParams() {
  let envForStaticParams: Env;
  try {
    const cfContext = await getCloudflareContext({ async: true });
    if (!cfContext.env.DB) {
      throw new Error(
        "DB binding not found for generateStaticParams in posts/[type]/[slug]."
      );
    }
    envForStaticParams = cfContext.env as Env;
  } catch (error) {
    console.warn(
      `Failed to get Cloudflare context for generateStaticParams: ${error}. Skipping.`
    );
    return [];
  }

  try {
    const allEntries = await getAllPostSlugs(envForStaticParams, {
      status: "published",
    });
    return allEntries.map(({ slug, contentType }) => ({
      type: contentType,
      slug,
    }));
  } catch (error) {
    console.error(
      "Failed to generate static params for posts/[type]/[slug]:",
      error
    );
    return [];
  }
}

// Define props type separately, explicitly typing params as a Promise
type PostDetailPageProps = {
  params: Promise<{ type: string; slug: string }>;
};

export default async function PostDetailPage({
  params: paramsPromise,
}: PostDetailPageProps) {
  const params = await paramsPromise;
  const { type, slug } = params;

  if (type !== "blog" && type !== "project") {
    notFound();
  }

  let envForDB: Env;
  try {
    const cfContext = await getCloudflareContext({ async: true });
    if (!cfContext.env.DB) {
      throw new Error("Database binding 'DB' not found in Cloudflare context.");
    }
    envForDB = cfContext.env as Env;
  } catch (error) {
    console.error(
      "Failed to get Cloudflare context for PostDetailPage:",
      error
    );
    notFound();
  }

  const post: Post | null = await getPostBySlug(
    envForDB,
    slug,
    type as "blog" | "project",
    { status: "published" }
  );

  if (!post) {
    notFound();
  }

  // Determine the image source: use post's image or the fallback
  const imageSrc = post.image || "/post-fallback-image.jpg";

  const displayTags = post.tags
    ? post.tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter(Boolean)
    : [];

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navigation />
      <article className="flex-1 container max-w-4xl mx-auto py-4 sm:py-6 md:py-8 lg:py-12 px-4 sm:px-6 md:px-8 lg:px-12">
        <header className="mb-12">
          {/* Always render the image container, ProxiedImage will handle the src */}
          <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-8 border border-black dark:border-transparent">
            <ProxiedImage
              src={imageSrc} // Use the determined imageSrc
              alt={post.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            {displayTags.length > 0 &&
              displayTags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            <time dateTime={post.date} className="text-sm">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {post.author && <span className="text-sm">By {post.author}</span>}
          </div>
          {post.description && (
            <p className="text-xl mt-6 text-muted-foreground">
              {post.description}
            </p>
          )}
        </header>

        {post.content && (
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom renderer for code blocks for syntax highlighting
                code(props) {
                  const { children, className, node, ...rest } = props;
                  const match = /language-(\w+)/.exec(className || "");
                  const inline =
                    node?.tagName === "code" &&
                    !String(children).includes("\n");

                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={coldarkDark}
                      language={match[1]}
                      PreTag="div"
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...rest}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        )}
      </article>
      <Footer />
    </main>
  );
}
