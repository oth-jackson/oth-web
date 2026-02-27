"use client";

import { Button } from "@/ui/button";
import { CalendarModal } from "@/components/calendar-modal";
import { FadeInUp } from "@/lib/motion";

export function ServicesSection() {
  return (
    <section
      id="services"
      className="py-16 md:py-24 border-t border-gray-300 dark:border-primary/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-[0.18em] mb-2">
            ENGAGEMENTS
          </p>
        </FadeInUp>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: Project-Based */}
          <FadeInUp>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Project-Based
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              Fixed-scope engagements from concept to launch.
            </p>

            <p className="mt-8 text-4xl md:text-5xl font-bold tracking-tight">
              Starting at $10,000
            </p>

            <ul className="mt-8 space-y-1.5 text-base md:text-lg text-muted-foreground max-w-xl list-disc list-inside">
              <li>MVPs and proof-of-concepts shipped fast</li>
              <li>Prototypes and interactive demos</li>
              <li>Feature sprints with clear deliverables</li>
              <li>Full handoff with docs, deploys, and support</li>
            </ul>

            <div className="mt-10">
              <CalendarModal>
                <Button size="lg">Book a Call</Button>
              </CalendarModal>
            </div>
          </FadeInUp>

          {/* Right: Retainers */}
          <FadeInUp className="flex items-start lg:-mt-10">
            <div className="rounded-2xl bg-primary p-8 md:p-10 w-full">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-foreground">
                Retainers
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/70">Embedded design and engineering leadership.</p>

              <p className="mt-8 text-4xl md:text-5xl font-bold tracking-tight text-primary-foreground">
                From $6,000/mo
              </p>

              <ul className="mt-8 space-y-1.5 text-base md:text-lg text-primary-foreground/70 list-disc list-inside">
                <li>10–20 hours per week, flexible</li>
                <li>Hands-on design and engineering</li>
                <li>Architecture reviews and strategy</li>
                <li>Seamless integration with your team</li>
              </ul>

              <div className="mt-10">
                <CalendarModal>
                  <Button size="lg" variant="secondary">Book a Call</Button>
                </CalendarModal>
              </div>
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}
