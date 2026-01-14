"use client";

import { MapPin, Mail } from "lucide-react";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
  FieldDescription,
} from "@/ui/field";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";
import Link from "next/link";
import { CalendarModal } from "@/components/calendar-modal";
import { FadeInUp, ScaleIn } from "@/lib/motion";

export function ContactSection() {
  return (
    <section id="contact" className="py-16 md:py-24 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <FadeInUp className="text-center lg:text-left">
            <p className="text-sm font-medium text-primary mb-2">GET IN TOUCH</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Let&apos;s Build Something Together
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Ready to transform your AI vision into reality? Schedule a discovery
              call or send us a message to discuss your project.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-10">
              <CalendarModal>
                <Button size="lg">Book a Discovery Call</Button>
              </CalendarModal>
              <Link href="mailto:contact@otherwise.dev">
                <Button variant="outline" size="lg">
                  <Mail className="h-5 w-5" />
                  Email Us
                </Button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Austin, Texas</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <Link
                  href="mailto:contact@otherwise.dev"
                  className="text-sm hover:text-foreground transition-colors"
                >
                  contact@otherwise.dev
                </Link>
              </div>
            </div>
          </FadeInUp>

          <ScaleIn>
            <Card className="border-gray-300 dark:border-primary/30">
              <CardContent className="pt-0">
                <div className="mb-6">
                  <h3 className="mt-2 text-xl font-semibold">Project inquiry</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Share a few details and we&apos;ll follow up shortly.
                  </p>
                </div>
                <form
                action="mailto:contact@otherwise.dev"
                  method="post"
                  encType="text/plain"
                  className="space-y-6"
                >
                  <FieldSet>
                    <FieldLegend className="sr-only">Contact form</FieldLegend>
                    <FieldGroup className="@container/field-group flex flex-col gap-6">
                      <Field>
                        <FieldLabel htmlFor="name">Full name</FieldLabel>
                        <Input id="name" name="name" placeholder="Jane Doe" />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@company.com"
                          required
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="company">Company</FieldLabel>
                        <Input
                          id="company"
                          name="company"
                          placeholder="Amco"
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="message">Project details</FieldLabel>
                        <Textarea
                          id="message"
                          name="message"
                          rows={5}
                          placeholder="Tell us about your goals, timeline, and scope."
                          required
                        />
                        <FieldDescription>
                          We typically respond within two business days.
                        </FieldDescription>
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </ScaleIn>
        </div>
      </div>
    </section>
  );
}
