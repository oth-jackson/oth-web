import { MapPin } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 border-t border-gray-300 dark:border-primary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-medium text-primary mb-2">ABOUT OTHERWISE</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Built for Innovation
          </h2>

          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Otherwise is a strategic, AI-native practice delivering engineering,
              design, and product services. We partner with teams to prototype and
              deploy intelligent tools that match real-world workflows and scale
              from pilot to production.
            </p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">Austin, Texas</span>
          </div>
        </div>
      </div>
    </section>
  );
}
