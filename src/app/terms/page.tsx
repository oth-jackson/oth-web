import { Navigation } from "@/features/layout/components/navigation";
import { Footer } from "@/features/layout/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Otherwise - the terms and conditions governing use of our website.",
};

export default function TermsOfService() {
  return (
    <main className="flex flex-col min-h-screen bg-background justify-between">
      <Navigation />
      <section className="flex-1 max-w-7xl mx-auto py-2 sm:py-3 md:py-4 lg:py-6 px-4 sm:px-6 md:px-8 lg:px-12">
        <article className="max-w-3xl prose prose-neutral dark:prose-invert">
          <h1>Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: January 2025</p>

          <p>
            Welcome to Otherwise. By accessing or using our website at otherwise.dev, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.
          </p>

          <h2>1. Services</h2>
          <p>
            Otherwise, LLC provides AI-native strategy, design, and engineering services. The information on this website is for general informational purposes and does not constitute a binding offer or contract for services.
          </p>

          <h2>2. Intellectual Property</h2>
          <p>
            All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of Otherwise, LLC or its content suppliers and is protected by intellectual property laws.
          </p>
          <p>
            You may not reproduce, distribute, modify, or create derivative works from any content on this website without our prior written consent.
          </p>

          <h2>3. User Conduct</h2>
          <p>When using our website, you agree not to:</p>
          <ul>
            <li>Use the website for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to any part of the website</li>
            <li>Interfere with or disrupt the website or servers</li>
            <li>Transmit any malicious code or harmful content</li>
            <li>Collect or harvest any information from the website without permission</li>
          </ul>

          <h2>4. Disclaimer of Warranties</h2>
          <p>
            This website is provided &quot;as is&quot; and &quot;as available&quot; without any warranties of any kind, either express or implied. We do not warrant that the website will be uninterrupted, error-free, or free of viruses or other harmful components.
          </p>

          <h2>5. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Otherwise, LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the website.
          </p>

          <h2>6. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Otherwise, LLC and its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the website or violation of these terms.
          </p>

          <h2>7. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for the content or practices of these external sites and encourage you to review their terms and privacy policies.
          </p>

          <h2>8. Modifications</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to this page. Your continued use of the website after any changes constitutes acceptance of the new terms.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These Terms of Service shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
          </p>

          <h2>10. Severability</h2>
          <p>
            If any provision of these terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <p>
            <strong>Email:</strong> contact@otherwise.dev
          </p>
        </article>
      </section>
      <Footer />
    </main>
  );
}
