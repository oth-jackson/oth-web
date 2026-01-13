import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/style/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border border-black dark:border-transparent shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-none active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:active:shadow-none active:translate-x-[2px] active:translate-y-[2px] dark:active:translate-x-0 dark:active:translate-y-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-[oklch(0.5_0.035_174.09)]",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 border-destructive dark:border-transparent shadow-[3px_3px_0px_0px_rgba(239,68,68,1)] dark:shadow-none active:shadow-[1px_1px_0px_0px_rgba(239,68,68,1)] dark:active:shadow-none",
        outline:
          "bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "border-transparent shadow-none hover:bg-black/5 hover:text-black dark:hover:bg-white/5 dark:hover:text-white active:shadow-none active:translate-x-0 active:translate-y-0",
        link: "border-transparent shadow-none text-primary underline-offset-4 hover:underline active:shadow-none active:translate-x-0 active:translate-y-0",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-sm gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-sm px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
