"use client";

import * as React from "react";
import Link from "next/link";
import { LogIn, Menu, User, X } from "lucide-react";
import { Button } from "@/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/ui/sheet";
import { cn } from "@/lib/style/cn";
import { useSession } from "@/lib/auth-client";

// Base routes that are always shown
const baseRoutes = [
  { href: "/posts?type=project", label: "Projects" },
  { href: "/posts?type=blog", label: "Blog" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const { data: session, isPending } = useSession();
  const isAuthenticated = !!session && !isPending;

  // Add admin route if authenticated
  const routes = React.useMemo(() => {
    if (isAuthenticated) {
      return [...baseRoutes, { href: "/content", label: "Admin" }];
    }
    return baseRoutes;
  }, [isAuthenticated]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col min-h-screen">
        <SheetHeader>
          <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-6 flex-grow overflow-y-auto pt-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-lg font-medium transition-colors hover:text-primary rounded-md hover:bg-accent px-3"
            >
              {route.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto p-6 space-y-4">
          {isAuthenticated && session?.user ? (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-[oklch(0.5_0.035_174.09)] transition-colors w-full h-10"
              )}
            >
              <User className="h-5 w-5" />
              Account
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-[oklch(0.5_0.035_174.09)] transition-colors w-full h-10"
              )}
            >
              <LogIn className="h-5 w-5" />
              Login
            </Link>
          )}

          <SheetClose asChild>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 py-3"
            >
              <X className="h-5 w-5" />
              Close
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
