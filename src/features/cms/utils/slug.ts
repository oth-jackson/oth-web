export function generateSlug(title: string): string {
  if (!title) return `post-${Date.now()}`;

  return (
    title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove non-word, non-space, non-hyphen characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, "") // Trim leading/trailing hyphens
      .trim() || `post-${Date.now()}` // Fallback if title becomes empty
  );
}
