"use client";

import {
  motion,
  FadeInUp,
  staggerContainer,
  staggerItem,
} from "@/lib/motion";

const steps = [
  {
    number: "01",
    title: "Assess",
    description:
      "Deep dive into your business context, technical landscape, and strategic objectives to identify high-impact opportunities.",
  },
  {
    number: "02",
    title: "Prototype",
    description:
      "Rapid prototyping and iterative development to validate assumptions and refine solutions with real user feedback.",
  },
  {
    number: "03",
    title: "Deploy",
    description:
      "Production-ready implementation with monitoring, optimization, and ongoing support to ensure lasting impact.",
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="py-16 md:py-24 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp className="mb-12 text-center">
          <p className="text-sm font-medium text-primary mb-2">OUR PROCESS</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            How We Work
          </h2>
        </FadeInUp>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              className="text-center"
              variants={staggerItem}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <span className="text-2xl font-bold text-primary">
                  {step.number}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
