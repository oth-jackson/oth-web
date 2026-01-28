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
  { value: 2000, prefix: "", suffix: "K", label: "Impressions Driven", step: 20 },
  { value: 15, prefix: "", suffix: "+", label: "Products Shipped" },
];

interface ConfettiPiece {
  id: number;
  x: number; // final x position as percentage
  delay: number;
  duration: number;
  size: string;
  color: string;
  rotation: number;
  shape: "square" | "circle" | "rectangle";
  finalY: number;
  origin: "left" | "right"; // which cluster it belongs to
}

const confettiPieces: ConfettiPiece[] = [
  // Left cluster (originates from ~12% at bottom, spreads to 1-25%)
  { id: 1, x: 2, delay: 0, duration: 1.8, size: "12px", color: "bg-primary/60", rotation: 15, shape: "square", finalY: 25, origin: "left" },
  { id: 2, x: 7, delay: 0.2, duration: 2.0, size: "10px", color: "bg-amber-400/70", rotation: -30, shape: "circle", finalY: 45, origin: "left" },
  { id: 3, x: 12, delay: 0.1, duration: 1.6, size: "10px", color: "bg-rose-400/60", rotation: 45, shape: "rectangle", finalY: 70, origin: "left" },
  { id: 4, x: 4, delay: 0.4, duration: 2.2, size: "8px", color: "bg-sky-400/70", rotation: -15, shape: "square", finalY: 55, origin: "left" },
  { id: 5, x: 17, delay: 0.3, duration: 1.9, size: "10px", color: "bg-emerald-400/60", rotation: 60, shape: "circle", finalY: 35, origin: "left" },
  { id: 6, x: 9, delay: 0.5, duration: 2.1, size: "10px", color: "bg-violet-400/60", rotation: -45, shape: "square", finalY: 80, origin: "left" },
  { id: 7, x: 21, delay: 0.15, duration: 1.7, size: "10px", color: "bg-amber-400/60", rotation: 30, shape: "rectangle", finalY: 15, origin: "left" },
  { id: 8, x: 5, delay: 0.35, duration: 2.0, size: "8px", color: "bg-rose-400/70", rotation: -60, shape: "circle", finalY: 90, origin: "left" },
  { id: 9, x: 24, delay: 0.25, duration: 1.8, size: "10px", color: "bg-primary/50", rotation: 20, shape: "square", finalY: 60, origin: "left" },
  { id: 10, x: 14, delay: 0.45, duration: 1.9, size: "8px", color: "bg-sky-400/60", rotation: -25, shape: "circle", finalY: 40, origin: "left" },
  { id: 21, x: 1, delay: 0.12, duration: 1.7, size: "8px", color: "bg-emerald-400/70", rotation: 35, shape: "circle", finalY: 18, origin: "left" },
  { id: 22, x: 10, delay: 0.28, duration: 2.1, size: "12px", color: "bg-violet-400/65", rotation: -22, shape: "square", finalY: 52, origin: "left" },
  { id: 23, x: 19, delay: 0.08, duration: 1.5, size: "9px", color: "bg-rose-400/65", rotation: 48, shape: "rectangle", finalY: 28, origin: "left" },
  { id: 24, x: 6, delay: 0.55, duration: 2.3, size: "10px", color: "bg-amber-400/65", rotation: -38, shape: "circle", finalY: 72, origin: "left" },
  { id: 25, x: 22, delay: 0.18, duration: 1.85, size: "8px", color: "bg-sky-400/70", rotation: 28, shape: "square", finalY: 48, origin: "left" },
  { id: 26, x: 3, delay: 0.42, duration: 1.95, size: "11px", color: "bg-primary/55", rotation: -55, shape: "rectangle", finalY: 85, origin: "left" },
  { id: 27, x: 25, delay: 0.32, duration: 2.0, size: "9px", color: "bg-emerald-400/60", rotation: 42, shape: "circle", finalY: 22, origin: "left" },
  { id: 28, x: 8, delay: 0.22, duration: 1.75, size: "10px", color: "bg-violet-400/70", rotation: -18, shape: "square", finalY: 65, origin: "left" },

  // Right cluster (originates from ~88% at bottom, spreads to 75-99%)
  { id: 11, x: 78, delay: 0.1, duration: 1.9, size: "10px", color: "bg-sky-400/60", rotation: -25, shape: "rectangle", finalY: 30, origin: "right" },
  { id: 12, x: 85, delay: 0.3, duration: 2.1, size: "12px", color: "bg-emerald-400/70", rotation: 40, shape: "circle", finalY: 50, origin: "right" },
  { id: 13, x: 92, delay: 0.2, duration: 1.7, size: "8px", color: "bg-violet-400/60", rotation: -50, shape: "square", finalY: 20, origin: "right" },
  { id: 14, x: 80, delay: 0.25, duration: 2.0, size: "10px", color: "bg-rose-400/60", rotation: 35, shape: "circle", finalY: 65, origin: "right" },
  { id: 15, x: 88, delay: 0.4, duration: 1.8, size: "10px", color: "bg-amber-400/70", rotation: -20, shape: "rectangle", finalY: 85, origin: "right" },
  { id: 16, x: 95, delay: 0.15, duration: 1.9, size: "10px", color: "bg-primary/60", rotation: 55, shape: "square", finalY: 45, origin: "right" },
  { id: 17, x: 82, delay: 0.3, duration: 2.2, size: "8px", color: "bg-sky-400/60", rotation: -40, shape: "circle", finalY: 75, origin: "right" },
  { id: 18, x: 90, delay: 0.1, duration: 1.6, size: "12px", color: "bg-emerald-400/60", rotation: 25, shape: "square", finalY: 38, origin: "right" },
  { id: 19, x: 76, delay: 0.45, duration: 2.0, size: "10px", color: "bg-violet-400/70", rotation: -35, shape: "rectangle", finalY: 55, origin: "right" },
  { id: 20, x: 93, delay: 0.2, duration: 1.8, size: "10px", color: "bg-rose-400/60", rotation: 50, shape: "circle", finalY: 12, origin: "right" },
  { id: 29, x: 97, delay: 0.08, duration: 1.7, size: "9px", color: "bg-amber-400/65", rotation: -32, shape: "circle", finalY: 58, origin: "right" },
  { id: 30, x: 75, delay: 0.38, duration: 2.15, size: "11px", color: "bg-primary/55", rotation: 22, shape: "square", finalY: 42, origin: "right" },
  { id: 31, x: 86, delay: 0.18, duration: 1.65, size: "8px", color: "bg-sky-400/70", rotation: -48, shape: "rectangle", finalY: 28, origin: "right" },
  { id: 32, x: 96, delay: 0.52, duration: 2.25, size: "10px", color: "bg-rose-400/65", rotation: 38, shape: "circle", finalY: 78, origin: "right" },
  { id: 33, x: 79, delay: 0.28, duration: 1.85, size: "9px", color: "bg-emerald-400/65", rotation: -15, shape: "square", finalY: 18, origin: "right" },
  { id: 34, x: 91, delay: 0.42, duration: 1.95, size: "12px", color: "bg-violet-400/60", rotation: 52, shape: "rectangle", finalY: 68, origin: "right" },
  { id: 35, x: 83, delay: 0.15, duration: 2.05, size: "8px", color: "bg-amber-400/70", rotation: -42, shape: "circle", finalY: 92, origin: "right" },
  { id: 36, x: 98, delay: 0.35, duration: 1.75, size: "10px", color: "bg-primary/60", rotation: 28, shape: "square", finalY: 35, origin: "right" },
];

