"use client";

import React, { useRef } from "react";
import { motion, FadeInUp, easing } from "@/lib/motion";
import { useScroll, useTransform, type MotionValue } from "framer-motion";

const services = [
  {
    title: "AI Strategy, Products & Agents",
    description:
      "Readiness assessments, roadmaps, full-stack MVP development, and intelligent agent systems with LLM integration, MCP servers, and orchestration layers.",
    image: "/images/services/ai-strategy.jpg",
  },
  {
    title: "XR & Spatial Computing",
    description:
      "AR/VR development, spatial UI design, digital twins, and WebXR experiences across HoloLens, Quest, and browser-based platforms.",
    image: "/images/services/xr-spatial.jpg",
  },
  {
    title: "UI/UX, Brand & Visual Design",
    description:
      "Scalable design systems, component libraries, brand identity, and AI-enabled design workflows.",
    image: "/images/services/design-ux.jpg",
  },
  {
    title: "Rapid Prototyping",
    description:
      "Fast-turnaround proof-of-concepts for emerging tech including AI, XR, BCI, and IoT.",
    image: "/images/services/prototyping.jpg",
  },
  {
    title: "5G/Telecom & Edge Computing",
    description:
      "Network-aware applications, private 5G integration, and low-latency systems for real-time XR and mission-critical use cases.",
    image: "/images/services/telecom-edge.jpg",
  },
];

function ServiceRow({
  service,
  index,
}: {
  service: (typeof services)[number];
  index: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const isLast = index === services.length - 1;

  // Full lifecycle: entry through exit
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start end", "end start"],
  });

  // Blur reveal (0–0.25 of range = entering viewport)
  const filterBlur = useTransform(scrollYProgress, [0, 0.25], [6, 0]);
  const filter = useTransform(filterBlur, (v) => `blur(${v}px)`);

  // Fade in and out
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.5, 0.7], [0, 1, 1, 0.3]);

  // Scale up into focus, ease back out
  const scale = useTransform(scrollYProgress, [0, 0.15, 0.5, 0.7], [0.96, 1, 1, 0.98]);

  // Description reveals with the row
  const descOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);

  // Highlight sweep
  const highlightClip = useTransform(scrollYProgress, [0.2, 0.45], [100, 0]);
  const clipPath = useTransform(highlightClip, (v) => `inset(0 ${v}% 0 0)`);

  return (
    <motion.div
      ref={rowRef}
      className="relative origin-left"
      style={{ opacity, filter, scale }}
    >
      <div>
        <div className="min-w-0">
          <h3 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight relative inline-block">
            <span className="text-gray-300 dark:text-[#a0e8dd]">{service.title}</span>
            <motion.span
              className="absolute inset-0 bg-[#a0e8dd] dark:bg-[#3dbfaf]"
              style={{ clipPath }}
              aria-hidden
            >
              <span className="text-black">{service.title}</span>
            </motion.span>
          </h3>
          <motion.p
            className="text-base md:text-lg text-muted-foreground mt-2 max-w-xl leading-relaxed"
            style={{ opacity: descOpacity }}
          >
            {service.description}
          </motion.p>
        </div>
      </div>

      {!isLast && <div className="h-8 md:h-10" />}
    </motion.div>
  );
}

const stripImages = [
  "/images/services/ai.jpg",
  "/images/services/arvr.jpg",
  "/images/services/uiux.jpg",
  "/images/services/rapid.jpg",
  "/images/services/telecom.jpg",
];

function ParallaxStrip({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const count = stripImages.length;
  const y = useTransform(scrollProgress, [0.3, 0.8], ["8%", `-${(count - 1) * 12}%`]);

  return (
    <motion.div
      className="absolute top-0 left-0 w-full flex flex-col gap-4 p-4"
      style={{ y }}
    >
      {stripImages.map((src, i) => (
        <div
          key={i}
          className="w-full shrink-0 rounded-xl overflow-hidden"
          style={{ aspectRatio: "1/1" }}
        >
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ))}
    </motion.div>
  );
}

export function CapabilitiesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={sectionRef}
      className="border-t border-gray-300 dark:border-primary/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-12 lg:gap-16">
        {/* Left: service list */}
        <div className="flex-1 py-16 md:py-24">
          <FadeInUp className="mb-14">
            <p className="text-sm font-medium text-primary uppercase tracking-[0.18em] mb-2">
              WHAT WE PROVIDE
            </p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Our Services
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              End-to-end services across strategy, design, and engineering.
            </p>
          </FadeInUp>

          <div className="max-w-2xl">
            {services.map((service, index) => (
              <ServiceRow
                key={service.title}
                service={service}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Right: image panel flush top/bottom (hidden on mobile) */}
        <div className="hidden lg:block w-[400px] xl:w-[480px] shrink-0 relative overflow-hidden -my-0">
          <ParallaxStrip scrollProgress={scrollYProgress} />
          {/* Top fade */}
          <div className="absolute inset-x-0 top-0 h-56 bg-linear-to-b from-background to-transparent pointer-events-none z-10" />
          {/* Bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-background to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </section>
  );
}
