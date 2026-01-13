import { Badge } from "@/ui/badge";

const capabilities = [
  "AI Engineering",
  "Agent Design",
  "Unity3D",
  "Azure",
  "C#/.NET",
  "Full-Stack Web",
  "Digital Twins",
  "Spatial Computing",
  "RAG Systems",
  "Product Design",
  "UX/UI",
  "Mobile Development",
  "Cloudflare",
  "3D Rendering",
  "Innovation Strategy",
  "Tech Consulting",
];

export function CapabilitiesSection() {
  return (
    <section className="py-12 md:py-16 border-t border-gray-300 dark:border-primary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Core Capabilities
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-3 max-w-6xl mx-auto">
          {capabilities.map((capability) => (
            <Badge
              key={capability}
              variant="outline"
              className="px-4 py-1.5 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
            >
              {capability}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}
