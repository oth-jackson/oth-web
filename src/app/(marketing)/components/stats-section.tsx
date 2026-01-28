"use client";

import { useRef, useEffect, useState } from "react";
import { motion, FadeInUp, staggerContainer, staggerItem } from "@/lib/motion";
import { useScroll, useTransform, useSpring, useInView } from "framer-motion";

interface Stat {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
  step?: number;
}

const stats: Stat[] = [
  { value: 1000, prefix: "$", suffix: "K", label: "ARR Generated", step: 10 },
  { value: 1000, prefix: "", suffix: "K", label: "Impressions Driven", step: 10 },
  { value: 20, prefix: "", suffix: "+", label: "Products Shipped" },
];

function AnimatedCounter({
  value,
  prefix = "",
  suffix,
  step,
  duration = 2000
}: {
  value: number;
  prefix?: string;
  suffix: string;
  step?: number;
  duration?: number;
}) {
  const [count, setCount] = useState(step || 0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);

      let newCount: number;
      if (step) {
        // Round to nearest step for cleaner counting
        newCount = Math.round((eased * value) / step) * step;
        newCount = Math.max(newCount, step);
      } else {
        newCount = Math.floor(eased * value);
      }

      setCount(newCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [inView, value, duration, step]);

  // Switch to M+ when we hit 1000K
  let displayValue: string;
  if (suffix === "K") {
    displayValue = count >= 1000 ? "1M+" : `${count}K+`;
  } else {
    displayValue = `${count}${suffix}`;
  }

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{displayValue}
    </span>
  );
}

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Subtle parallax shift based on position
  const cardY = useTransform(smoothProgress, [0, 1], [20 + index * 5, -10 - index * 3]);

  return (
    <motion.div
      ref={cardRef}
      variants={staggerItem}
      style={{ y: cardY }}
      className="text-center"
    >
      <div className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
        <AnimatedCounter
          value={stat.value}
          prefix={stat.prefix}
          suffix={stat.suffix}
          step={stat.step}
        />
      </div>
      <p className="mt-3 text-sm md:text-base uppercase tracking-[0.12em] text-muted-foreground font-medium">
        {stat.label}
      </p>
    </motion.div>
  );
}

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Floating accent parallax
  const accentY = useTransform(smoothProgress, [0, 1], [30, -30]);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 border-t border-gray-300 dark:border-primary/30 relative overflow-hidden"
    >
      {/* Floating accent shape */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          y: accentY,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <FadeInUp className="mb-12 text-center">
          <p className="text-sm font-medium text-primary mb-2">TRACK RECORD</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            📣 Results That Speak
          </h2>
        </FadeInUp>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
