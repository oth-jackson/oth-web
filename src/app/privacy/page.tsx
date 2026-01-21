import { Navigation } from "@/features/layout/components/navigation";
import { Footer } from "@/features/layout/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Otherwise - how we collect, use, and protect your data.",
};

export default function PrivacyPolicy() {
  return (
    <main className="flex flex-col min-h-screen bg-background justify-between">
      <Navigation />
      <section className="flex-1 max-w-7xl mx-auto py-2 sm:py-3 md:py-4 lg:py-6 px-4 sm:px-6 md:px-8 lg:px-12">
        <article className="max-w-3xl prose prose-neutral dark:prose-invert">
          <h1>Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: January 2025</p>

          <p>
            Otherwise, LLC (&quot;Otherwise,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website at otherwise.dev.
          </p>

          <h2>Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul>
            <li>
              <strong>Contact Information:</strong> When you use our contact form, we collect your name, email address, and any message content you provide.
            </li>
            <li>
              <strong>Usage Data:</strong> We may collect information about how you access and use our website, including your IP address, browser type, pages visited, and time spent on pages.
            </li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Respond to your inquiries and communicate with you</li>
            <li>Improve our website and services</li>
            <li>Analyze website usage and trends</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>Data Sharing</h2>
          <p>
            We do not sell your personal information. We may share your data with:
          </p>
          <ul>
            <li>
              <strong>Service Providers:</strong> Third-party services that help us operate our website (e.g., hosting, analytics)
            </li>
            <li>
              <strong>Legal Requirements:</strong> When required by law or to protect our rights
            </li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h2>Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability</li>
          </ul>

          <h2>Cookies</h2>
          <p>
            Our website may use cookies and similar technologies to enhance your experience. You can control cookie settings through your browser preferences.
          </p>

          <h2>Third-Party Links</h2>
          <p>
            Our website may contain links to third-party sites. We are not responsible for the privacy practices of these external sites.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our data practices, please contact us at:
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
