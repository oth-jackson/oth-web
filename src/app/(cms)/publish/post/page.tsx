import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navigation } from "@/features/layout/components/navigation";
import TextEditor from "@/features/cms/components/TextEditor";

export default async function NewContentPage() {
  // Check authentication
  const session = await getSession();

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <div className="w-full max-w-4xl mx-auto px-4 py-6 flex-grow">
        <TextEditor
          initialPost={{
            title: "",
            slug: "",
            contentType: "blog",
            content: "Start writing your Markdown content here...",
            date: new Date().toISOString().split("T")[0],
            status: "draft",
            publishDate: null,
            description: "",
            author: "",
            tags: [],
            image: "",
            featured: false,
          }}
          isNew={true}
        />
      </div>
    </div>
  );
}
