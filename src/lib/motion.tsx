"use client";

import { motion, type Variants, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

// Easing curves for premium feel
export const easing = {
  smooth: [0.25, 0.1, 0.25, 1],
  smoothOut: [0, 0, 0.2, 1],
  smoothIn: [0.4, 0, 1, 1],
  spring: [0.175, 0.885, 0.32, 1.275],
} as const;

// Animation variants for reuse
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: easing.smooth }
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easing.smooth }
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easing.smooth }
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: easing.smooth }
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: easing.smooth }
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easing.smooth }
  },
};

export const slideInUp: Variants = {
  hidden: { y: 60, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: easing.smoothOut }
  },
};

// Stagger container for children animations
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// Stagger item for use with containers
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easing.smooth }
  },
};

// Card hover effect
export const cardHover: Variants = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.3, ease: easing.smooth }
  },
};

// Button hover effect
export const buttonHover: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.03,
    transition: { duration: 0.2, ease: easing.smooth }
  },
  tap: { scale: 0.98 },
};

// Text reveal (character by character)
export const textReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.4,
      ease: easing.smooth,
    },
  }),
};

// Line reveal (for underlines or borders)
export const lineReveal: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, ease: easing.smooth }
  },
};

// Blur reveal
export const blurReveal: Variants = {
  hidden: { opacity: 0, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: easing.smooth }
  },
};

// Float animation (for decorative elements)
export const float: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-8, 8, -8],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Pulse animation
export const pulse: Variants = {
  initial: { scale: 1, opacity: 1 },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Badge pop-in animation
export const badgePopIn: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easing.spring
    }
  },
};

// Reusable motion components

interface MotionDivProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
}

interface MotionSectionProps extends HTMLMotionProps<"section"> {
  children: ReactNode;
}

// Fade In component
export const FadeIn = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeIn}
      {...props}
    >
      {children}
    </motion.div>
  )
);
FadeIn.displayName = "FadeIn";

// Fade In Up component
export const FadeInUp = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      {...props}
    >
      {children}
    </motion.div>
  )
);
FadeInUp.displayName = "FadeInUp";

// Stagger wrapper component
export const StaggerWrapper = forwardRef<HTMLDivElement, MotionDivProps & { variant?: "default" | "fast" | "slow" }>(
  ({ children, variant = "default", ...props }, ref) => {
    const variants = {
      default: staggerContainer,
      fast: staggerContainerFast,
      slow: staggerContainerSlow,
    };

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={variants[variant]}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
StaggerWrapper.displayName = "StaggerWrapper";

// Stagger item component
export const StaggerItem = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, ...props }, ref) => (
    <motion.div ref={ref} variants={staggerItem} {...props}>
      {children}
    </motion.div>
  )
);
StaggerItem.displayName = "StaggerItem";

// Scale In component
export const ScaleIn = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={scaleIn}
      {...props}
    >
      {children}
    </motion.div>
  )
);
ScaleIn.displayName = "ScaleIn";

// Slide In Up component
export const SlideInUp = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={slideInUp}
      {...props}
    >
      {children}
    </motion.div>
  )
);
SlideInUp.displayName = "SlideInUp";

// Section wrapper with animation
export const AnimatedSection = forwardRef<HTMLElement, MotionSectionProps>(
  ({ children, ...props }, ref) => (
    <motion.section
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeIn}
      {...props}
    >
      {children}
    </motion.section>
  )
);
AnimatedSection.displayName = "AnimatedSection";

// Hover card wrapper
export const HoverCard = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={cardHover}
      {...props}
    >
      {children}
    </motion.div>
  )
);
HoverCard.displayName = "HoverCard";

// Blur reveal component
export const BlurReveal = forwardRef<HTMLDivElement, MotionDivProps>(
  ({ children, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={blurReveal}
      {...props}
    >
      {children}
    </motion.div>
  )
);
BlurReveal.displayName = "BlurReveal";

// Re-export motion for direct use
export { motion };
