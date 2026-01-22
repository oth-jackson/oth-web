"use client";

import { UserCheck, Briefcase, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/card";
import { Button } from "@/ui/button";
import { CalendarModal } from "@/components/calendar-modal";
import {
  motion,
  FadeInUp,
  staggerContainer,
  staggerItem,
} from "@/lib/motion";

const engagements = [
  {
    icon: Briefcase,
    title: "Project",
    description:
      "Fixed-scope builds with clear deliverables. MVPs, prototypes, or feature sprints—we own it from kickoff to handoff.",
    cta: "Book a Call",
  },
  {
    icon: UserCheck,
    title: "Embedded",
    description:
      "We become part of your team. 10-20 hours per week of hands-on design and engineering leadership, shipping alongside your people.",
    cta: "Book a Call",
    featured: true,
  },
  {
    icon: MessageCircle,
    title: "Advisory",
    description:
      "Strategic guidance without the overhead. Architecture reviews, hiring consults, and product strategy sessions.",
    cta: "Book a Call",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-24 border-t border-gray-300 dark:border-primary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="mb-12 text-center">
          <p className="text-sm font-medium text-primary mb-2">ENGAGEMENTS</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            🚀 Choose Your Path
          </h2>
        </FadeInUp>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {engagements.map((engagement) => (
            <motion.div key={engagement.title} variants={staggerItem}>
              <Card
                className={`relative group h-full flex flex-col transition-shadow duration-300 border-gray-300 dark:border-primary/30 hover:shadow-lg ${
                  engagement.featured ? "ring-2 ring-primary shadow-lg" : ""
                }`}
              >
                {engagement.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <engagement.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{engagement.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <CardDescription className="text-base leading-relaxed flex-1">
                    {engagement.description}
                  </CardDescription>
                  <CalendarModal>
                    <Button
                      className="w-full mt-6"
                      variant={engagement.featured ? "default" : "outline"}
                    >
                      {engagement.cta}
                    </Button>
                  </CalendarModal>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
