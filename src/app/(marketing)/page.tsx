"use client";

import { Navigation } from "@/features/layout/components/navigation";
import { Footer } from "@/features/layout/components/footer";

// Section components
import { HeroSection } from "@/app/(marketing)/components/hero-section";
import { ServicesSection } from "@/app/(marketing)/components/services-section";
import { CapabilitiesSection } from "@/app/(marketing)/components/capabilities-section";
import { TeamSection } from "@/app/(marketing)/components/team-section";
import { AboutSection } from "@/app/(marketing)/components/about-section";
import { ContactSection } from "@/app/(marketing)/components/contact-section";
import { StatsSection } from "@/app/(marketing)/components/stats-section";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <div className="flex-1 space-y-0">
        {/* Hero Section */}
        <HeroSection />

        {/* Stats Section */}
        <StatsSection />

        {/* Capabilities Section */}
        <CapabilitiesSection />

        {/* Engagements Section */}
        <ServicesSection />

        {/* Team Section */}
        <TeamSection />

        {/* Contact Section */}
        <ContactSection />

        {/* About Section */}
        <AboutSection />
      </div>

      <Footer />
    </div>
  );
}
