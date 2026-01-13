"use client"; // Mark as a Client Component

import Image, { type ImageProps } from "next/image";
import { apiMediaLoader } from "@/lib/next/image-loader";

// Define props: take all standard ImageProps and make src mandatory
// We also omit 'loader' as it's handled internally.
interface ProxiedImageProps extends Omit<ImageProps, "loader"> {
  src: string; // src is now mandatory and explicitly string
  // alt is already optional in ImageProps, but good practice to handle if it could be undefined
}

export function ProxiedImage(props: ProxiedImageProps) {
  const { src, alt, ...rest } = props;

  // next/image requires alt to be a string, even if empty.
  // If alt might be undefined from props, ensure it defaults to an empty string.
  const effectiveAlt = alt || "";

  // If src is not provided (e.g. post.image is null/undefined),
  // we might not want to render the Image component at all.
  // The calling component should ideally handle the conditional rendering based on src availability.
  // For safety, if somehow called with an empty/null src, we can return null.
  if (!src) {
    return null;
  }

  // Check if this is an internal media API route
  const isInternalMedia = src.startsWith("/api/media/");

  return (
    <Image
      src={src}
      alt={effectiveAlt}
      loader={apiMediaLoader}
      unoptimized={isInternalMedia} // Disable optimization for internal media API routes
      {...rest} // Spread other ImageProps like fill, priority, className, sizes
    />
  );
}
