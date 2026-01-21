import Image from "next/image";

export function Footer() {
  return (
    <footer className="w-full py-8 border-t border-gray-300 dark:border-primary/30">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Logo and Name */}
        <div className="flex items-center gap-3">
          <Image
            src="/otherwise-logo.svg"
            alt="Otherwise Logo"
            width={28}
            height={28}
            className="w-7 h-7 dark:invert"
          />
          <span className="font-medium">Otherwise</span>
        </div>

        {/* Copyright */}
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Otherwise, LLC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
