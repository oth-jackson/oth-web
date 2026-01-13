import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { Navigation } from "@/features/layout/components/navigation";
import { Button } from "@/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import PostsTable from "@/features/cms/components/PostsTable";

export default async function ContentPage() {
  // Check authentication
  const session = await getSession();

  // Redirect to login if not authenticated
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <div className="container max-w-7xl mx-auto py-4 sm:py-6 md:py-8 lg:py-12 px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="flex flex-row justify-between items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Posts 📌</h1>
          <div className="flex gap-4 items-center shrink-0">
            <Link href="/publish/post">
              <Button>
                Post
                <PlusCircle className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <PostsTable />
      </div>
    </div>
  );
}