// Origin points for the shotgun effect
const LEFT_ORIGIN = 12; // percentage from left
const RIGHT_ORIGIN = 88; // percentage from left

function ConfettiPieceComponent({ piece }: { piece: ConfettiPiece }) {
  const shapeClasses = piece.shape === "circle"
    ? "rounded-full"
    : piece.shape === "rectangle"
      ? "rounded-sm"
      : "";

  const aspectRatio = piece.shape === "rectangle"
    ? { height: piece.size, width: `calc(${piece.size} * 0.5)` }
    : { width: piece.size, height: piece.size };

  const originX = piece.origin === "left" ? LEFT_ORIGIN : RIGHT_ORIGIN;

  return (
    <motion.div
      className={`absolute ${piece.color} ${shapeClasses}`}
      style={{
        ...aspectRatio,
      }}
      initial={{
        left: `${originX}%`,
        bottom: "5%",
        opacity: 0,
        rotate: 0,
      }}
      whileInView={{
        left: `${piece.x}%`,
        bottom: `${100 - piece.finalY}%`,
        opacity: 1,
        rotate: piece.rotation,
      }}
      viewport={{ once: true, margin: "0px" }}
      transition={{
        left: {
          duration: piece.duration,
          delay: piece.delay,
          ease: [0.22, 1, 0.36, 1],
        },
        bottom: {
          duration: piece.duration,
          delay: piece.delay,
          ease: [0.22, 1, 0.36, 1],
        },
        opacity: {
          duration: 0.3,
          delay: piece.delay,
        },
        rotate: {
          duration: piece.duration * 1.2,
          delay: piece.delay,
          ease: "easeOut",
        },
      }}
    />
  );
}

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

  // Switch to M+ when we hit 1000K or more
  let displayValue: string;
  if (suffix === "K") {
    if (count >= 1000) {
      displayValue = `${count / 1000}M+`;
    } else {
      displayValue = `${count}K+`;
    }
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

      {/* Animated confetti */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {confettiPieces.map((piece) => (
          <ConfettiPieceComponent key={piece.id} piece={piece} />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mb-12 text-center relative">
          <p className="text-sm font-medium text-primary mb-2">TRACK RECORD</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            📣 Results That Speak
          </h2>
        </div>

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
