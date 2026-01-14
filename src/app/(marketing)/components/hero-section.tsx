"use client";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/ui/button";
import Link from "next/link";
import { motion, easing } from "@/lib/motion";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="min-h-[80vh] relative bg-background overflow-hidden"
    >
      {/* Animated background panel */}
      <motion.div
        className="hidden lg:block absolute right-0 top-0 h-full w-[40vw] bg-muted"
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: easing.smoothOut }}
      >
        <motion.div
          className="h-full flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <div className="text-center text-muted-foreground text-sm font-medium">
            Selected Work
          </div>
        </motion.div>
      </motion.div>

      <div className="min-h-[80vh] flex items-center relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full md:-translate-y-6">
          <div className="max-w-4xl">
            <motion.p
              className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easing.smooth }}
            >
              AI‑Native by Design
            </motion.p>

            <h1 className="text-[3.25rem] sm:text-[3.75rem] md:text-[4.75rem] lg:text-[6rem] font-semibold leading-[0.95] tracking-[-0.03em] mb-8">
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: easing.smoothOut }}
              >
                Digital Product
              </motion.span>
              <br />
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: easing.smoothOut }}
              >
                Innovation
              </motion.span>
            </h1>

            <motion.p
              className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: easing.smooth }}
            >
              Strategic AI, AR/VR, Telecom, Digital Twin, and Product Consulting,
              Design, and Engineering that bridges cutting‑edge models with
              real‑world business applications.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: easing.smooth }}
            >
              <Link
                href="https://calendar.app.google/MFTBAhkakDFsNekU7"
                target="_blank"
                rel="noreferrer"
              >
                <Button size="lg">
                  Book a Discovery Call
                  <ArrowUpRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/posts?type=project">
                <Button variant="outline" size="lg">
                  View Projects
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
