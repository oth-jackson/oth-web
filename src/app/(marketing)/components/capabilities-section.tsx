"use client";

import { Badge } from "@/ui/badge";
import {
  motion,
  FadeInUp,
  staggerContainerFast,
  badgePopIn,
} from "@/lib/motion";

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Core Capabilities
          </h2>
        </FadeInUp>

        <motion.div
          className="flex flex-wrap justify-center gap-3 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainerFast}
        >
          {capabilities.map((capability) => (
            <motion.div
              key={capability}
              variants={badgePopIn}
            >
              <Badge
                variant="outline"
                className="px-4 py-1.5 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors cursor-default"
              >
                {capability}
              </Badge>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
