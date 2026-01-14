"use client";

import {
  motion,
  FadeInUp,
  staggerContainer,
  staggerItem,
} from "@/lib/motion";
import Image from "next/image";
import Link from "next/link";
import { Linkedin } from "lucide-react";

const teamMembers = [
  {
    name: "Jackson Barnes",
    title: "Founder · Principal Designer & Engineer",
    bio: "AI-native product leader with 8+ years across design, engineering, and spatial computing. Helped scale YC-backed startup from ≈ $10k MRR to $100k+ (> $1M ARR) within five months, and delivered XR/AI systems for enterprise clients.",
    image: "/images/headshots/jackson-headshot.png",
    linkedin: "https://www.linkedin.com/in/atxjacksonbarnes/",
  },
  {
    name: "Andy Katsikapes",
    title: "Lead Engineer · Immersive Systems",
    bio: "Technologist and engineering manager specializing in XR, real-time systems, and network-aware APIs. Led immersive lab initiatives at Verizon and built large-scale interactive platforms across enterprise and media.",
    image: "/images/headshots/andy-headshot.jpg",
    linkedin: "https://linkedin.com/in/andy-katsikapes",
  },
];

export function TeamSection() {
  return (
    <section className="py-16 md:py-24 border-t border-gray-300 dark:border-primary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="mb-12 text-center">
          <p className="text-sm font-medium text-primary mb-2">THE TEAM</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Expert, Hands-on Design and Engineering
          </h2>
        </FadeInUp>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {teamMembers.map((member) => (
            <motion.div key={member.name} variants={staggerItem}>
              <div className="border border-gray-300 dark:border-primary/30 rounded-2xl overflow-hidden bg-background flex flex-col transition-shadow duration-300 hover:shadow-lg">
                <div className="relative w-full aspect-[6/7] overflow-hidden bg-muted">
                  <Image
                    src={member.image}
                    alt={`${member.name} headshot`}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 300px, 80vw"
                  />
                </div>
                <div className="p-3 md:p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-xl font-semibold tracking-tight">
                      {member.name}
                    </h3>
                    <Link
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 dark:border-primary/30 text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`${member.name} on LinkedIn`}
                    >
                      <Linkedin className="h-4 w-4" />
                    </Link>
                  </div>
                  <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground mt-1">
                    {member.title}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
