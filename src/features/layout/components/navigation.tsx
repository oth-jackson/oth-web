"use client";

import Link from "next/link";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/ui/navigation-menu";
import { ThemeToggle } from "@/features/theme/components/theme-toggle";
import { MobileNav } from "@/features/layout/components/mobile-nav";
import { LogIn, Edit } from "lucide-react";
import { Button } from "@/ui/button";
import { useSession } from "@/lib/auth-client";
import { Avatar, AvatarImage, AvatarFallback } from "@/ui/avatar";

export function Navigation() {
  const { data: session, isPending } = useSession();
  const isAuthenticated = !!session && !isPending;

  // Custom navigation link style for inset blocky appearance
  const navLinkStyle =
    "relative inline-flex h-12 items-center justify-center bg-background px-6 text-sm font-medium transition-all duration-200 hover:bg-black/5 hover:text-black hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:right-0 hover:after:h-1 hover:after:bg-primary dark:hover:bg-white/10 dark:hover:text-white focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none active:scale-[0.98] shadow-inner";

  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b border-gray-300 dark:border-primary/30">
      <div className="flex h-12 justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logos/otherwise/oth-logo.svg"
            alt="Otherwise Logo"
            width={28}
            height={28}
            className="w-7 h-7 invert dark:invert-0"
          />
          <span className="font-medium">Otherwise</span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList className="bg-muted/30 rounded-none border border-gray-300 dark:border-primary/30 shadow-inner gap-0 h-12 flex">
                <NavigationMenuItem>
                  <Link href="/posts?type=project" className={navLinkStyle}>
                    Projects
                  </Link>
                </NavigationMenuItem>
                <div className="w-px h-12 bg-gray-300 dark:bg-primary/30"></div>
                <NavigationMenuItem>
                  <Link href="/posts?type=blog" className={navLinkStyle}>
                    Blog
                  </Link>
                </NavigationMenuItem>
                <div className="w-px h-12 bg-gray-300 dark:bg-primary/30"></div>
                <NavigationMenuItem>
                  <Link href="/#about" className={navLinkStyle}>
                    About
                  </Link>
                </NavigationMenuItem>
                <div className="w-px h-12 bg-gray-300 dark:bg-primary/30"></div>
                <NavigationMenuItem>
                  <Link href="/#contact" className={navLinkStyle}>
                    Contact
                  </Link>
                </NavigationMenuItem>

                {/* Show Admin link only when logged in */}
                {isAuthenticated && (
                  <>
                    <div className="w-px h-12 bg-gray-300 dark:bg-primary/30"></div>
                    <NavigationMenuItem>
                      <Link href="/content" className={navLinkStyle}>
                        Admin
                      </Link>
                    </NavigationMenuItem>
                  </>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {isAuthenticated && session?.user ? (
              <>
                {/* Editor icon for small screens */}
                <Link href="/content" className="md:hidden">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Edit className="h-5 w-5" />
                    <span className="sr-only">Content Management</span>
                  </Button>
                </Link>

                {/* Avatar button linking to profile/login page */}
                <Link href="/login">
                  <Avatar className="h-9 w-9 cursor-pointer">
                    <AvatarImage
                      src={session.user.image ?? undefined}
                      alt={session.user.name ?? session.user.email ?? "User"}
                    />
                    <AvatarFallback>
                      {session.user.name?.[0]?.toUpperCase() ||
                        session.user.email?.[0]?.toUpperCase() ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <LogIn className="h-5 w-5" />
                  <span className="sr-only">Login</span>
                </Button>
              </Link>
            )}

            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
