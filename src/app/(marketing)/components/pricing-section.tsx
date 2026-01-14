"use client";

import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/ui/card";
import { Button } from "@/ui/button";
import Link from "next/link";
import {
  motion,
  FadeInUp,
  staggerContainer,
  staggerItem,
} from "@/lib/motion";

const engagementOptions = [
  {
    name: "Discovery Sprint",
    price: "$7k",
    duration: "2 weeks",
    description: "Rapid prototyping and validation",
    features: [
      "Technical assessment",
      "Proof of concept",
      "Strategic roadmap",
    ],
    cta: "Get Started",
    href: "mailto:hello@otherwise.llc?subject=Discovery Sprint Inquiry",
  },
  {
    name: "Fractional AI Lead",
    price: "$12k",
    duration: "per month",
    description: "Strategic leadership & execution",
    features: [
      "Technical direction",
      "Team augmentation",
      "Continuous delivery",
    ],
    cta: "Get Started",
    href: "mailto:hello@otherwise.llc?subject=Fractional AI Lead Inquiry",
    featured: true,
  },
  {
    name: "Custom Engagement",
    price: "Custom",
    duration: "Tailored to your needs",
    description: "Full product builds",
    features: [
      "Full product builds",
      "Enterprise solutions",
      "Long-term partnerships",
    ],
    cta: "Contact Us",
    href: "mailto:hello@otherwise.llc?subject=Custom Engagement Inquiry",
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-16 md:py-24 border-t border-gray-300 dark:border-primary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Engagement Options
          </h2>
        </FadeInUp>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {engagementOptions.map((option) => (
            <motion.div key={option.name} variants={staggerItem}>
              <Card
                className={`relative flex flex-col h-full border-gray-300 dark:border-primary/30 transition-shadow duration-300 hover:shadow-lg ${
                  option.featured ? "ring-2 ring-primary shadow-lg" : ""
                }`}
              >
                {option.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{option.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{option.price}</span>
                    <span className="text-muted-foreground ml-2 text-sm">
                      {option.duration}
                    </span>
                  </div>
                  <CardDescription className="mt-2">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 flex-1">
                    {option.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={option.href} className="mt-6 block">
                    <Button
                      className="w-full"
                      variant={option.featured ? "default" : "outline"}
                    >
                      {option.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
