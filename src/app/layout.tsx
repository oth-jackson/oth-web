import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/features/theme/components/theme-provider";
import { cn } from "@/lib/style/cn";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://otherwise.dev"),
  title: {
    default: "Otherwise",
    template: "%s | Otherwise",
  },
  description: "Otherwise — AI-native strategy, design, and engineering.",
  keywords: [
    "AI",
    "artificial intelligence",
    "software engineering",
    "design",
    "strategy",
    "consulting",
    "AI-native",
    "machine learning",
    "product development",
  ],
  authors: [{ name: "Otherwise" }],
  creator: "Otherwise",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://otherwise.dev",
    siteName: "Otherwise",
    title: "Otherwise",
    description: "Otherwise — AI-native strategy, design, and engineering.",
    images: [
      {
        url: "/images/meta/thumbnail-preview.png",
        width: 1200,
        height: 630,
        alt: "Otherwise",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Otherwise",
    description: "Otherwise — AI-native strategy, design, and engineering.",
    images: ["/images/meta/thumbnail-preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "antialiased flex flex-col min-h-screen font-sans"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
