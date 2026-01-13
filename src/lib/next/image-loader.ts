// src/lib/image-loader.ts

// Custom loader for next/image that just returns the src
// This is used for images served via our internal /api/media/ proxy route.
export const apiMediaLoader = ({ src }: { src: string }) => {
  if (src.startsWith("/api/media/")) {
    return src; // Already a correct relative path for our proxy
  }

  // Check if it's an absolute URL pointing to our own media proxy
  if (src.startsWith("http")) {
    try {
      const url = new URL(src);
      // If it's an absolute URL pointing to our own API, return the pathname part.
      // This check is naive and assumes the app is served from the root.
      // A more robust check might involve an environment variable for NEXT_PUBLIC_APP_URL.
      if (url.pathname.startsWith("/api/media/")) {
        // Check if the host matches the current request's host if running server-side,
        // or if we have a known public app URL.
        // For simplicity here, if it looks like our path, we use the pathname.
        // This avoids `window` and makes it server-compatible.
        return url.pathname + url.search + url.hash;
      }
    } catch (_e) {
      // Invalid URL or other parsing error, do nothing, proceed to return original src.
      console.warn("Error parsing src in apiMediaLoader:", src, _e);
    }
  }

  // Fallback: if it doesn't match known patterns, return src as is.
  // This might happen if an external URL is accidentally passed, or for placeholder.jpg.
  return src;
};
