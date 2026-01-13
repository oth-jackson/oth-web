import { getSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { Navigation } from "@/features/layout/components/navigation";
import TextEditor from "@/features/cms/components/TextEditor";
import { getPostById } from "@/features/cms/actions";
import type { PostItem } from "@/features/cms/data/posts";

type EditorPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditorPage({
  params: paramsPromise,
}: EditorPageProps) {
  const params = await paramsPromise; // Await the params promise

  // Check authentication
  const session = await getSession();

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  let initialPost: PostItem | Omit<PostItem, "id"> | null = null;
  const isNew = params.id === "new"; // Use awaited params

  if (isNew) {
    // Default structure for a new post
    initialPost = {
      title: "",
      slug: "",
      contentType: "blog", // Default to blog
      content: "",
      date: new Date().toISOString().split("T")[0], // Default to today
      status: "draft",
      publishDate: null,
      description: "",
      author: "", // Consider fetching current user name?
      tags: [],
      image: "",
      featured: false,
    };
  } else {
    // Fetch existing post for editing
    const postId = Number(params.id); // Use awaited params
    if (isNaN(postId)) {
      notFound(); // Invalid ID format
    }
    initialPost = await getPostById(postId);
    if (!initialPost) {
      notFound(); // Post not found
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <div className="w-full max-w-4xl mx-auto px-4 py-6 flex-grow">
        <TextEditor
          // Type assertion needed because initialPost can be null initially for fetch
          initialPost={initialPost as PostItem | Omit<PostItem, "id">}
          isNew={isNew}
        />
      </div>
    </div>
  );
}
