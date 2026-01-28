"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { motion, FadeInUp, staggerContainer, staggerItem } from "@/lib/motion";
import { useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/ui/button";
import Link from "next/link";
import type { Post } from "@/db";
import { PostCard } from "@/features/cms/components/PostCard";

interface Stat {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
  step?: number;
}

const stats: Stat[] = [
  { value: 1000, prefix: "$", suffix: "K", label: "ARR Generated", step: 10 },
  { value: 4000, prefix: "", suffix: "K", label: "Impressions Driven", step: 20 },
  { value: 8, prefix: "", suffix: "+", label: "Products Shipped" },
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
  // Left cluster (originates from top-left card corner, spreads upward and outward)
  { id: 1, x: 3, delay: 0, duration: 1.8, size: "12px", color: "bg-primary/60", rotation: 15, shape: "square", finalY: 8, origin: "left" },
  { id: 2, x: 8, delay: 0.2, duration: 2.0, size: "10px", color: "bg-amber-400/70", rotation: -30, shape: "circle", finalY: 18, origin: "left" },
  { id: 3, x: 15, delay: 0.1, duration: 1.6, size: "10px", color: "bg-rose-400/60", rotation: 45, shape: "rectangle", finalY: 35, origin: "left" },
  { id: 4, x: 5, delay: 0.4, duration: 2.2, size: "8px", color: "bg-sky-400/70", rotation: -15, shape: "square", finalY: 25, origin: "left" },
  { id: 5, x: 20, delay: 0.3, duration: 1.9, size: "10px", color: "bg-emerald-400/60", rotation: 60, shape: "circle", finalY: 12, origin: "left" },
  { id: 6, x: 10, delay: 0.5, duration: 2.1, size: "10px", color: "bg-violet-400/60", rotation: -45, shape: "square", finalY: 42, origin: "left" },
  { id: 7, x: 25, delay: 0.15, duration: 1.7, size: "10px", color: "bg-amber-400/60", rotation: 30, shape: "rectangle", finalY: 5, origin: "left" },
  { id: 8, x: 6, delay: 0.35, duration: 2.0, size: "8px", color: "bg-rose-400/70", rotation: -60, shape: "circle", finalY: 48, origin: "left" },
  { id: 9, x: 28, delay: 0.25, duration: 1.8, size: "10px", color: "bg-primary/50", rotation: 20, shape: "square", finalY: 30, origin: "left" },
  { id: 10, x: 18, delay: 0.45, duration: 1.9, size: "8px", color: "bg-sky-400/60", rotation: -25, shape: "circle", finalY: 15, origin: "left" },
  { id: 21, x: 2, delay: 0.12, duration: 1.7, size: "8px", color: "bg-emerald-400/70", rotation: 35, shape: "circle", finalY: 3, origin: "left" },
  { id: 22, x: 12, delay: 0.28, duration: 2.1, size: "12px", color: "bg-violet-400/65", rotation: -22, shape: "square", finalY: 22, origin: "left" },
  { id: 23, x: 22, delay: 0.08, duration: 1.5, size: "9px", color: "bg-rose-400/65", rotation: 48, shape: "rectangle", finalY: 10, origin: "left" },
  { id: 24, x: 7, delay: 0.55, duration: 2.3, size: "10px", color: "bg-amber-400/65", rotation: -38, shape: "circle", finalY: 38, origin: "left" },
  { id: 25, x: 26, delay: 0.18, duration: 1.85, size: "8px", color: "bg-sky-400/70", rotation: 28, shape: "square", finalY: 20, origin: "left" },
  { id: 26, x: 4, delay: 0.42, duration: 1.95, size: "11px", color: "bg-primary/55", rotation: -55, shape: "rectangle", finalY: 45, origin: "left" },
  { id: 27, x: 30, delay: 0.32, duration: 2.0, size: "9px", color: "bg-emerald-400/60", rotation: 42, shape: "circle", finalY: 6, origin: "left" },
  { id: 28, x: 9, delay: 0.22, duration: 1.75, size: "10px", color: "bg-violet-400/70", rotation: -18, shape: "square", finalY: 32, origin: "left" },

  // Right cluster (originates from top-right card corner, spreads upward and outward)
  { id: 11, x: 72, delay: 0.1, duration: 1.9, size: "10px", color: "bg-sky-400/60", rotation: -25, shape: "rectangle", finalY: 10, origin: "right" },
  { id: 12, x: 80, delay: 0.3, duration: 2.1, size: "12px", color: "bg-emerald-400/70", rotation: 40, shape: "circle", finalY: 22, origin: "right" },
  { id: 13, x: 88, delay: 0.2, duration: 1.7, size: "8px", color: "bg-violet-400/60", rotation: -50, shape: "square", finalY: 5, origin: "right" },
  { id: 14, x: 74, delay: 0.25, duration: 2.0, size: "10px", color: "bg-rose-400/60", rotation: 35, shape: "circle", finalY: 32, origin: "right" },
  { id: 15, x: 85, delay: 0.4, duration: 1.8, size: "10px", color: "bg-amber-400/70", rotation: -20, shape: "rectangle", finalY: 45, origin: "right" },
  { id: 16, x: 92, delay: 0.15, duration: 1.9, size: "10px", color: "bg-primary/60", rotation: 55, shape: "square", finalY: 18, origin: "right" },
  { id: 17, x: 76, delay: 0.3, duration: 2.2, size: "8px", color: "bg-sky-400/60", rotation: -40, shape: "circle", finalY: 40, origin: "right" },
  { id: 18, x: 86, delay: 0.1, duration: 1.6, size: "12px", color: "bg-emerald-400/60", rotation: 25, shape: "square", finalY: 12, origin: "right" },
  { id: 19, x: 70, delay: 0.45, duration: 2.0, size: "10px", color: "bg-violet-400/70", rotation: -35, shape: "rectangle", finalY: 28, origin: "right" },
  { id: 20, x: 90, delay: 0.2, duration: 1.8, size: "10px", color: "bg-rose-400/60", rotation: 50, shape: "circle", finalY: 3, origin: "right" },
  { id: 29, x: 95, delay: 0.08, duration: 1.7, size: "9px", color: "bg-amber-400/65", rotation: -32, shape: "circle", finalY: 25, origin: "right" },
  { id: 30, x: 68, delay: 0.38, duration: 2.15, size: "11px", color: "bg-primary/55", rotation: 22, shape: "square", finalY: 15, origin: "right" },
  { id: 31, x: 82, delay: 0.18, duration: 1.65, size: "8px", color: "bg-sky-400/70", rotation: -48, shape: "rectangle", finalY: 8, origin: "right" },
  { id: 32, x: 94, delay: 0.52, duration: 2.25, size: "10px", color: "bg-rose-400/65", rotation: 38, shape: "circle", finalY: 42, origin: "right" },
  { id: 33, x: 73, delay: 0.28, duration: 1.85, size: "9px", color: "bg-emerald-400/65", rotation: -15, shape: "square", finalY: 6, origin: "right" },
  { id: 34, x: 87, delay: 0.42, duration: 1.95, size: "12px", color: "bg-violet-400/60", rotation: 52, shape: "rectangle", finalY: 35, origin: "right" },
  { id: 35, x: 78, delay: 0.15, duration: 2.05, size: "8px", color: "bg-amber-400/70", rotation: -42, shape: "circle", finalY: 48, origin: "right" },
  { id: 36, x: 97, delay: 0.35, duration: 1.75, size: "10px", color: "bg-primary/60", rotation: 28, shape: "square", finalY: 14, origin: "right" },
];

// Origin points for the shotgun effect - positioned at top corners of project cards
const LEFT_ORIGIN_X = 25; // top-left card area
const LEFT_ORIGIN_Y = 55; // percentage from top (where cards start)
const RIGHT_ORIGIN_X = 75; // top-right card area
const RIGHT_ORIGIN_Y = 55;

function ConfettiPieceComponent({ piece }: { piece: ConfettiPiece }) {
  const shapeClasses = piece.shape === "circle"
    ? "rounded-full"
    : piece.shape === "rectangle"
      ? "rounded-sm"
      : "";

  const aspectRatio = piece.shape === "rectangle"
    ? { height: piece.size, width: `calc(${piece.size} * 0.5)` }
    : { width: piece.size, height: piece.size };

  const originX = piece.origin === "left" ? LEFT_ORIGIN_X : RIGHT_ORIGIN_X;
  const originY = piece.origin === "left" ? LEFT_ORIGIN_Y : RIGHT_ORIGIN_Y;

  return (
    <motion.div
      className={`absolute ${piece.color} ${shapeClasses}`}
      style={{
        ...aspectRatio,
      }}
      initial={{
        left: `${originX}%`,
        top: `${originY}%`,
        opacity: 0,
        rotate: 0,
      }}
      whileInView={{
        left: `${piece.x}%`,
        top: `${piece.finalY}%`,
        opacity: 1,
        rotate: piece.rotation,
      }}
      viewport={{ once: true, margin: "400px" }}
      transition={{
        left: {
          duration: piece.duration,
          delay: piece.delay,
          ease: [0.22, 1, 0.36, 1],
        },
        top: {
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

  // Switch to M+ when we hit 1000K or more, show decimals for smoother animation
  let displayValue: string;
  if (suffix === "K") {
    if (count >= 1000) {
      const millions = count / 1000;
      // ARR (with $ prefix) stays clean, others show decimals during animation
      if (prefix === "$" || count === value) {
        displayValue = `${millions}M+`;
      } else {
        displayValue = `${millions.toFixed(2)}M+`;
      }
    } else if (count >= 100 && prefix !== "$") {
      // Show decimal M format for non-ARR counters
      const millions = count / 1000;
      displayValue = `${millions.toFixed(2)}M+`;
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

// Constants for projects
const MAX_FEATURED_PROJECTS = 6;
const FEATURED_PROJECTS_DISPLAY = 6;
const API_RETRY_ATTEMPTS = 3;
const API_RETRY_DELAY = 1000;

interface FeaturedProjectsState {
  projects: Post[];
  loading: boolean;
  error: string | null;
}

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const [featuredProjectsState, setFeaturedProjectsState] =
    useState<FeaturedProjectsState>({
      projects: [],
      loading: true,
      error: null,
    });

  // Utility function for API retry logic
  const fetchWithRetry = useCallback(
    async (
      url: string,
      options: RequestInit = {},
      retries = API_RETRY_ATTEMPTS
    ): Promise<Response> => {
      try {
        const response = await fetch(url, {
          ...options,
          cache: "default",
          next: { revalidate: 30 },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response;
      } catch (error) {
        if (retries > 0) {
          console.warn(
            `API request failed, retrying... (${retries} attempts left)`,
            error
          );
          await new Promise((resolve) => setTimeout(resolve, API_RETRY_DELAY));
          return fetchWithRetry(url, options, retries - 1);
        }
        throw error;
      }
    },
    []
  );

  // Fetch featured projects
  const fetchFeaturedProjects = useCallback(async () => {
    try {
      setFeaturedProjectsState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      const response = await fetchWithRetry(
        "/api/posts?type=project&status=published&featured=true"
      );

      const projects: Post[] = await response.json();

      if (!Array.isArray(projects)) {
        throw new Error("Invalid response format: expected array of projects");
      }

      const sortedProjects = projects
        .filter((project) => project && project.slug && project.title)
        .sort((a: Post, b: Post) => {
          const getDate = (project: Post) => {
            const date = project.publishDate || project.date;
            return date ? new Date(date).getTime() : 0;
          };
          return getDate(b) - getDate(a);
        })
        .slice(0, MAX_FEATURED_PROJECTS);

      setFeaturedProjectsState({
        projects: sortedProjects,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while fetching projects";

      console.error("Failed to fetch featured projects:", error);
      setFeaturedProjectsState({
        projects: [],
        loading: false,
        error: errorMessage,
      });
    }
  }, [fetchWithRetry]);

  useEffect(() => {
    fetchFeaturedProjects();
  }, [fetchFeaturedProjects]);

  const displayProjects = useMemo(
    () => featuredProjectsState.projects.slice(0, FEATURED_PROJECTS_DISPLAY),
    [featuredProjectsState.projects]
  );

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
      id="work"
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

        {/* Case Studies */}
        <div className="mt-20">
          <FadeInUp className="mb-12 text-center">
            <p className="text-sm font-medium text-primary">
              SELECTED PROJECTS
            </p>
          </FadeInUp>

          {/* Loading State */}
          {featuredProjectsState.loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {Array.from({ length: FEATURED_PROJECTS_DISPLAY }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="aspect-[5/3] bg-muted rounded-xl animate-pulse"
                    aria-label="Loading project"
                  />
                )
              )}
            </div>
          )}

          {/* Error State */}
          {!featuredProjectsState.loading && featuredProjectsState.error && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Unable to load featured projects at this time.
              </p>
              <Button
                variant="outline"
                onClick={fetchFeaturedProjects}
                disabled={featuredProjectsState.loading}
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Projects Grid */}
          {!featuredProjectsState.loading &&
            !featuredProjectsState.error &&
            displayProjects.length > 0 && (
              <>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={staggerContainer}
                >
                  {displayProjects.map((project) => (
                    <motion.div
                      key={`${project.contentType}-${project.slug}`}
                      variants={staggerItem}
                    >
                      <PostCard item={project} />
                    </motion.div>
                  ))}
                </motion.div>
                <FadeInUp className="mt-10 text-center">
                  <Link href="/posts?type=project">
                    <Button variant="outline" size="lg">
                      View All Projects{" "}
                      <ArrowUpRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </FadeInUp>
              </>
            )}

          {/* Empty State */}
          {!featuredProjectsState.loading &&
            !featuredProjectsState.error &&
            displayProjects.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No featured projects available at this time.</p>
              </div>
            )}
        </div>
      </div>
    </section>
  );
}
