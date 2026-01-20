"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/ui/button";
import Link from "next/link";
import { Navigation } from "@/features/layout/components/navigation";
import { Footer } from "@/features/layout/components/footer";
import type { Post } from "@/db";
import { PostCard } from "@/features/cms/components/PostCard";
import {
  motion,
  FadeInUp,
  staggerContainer,
  staggerItem,
} from "@/lib/motion";

// New section components
import { HeroSection } from "@/app/(marketing)/components/hero-section";
import { ServicesSection } from "@/app/(marketing)/components/services-section";
import { CapabilitiesSection } from "@/app/(marketing)/components/capabilities-section";
import { TeamSection } from "@/app/(marketing)/components/team-section";
import { AboutSection } from "@/app/(marketing)/components/about-section";
import { ContactSection } from "@/app/(marketing)/components/contact-section";

// Types for better type safety
interface FeaturedProjectsState {
  projects: Post[];
  loading: boolean;
  error: string | null;
}

// Constants
const MAX_FEATURED_PROJECTS = 6;
const FEATURED_PROJECTS_DISPLAY = 6;
const API_RETRY_ATTEMPTS = 3;
const API_RETRY_DELAY = 1000; // ms

export default function Home() {
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

  // Optimized featured projects fetching with better error handling
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

  // Memoized featured projects for display
  const displayProjects = useMemo(
    () => featuredProjectsState.projects.slice(0, FEATURED_PROJECTS_DISPLAY),
    [featuredProjectsState.projects]
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <div className="flex-1 space-y-0">
        {/* Hero Section */}
        <HeroSection />

        {/* Capabilities Section */}
        <CapabilitiesSection />

        {/* Team Section */}
        <TeamSection />

        {/* Engagements Section */}
        <ServicesSection />

        {/* Featured Projects Section */}
        <section
          id="work"
          className="py-16 md:py-24 border-t border-gray-300 dark:border-primary/30"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeInUp className="mb-12 text-center">
              <p className="text-sm font-medium text-primary mb-2">
                SELECTED PROJECTS
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Case Studies
              </h2>
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
        </section>

        {/* Contact Section */}
        <ContactSection />

        {/* About Section */}
        <AboutSection />
      </div>

      <Footer />
    </div>
  );
}
