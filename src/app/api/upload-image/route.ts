import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Basic validation for image types (can be expanded)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file type. Only images are allowed.",
        },
        { status: 400 }
      );
    }

    // Optional: Add file size validation here
    // const MAX_FILE_SIZE_MB = 5;
    // if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    //   return NextResponse.json({ success: false, error: `File too large. Max size is ${MAX_FILE_SIZE_MB}MB.` }, { status: 400 });
    // }

    const { env } = getCloudflareContext();
    const R2_BUCKET = env.MEDIA_BUCKET;

    if (!R2_BUCKET) {
      console.error("R2_BUCKET binding not found in Cloudflare environment.");
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error: R2 bucket not available.",
        },
        { status: 500 }
      );
    }

    const fileExtension = file.name.split(".").pop() || "jpeg"; // Default to jpeg if no extension
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;

    const arrayBuffer = await file.arrayBuffer();

    await R2_BUCKET.put(uniqueFilename, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
        // cacheControl: 'public, max-age=31536000, immutable' // Optional: if R2 objects were directly public
      },
      // customMetadata: {
      //   userId: session.user.id, // Optional: Track who uploaded
      //   originalFilename: file.name // Optional: Store original filename
      // },
    });

    // IMPORTANT: This URL points to our *media proxy* route, which we will create next.
    // It does NOT point directly to R2.
    const imageUrl = `/api/media/${uniqueFilename}`;

    return NextResponse.json({ success: true, imageUrl });
  } catch (error) {
    console.error("Image upload error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to upload image.";
    return NextResponse.json(
      { success: false, error: `Upload failed: ${message}` },
      { status: 500 }
    );
  }
}
