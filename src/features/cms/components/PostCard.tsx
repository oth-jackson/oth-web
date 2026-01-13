import { Card, CardDescription, CardTitle } from "@/ui/card";
import Link from "next/link";
import { type Post } from "@/db";
import { ProxiedImage } from "@/features/cms/components/ProxiedImage";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/ui/badge";

export function PostCard({ item }: { item: Post }) {
  const contentType = item.contentType;

  // Use the actual post image if available, otherwise use the fallback
  const imageSrc = item.image || "/post-fallback-image.jpg";

  return (
    <Link href={`/posts/${contentType}/${item.slug}`} className="block">
      <Card
        key={item.slug}
        className="overflow-hidden group transition-all duration-300 cursor-pointer h-full flex flex-col p-0 gap-0 relative border border-black"
      >
        <div className="aspect-[4/3] bg-muted relative overflow-hidden w-full">
          <ProxiedImage
            src={imageSrc}
            alt={`${item.title} thumbnail`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
          />
          {/* Emboss overlay - only in light mode */}
          <div
            className="absolute inset-0 pointer-events-none dark:hidden"
            style={{
              background: `
                linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%, rgba(0,0,0,0.05) 100%)
              `,
              boxShadow: `
                inset 1px 1px 2px rgba(255,255,255,0.15),
                inset -1px -1px 2px rgba(0,0,0,0.1)
              `,
            }}
          />
        </div>

        {/* Content drawer that slides up */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-[calc(100%-2.5rem)] group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <div className="pt-1.5 pb-1 bg-yellow-accent border-t border-black">
            <div className="px-4 pb-1">
              <CardTitle className="flex items-center justify-between text-black">
                <span className="truncate block leading-normal py-0.5">
                  {item.title}
                </span>
                <ArrowUpRight className="h-4 w-4 flex-shrink-0 ml-2" />
              </CardTitle>
            </div>
          </div>
          <div className="border-b border-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="bg-card px-4 pt-4 pb-3">
            <CardDescription className="line-clamp-3 text-card-foreground mb-3">
              {item.description}
            </CardDescription>

            {/* Tags and Date */}
            <div className="space-y-2">
              {/* Tags and Date on same line */}
              <div className="flex items-center justify-start gap-2">
                {/* Tags */}
                {item.tags && (
                  <div className="flex flex-wrap gap-1.5">
                    {item.tags
                      .split(",")
                      .map((tag: string) => tag.trim())
                      .filter(Boolean)
                      .slice(0, 3)
                      .map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    {item.tags.split(",").filter(Boolean).length > 3 && (
                      <Badge variant="secondary">
                        +{item.tags.split(",").filter(Boolean).length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Date */}
                {(item.publishDate || item.date) && (
                  <span className="text-muted-foreground text-xs whitespace-nowrap">
                    {new Date(item.publishDate || item.date).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
