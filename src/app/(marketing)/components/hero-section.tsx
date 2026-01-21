"use client";

import dynamic from "next/dynamic";
import { ArrowUpRight, Linkedin } from "lucide-react";
import { Button } from "@/ui/button";
import Link from "next/link";
import { CalendarModal } from "@/components/calendar-modal";
import { motion, easing } from "@/lib/motion";

const HeroScene = dynamic(
  () => import("@/components/hero-scene").then((mod) => mod.HeroScene),
  { ssr: false }
);

export function HeroSection() {
  return (
    <section
      id="hero"
      className="min-h-[80vh] relative bg-background overflow-hidden"
    >
      {/* Subtle halftone/dot pattern overlay for left side */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08] dark:opacity-[0.12]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
          maskImage: 'linear-gradient(to right, black 0%, black 50%, transparent 70%)',
          WebkitMaskImage: 'linear-gradient(to right, black 0%, black 50%, transparent 70%)'
        }}
      />

      {/* Subtle gradient texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background: 'linear-gradient(135deg, transparent 0%, transparent 40%, hsl(var(--muted)) 100%)',
          maskImage: 'linear-gradient(to right, black 0%, transparent 60%)',
          WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 60%)'
        }}
      />

      {/* 3D Scene - Extended panel that bleeds into left side */}
      <motion.div
        className="hidden lg:block absolute right-0 top-0 h-full w-[45vw]"
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: easing.smoothOut }}
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 20%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 20%)"
        }}
      >
        <HeroScene />
      </motion.div>

      <div className="min-h-[80vh] flex items-center relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full md:-translate-y-6">
          <div className="max-w-4xl">
            <motion.p
              className="text-base uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easing.smooth }}
            >
              For Growing Teams
            </motion.p>

            <motion.h1
              className="text-[3.25rem] sm:text-[3.75rem] md:text-[4.75rem] lg:text-[6rem] font-semibold leading-[0.95] tracking-[-0.03em] mb-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: easing.smoothOut }}
            >
              Fractional Product Leadership
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: easing.smooth }}
            >
              Expert design and engineering leadership from people who&apos;ve helped
              scale products, hired teams, and shipped under pressure. We&apos;re
              not advisors, we&apos;re operators.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: easing.smooth }}
            >
              <CalendarModal>
                <Button size="lg">
                  Book a Discovery Call
                  <ArrowUpRight className="h-5 w-5" />
                </Button>
              </CalendarModal>
              <Link href="/posts?type=project">
                <Button variant="outline" size="lg">
                  View Projects
                </Button>
              </Link>
              <Link
                href="https://www.linkedin.com/company/otherwise-company"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="lg">
                  <Linkedin className="h-5 w-5" />
                  LinkedIn
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
