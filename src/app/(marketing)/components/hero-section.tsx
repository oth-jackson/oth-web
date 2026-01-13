"use client";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section
      id="hero"
      className="min-h-[72vh] relative bg-background overflow-hidden"
    >
      <div className="hidden lg:block absolute right-0 top-0 h-full w-[40vw] bg-muted">
        <div className="h-full flex items-center justify-center">
          <div className="text-center text-muted-foreground text-sm font-medium">
            Selected Work
          </div>
        </div>
      </div>

      <div className="min-h-[72vh] flex items-center relative">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 md:px-12 lg:px-16 py-20 w-full md:-translate-y-6">
          <div className="max-w-4xl">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground font-semibold mb-8">
              AI‑Native by Design
            </p>
            <h1 className="text-[3.25rem] sm:text-[3.75rem] md:text-[4.75rem] lg:text-[6rem] font-semibold leading-[0.95] tracking-[-0.03em] mb-8">
              Digital Product
              <br />
              Innovation
            </h1>
            <p className="text-lg md:text-xl leading-relaxed text-muted-foreground max-w-2xl mb-12">
              Strategic AI, AR/VR, Telecom, Digital Twin, and Product Consulting,
              Design, and Engineering that bridges cutting‑edge models with
              real‑world business applications.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
