import { Navigation } from "@/features/layout/components/navigation";
import { Footer } from "@/features/layout/components/footer";
import { PostCard } from "@/features/cms/components/PostCard";
import { getAllPosts } from "@/features/cms/data/posts";
import type { Post } from "@/db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { Env } from "@/db";
import { Button } from "@/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs";
import Link from "next/link";

interface PostsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const typeParam = params.type;
  const tagParam = params.tag as string | undefined;

  let envForDB: Env;
  try {
    const cfContext = getCloudflareContext();
    if (!cfContext.env.DB) {
      throw new Error("Database binding 'DB' not found in Cloudflare context.");
    }
    envForDB = cfContext.env as Env;
  } catch (error) {
    console.error("Failed to get Cloudflare context for PostsPage:", error);
    return (
      <main className="flex flex-col min-h-screen bg-background justify-between">
        <Navigation />
        <section className="flex-1 container mx-auto px-4 py-12">
          <p className="text-center text-red-500">
            Failed to load database context. Cannot display posts.
          </p>
        </section>
        <Footer />
      </main>
    );
  }

  const filterType =
    typeof typeParam === "string"
      ? (typeParam as "blog" | "project" | undefined)
      : undefined;

  let posts: Post[] = [];
  let allTags: string[] = [];
  let postsError: string | null = null;

  try {
    // Fetch posts based on content type
    if (filterType) {
      posts = await getAllPosts(envForDB, filterType, { status: "published" });
    } else {
      const blogs = await getAllPosts(envForDB, "blog", {
        status: "published",
      });
      const projects = await getAllPosts(envForDB, "project", {
        status: "published",
      });
      posts = [...blogs, ...projects].sort((a, b) => {
        const dateA = a.publishDate ? new Date(a.publishDate) : new Date(a.date);
        const dateB = b.publishDate ? new Date(b.publishDate) : new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
    }
  } catch (error) {
    console.warn("Failed to load posts. Rendering empty state.", error);
    posts = [];
    postsError = "Unable to load posts at this time.";
  }

  // Extract all unique tags from posts and count occurrences
  const tagCounts = new Map<string, number>();
  posts.forEach((post) => {
    if (post.tags) {
      post.tags
        .split(",")
        .map((tag) => tag.trim())
        .forEach((tag) => {
          if (tag) {
            const currentCount = tagCounts.get(tag) || 0;
            tagCounts.set(tag, currentCount + 1);
          }
        });
    }
  });

  // Filter to only include tags that appear more than once
  allTags = Array.from(tagCounts.entries())
    .filter(([, count]) => count > 1)
    .map(([tag]) => tag)
    .sort();

  // Filter posts by tag if a tag parameter is provided
  const filteredPosts = tagParam
    ? posts.filter(
        (post) =>
          post.tags &&
          post.tags
            .split(",")
            .map((t) => t.trim())
            .includes(tagParam)
      )
    : posts;

  return (
    <main className="flex flex-col min-h-screen bg-background justify-between relative">
      <Navigation />
      <section className="flex-1 container max-w-7xl mx-auto py-4 sm:py-6 md:py-8 lg:py-12 px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        {/* Content with relative positioning to appear above the grid */}
        <div className="relative z-10">
          {/* Tabs - shown above heading on md and smaller screens */}
          <div className="mb-6 lg:hidden">
            <Tabs defaultValue={filterType || "all"} className="w-full">
              <TabsList className="w-full gap-1 bg-secondary dark:bg-muted">
                <TabsTrigger
                  value="all"
                  asChild
                  className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4"
                >
                  <Link href="/posts">All 🗂️</Link>
                </TabsTrigger>
                <TabsTrigger
                  value="project"
                  asChild
                  className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4"
                >
                  <Link href="/posts?type=project">Projects 🛠️</Link>
                </TabsTrigger>
                <TabsTrigger
                  value="blog"
                  asChild
                  className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4"
                >
                  <Link href="/posts?type=blog">Blogs 📝</Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="mb-6">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              {filterType === "project"
                ? "Projects 🛠️"
                : filterType === "blog"
                ? "Blogs 📝"
                : "All Posts 🗂️"}
              {tagParam && ` tagged with "${tagParam}"`}
            </h1>
            <p className="text-lg text-muted-foreground max-w-4xl">
              {filterType === "blog"
                ? "Thoughts, ideas, and insights on technology, design, and innovation."
                : filterType === "project"
                ? "Explore our portfolio spanning spatial computing, AI/ML, engineering, and design."
                : "Browse all posts including blogs, projects, and more in one place."}
            </p>
          </div>

          {/* Filter bar - always visible */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-wrap">
            {/* Tag filter - only visible when tags are available */}
            {allTags.length > 0 && (
              <div className="flex flex-nowrap gap-3 max-w-full sm:max-w-[50%] md:max-w-[60%] lg:max-w-[70%] relative w-full sm:w-auto items-center order-2 sm:order-1">
                {/* No left shadow since it would overlap the first item */}

                <div className="overflow-x-auto no-scrollbar w-full flex flex-nowrap gap-3 items-center pb-2 pr-12">
                  <Button
                    variant={!tagParam ? "default" : "outline"}
                    size="sm"
                    className="rounded-md h-auto py-1.5 px-3.5 shrink-0"
                    asChild
                  >
                    <Link
                      href={filterType ? `/posts?type=${filterType}` : "/posts"}
                    >
                      All
                    </Link>
                  </Button>
                  {allTags.map((tag) => (
                    <Button
                      key={tag}
                      variant={tagParam === tag ? "default" : "outline"}
                      size="sm"
                      className="rounded-md h-auto py-1.5 px-3.5 shrink-0"
                      asChild
                    >
                      <Link
                        href={
                          filterType
                            ? `/posts?type=${filterType}&tag=${encodeURIComponent(
                                tag
                              )}`
                            : `/posts?tag=${encodeURIComponent(tag)}`
                        }
                      >
                        {tag}
                      </Link>
                    </Button>
                  ))}
                </div>

                {/* Right shadow fade effect - visible on all screen sizes */}
                <div className="absolute right-0 top-0 h-full w-12 shadow-[inset_-1rem_0_0.5rem_-0.5rem] shadow-background pointer-events-none z-10"></div>
              </div>
            )}

            {/* Tabs - shown on large screens only, positioned on the right */}
            <div className="hidden lg:block w-auto ml-auto order-1 sm:order-2">
              <Tabs defaultValue={filterType || "all"} className="w-auto">
                <TabsList className="w-auto gap-1 bg-secondary dark:bg-muted">
                  <TabsTrigger
                    value="all"
                    asChild
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4"
                  >
                    <Link href="/posts">All 🗂️</Link>
                  </TabsTrigger>
                  <TabsTrigger
                    value="project"
                    asChild
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4"
                  >
                    <Link href="/posts?type=project">Projects 🛠️</Link>
                  </TabsTrigger>
                  <TabsTrigger
                    value="blog"
                    asChild
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4"
                  >
                    <Link href="/posts?type=blog">Blogs 📝</Link>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((item) => (
                <PostCard key={item.slug} item={item} />
              ))
            ) : postsError ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <p>{postsError}</p>
              </div>
            ) : (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <p>No posts found. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
