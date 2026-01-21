import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-8 border-t border-gray-300 dark:border-primary/30">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Logo and Name */}
        <div className="flex items-center gap-3">
          <Image
            src="/logos/otherwise/oth-logo.svg"
            alt="Otherwise Logo"
            width={28}
            height={28}
            className="w-7 h-7 invert dark:invert-0"
          />
          <span className="font-medium">Otherwise</span>
        </div>

        {/* Links and Copyright */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <span>© {new Date().getFullYear()} Otherwise, LLC. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
