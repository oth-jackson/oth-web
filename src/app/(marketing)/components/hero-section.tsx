"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { ArrowUpRight, Linkedin, Mail } from "lucide-react";
import { Button } from "@/ui/button";
import Link from "next/link";
import { CalendarModal } from "@/components/calendar-modal";
import { motion, easing } from "@/lib/motion";
import { useScroll, useTransform, useSpring } from "framer-motion";

const HeroScene = dynamic(
  () => import("@/components/hero-scene").then((mod) => mod.HeroScene),
  { ssr: false }
);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  
  // Scroll-based parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  // Smooth spring physics for parallax
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  // Different parallax speeds for depth layers
  const dotPatternY = useTransform(smoothProgress, [0, 1], [0, 150]);
  const gradientY = useTransform(smoothProgress, [0, 1], [0, 100]);
  const contentY = useTransform(smoothProgress, [0, 1], [0, 80]);
  const floatingShape1Y = useTransform(smoothProgress, [0, 1], [0, 200]);
  const floatingShape2Y = useTransform(smoothProgress, [0, 1], [0, -120]);
  const sceneY = useTransform(smoothProgress, [0, 1], [0, 60]);
  
  return (
    <section
      ref={sectionRef}
      id="hero"
      className="min-h-[90vh] relative bg-background overflow-hidden"
    >
      {/* Floating decorative shapes */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none opacity-[0.03] dark:opacity-[0.06]"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
          left: '-200px',
          top: '10%',
          y: floatingShape1Y,
        }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.04] dark:opacity-[0.08]"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
          left: '30%',
          bottom: '-100px',
          y: floatingShape2Y,
        }}
      />
      
      {/* Subtle halftone/dot pattern overlay for left side */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-[0.08] dark:opacity-[0.12]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
          maskImage: 'linear-gradient(to right, black 0%, black 50%, transparent 70%)',
          WebkitMaskImage: 'linear-gradient(to right, black 0%, black 50%, transparent 70%)',
          y: dotPatternY,
        }}
      />

      {/* Subtle gradient texture */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background: 'linear-gradient(135deg, transparent 0%, transparent 40%, hsl(var(--muted)) 100%)',
          maskImage: 'linear-gradient(to right, black 0%, transparent 60%)',
          WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 60%)',
          y: gradientY,
        }}
      />

      {/* 3D Scene - Extended panel that bleeds into left side */}
      <motion.div
        className="hidden lg:block absolute right-0 top-0 h-full w-[50vw]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: easing.smoothOut }}
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 20%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 20%)",
          y: sceneY,
        }}
      >
        <HeroScene />
      </motion.div>

      <div className="min-h-0 md:min-h-[90vh] flex items-start md:items-center relative z-10">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-6 md:py-20 w-full md:-translate-y-24 lg:-translate-y-32"
          style={{ y: contentY }}
        >
          <div>
            <motion.p
              className="text-base uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easing.smooth }}
            >
              For Growing Teams
            </motion.p>

            <motion.h1
              className="text-[3.25rem] sm:text-[3.75rem] md:text-[4.75rem] lg:text-[6rem] font-semibold leading-[0.95] tracking-[-0.03em] mb-6 max-w-4xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: easing.smoothOut }}
            >
              Fractional Product Leadership
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: easing.smooth }}
            >
              Expert design and engineering leadership from people who&apos;ve helped
              scale products, hired teams, and shipped under pressure. We&apos;re
              not advisors, we&apos;re operators.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 max-w-xl lg:max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: easing.smooth }}
            >
              <CalendarModal>
                <Button size="lg">
                  Book Discovery Call
                  <ArrowUpRight className="h-5 w-5" />
                </Button>
              </CalendarModal>
              <Link href="/posts?type=project" className="w-full sm:w-auto">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700">
                  Our Work
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="flex gap-0.5 mt-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8, ease: easing.smooth }}
            >
              <Link
                href="https://www.linkedin.com/company/otherwise-company"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Linkedin className="!h-5 !w-5" />
                </Button>
              </Link>
              <Link href="mailto:contact@otherwise.dev">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Mail className="!h-5 !w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
