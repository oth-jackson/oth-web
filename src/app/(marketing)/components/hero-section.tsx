"use client";

import dynamic from "next/dynamic";
import { useRef, useState, useEffect, useMemo } from "react";
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

  // Cycling words state
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isWordVisible, setIsWordVisible] = useState(true);
  const [boxWidth, setBoxWidth] = useState<number | null>(null);
  const measurerRef = useRef<HTMLSpanElement | null>(null);
  const wordBoxRef = useRef<HTMLSpanElement | null>(null);

  const visionWords = useMemo(() => ["Vision.", "Idea.", "Team."], []);

  // Pre-calculate initial width on mount
  useEffect(() => {
    if (measurerRef.current) {
      measurerRef.current.textContent = visionWords[0];
      const baseWidth = measurerRef.current.offsetWidth;
      const buffer = 10;
      const initialWidth = Math.max(baseWidth + buffer, 80);
      setBoxWidth(initialWidth);
    }
  }, [visionWords]);

  // Cycling animation for words
  useEffect(() => {
    const interval = setInterval(() => {
      if (measurerRef.current) {
        const nextIndex = (currentWordIndex + 1) % visionWords.length;
        measurerRef.current.textContent = visionWords[nextIndex];
        const baseWidth = measurerRef.current.offsetWidth;
        const buffer = 10;
        const nextWidth = Math.max(baseWidth + buffer, 80);

        // Fade out text
        setIsWordVisible(false);

        // Resize width after fade out
        setTimeout(() => {
          setBoxWidth(nextWidth);
        }, 400);

        // Change text and fade in
        setTimeout(() => {
          setCurrentWordIndex(nextIndex);
          setIsWordVisible(true);
        }, 600);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [currentWordIndex, visionWords]);

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
      className="min-h-screen relative bg-background overflow-hidden"
    >
      {/* Film grain/noise texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1] opacity-[0.25] dark:opacity-[0.35] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

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
        className="absolute inset-0 pointer-events-none opacity-[0.15] dark:opacity-[0.20]"
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

      {/* 3D Scene background gradient - separate layer */}
      <div 
        className="hidden lg:block absolute right-0 top-0 h-full w-[50vw]"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, hsl(0 0% 85% / 0.25) 0%, hsl(0 0% 90% / 0.12) 40%, transparent 70%)',
          maskImage: "linear-gradient(to right, transparent 0%, black 15%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 15%)",
        }}
      />
      {/* Dither pattern on gradient */}
      <div 
        className="hidden lg:block absolute right-0 top-0 h-full w-[50vw] opacity-[0.35] dark:opacity-[0.25]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 8 8' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='1' height='1' fill='%23000' opacity='0.5'/%3E%3Crect x='4' y='0' width='1' height='1' fill='%23000' opacity='0.25'/%3E%3Crect x='2' y='2' width='1' height='1' fill='%23000' opacity='0.375'/%3E%3Crect x='6' y='2' width='1' height='1' fill='%23000' opacity='0.125'/%3E%3Crect x='0' y='4' width='1' height='1' fill='%23000' opacity='0.3125'/%3E%3Crect x='4' y='4' width='1' height='1' fill='%23000' opacity='0.0625'/%3E%3Crect x='2' y='6' width='1' height='1' fill='%23000' opacity='0.4375'/%3E%3Crect x='6' y='6' width='1' height='1' fill='%23000' opacity='0.1875'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '4px 4px',
          maskImage: "linear-gradient(to right, transparent 0%, black 15%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 15%)",
        }}
      />

      {/* 3D Scene - Extended panel that bleeds into left side */}
      <motion.div
        className="hidden lg:block absolute right-0 top-0 h-full w-[50vw]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: easing.smoothOut }}
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 10%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%)",
          y: sceneY,
        }}
      >
        <HeroScene />
      </motion.div>

      <div className="min-h-0 md:min-h-screen flex items-start md:items-center relative z-10">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-6 md:py-20 w-full md:-translate-y-32 lg:-translate-y-40"
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
              <span className="block">
                Your{" "}
                {/* Hidden measurer element */}
                <span
                  ref={measurerRef}
                  className="absolute invisible pointer-events-none font-serif italic"
                  style={{
                    position: "absolute",
                    visibility: "hidden",
                    whiteSpace: "nowrap",
                  }}
                />
                <span
                  ref={wordBoxRef}
                  className="inline-block font-serif italic"
                  style={{
                    width: boxWidth ? `${boxWidth}px` : "auto",
                    transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  <span
                    className={`inline-block transition-all duration-500 ${
                      isWordVisible
                        ? "opacity-100 blur-0"
                        : "opacity-0 blur-sm"
                    }`}
                  >
                    {visionWords[currentWordIndex]}
                  </span>
                </span>
              </span>
              <span className="block mt-2 md:mt-3">Our Execution.</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: easing.smooth }}
            >
              Expert product design and engineering skills from people who&apos;ve helped
              scale AI products to $1M+ ARR, hired teams, and shipped under pressure. We&apos;re ready to help you do the same.
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
                <Button variant="ghost" size="icon" className="h-9 w-9 scale-110">
                  <Linkedin className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="mailto:contact@otherwise.dev">
                <Button variant="ghost" size="icon" className="h-9 w-9 scale-110">
                  <Mail className="h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

          </div>
        </motion.div>
      </div>

      {/* Mini Process Strip - Vertical (Absolute positioned) */}
      <div className="hidden md:block absolute bottom-6 lg:bottom-8 left-0 right-0 z-10">
        <motion.div
          className="max-w-7xl mx-auto px-5 sm:px-7 lg:px-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0, ease: easing.smooth }}
        >
        <motion.p
          className="text-sm uppercase tracking-[0.15em] text-muted-foreground font-medium mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.4, ease: easing.smooth }}
        >
          How we work
        </motion.p>
        <div className="flex flex-col">
          {[
            { label: "Understand your goals", desc: "Deep-dive into context" },
            { label: "Ship fast, iterate faster", desc: "Weeks, not months" },
            { label: "Scale what works", desc: "Production-ready systems" },
          ].map((step, index) => (
            <motion.div
              key={step.label}
              className="flex gap-5"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                ease: easing.smoothOut,
              }}
            >
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 min-w-3 min-h-3 rounded-full bg-primary mt-1 shrink-0" />
                {index < 2 && (
                  <div className="w-0.5 h-full bg-linear-to-b from-primary/40 to-transparent min-h-12" />
                )}
              </div>
              {/* Content */}
              <div className="pb-8">
                <h4 className="text-lg font-semibold text-foreground leading-tight">
                  {step.label}
                </h4>
                <p className="text-base text-muted-foreground mt-1">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        </motion.div>
      </div>
    </section>
  );
}
