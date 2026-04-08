import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent bg-clip-padding text-sm font-bold whitespace-nowrap transition-all duration-300 ease-fluid outline-none select-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25 active:scale-95 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "lithium-glow text-on-primary-container shadow-[0_8px_32px_rgba(77,142,255,0.3)] hover:scale-[1.02]",
        outline:
          "border border-outline-variant/30 bg-transparent text-on-surface hover:bg-surface-high aria-expanded:bg-surface-high",
        secondary:
          "border border-outline-variant/30 bg-surface-container text-on-surface hover:bg-surface-high",
        ghost:
          "bg-transparent text-on-surface hover:bg-surface-high aria-expanded:bg-surface-high",
        destructive:
          "rounded-lg border border-destructive bg-transparent px-4 py-2.5 text-destructive hover:bg-destructive/10 focus-visible:ring-destructive/25",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-12 gap-2 px-6 py-4 has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        xs: "h-8 gap-1.5 rounded-lg px-3 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-10 gap-2 rounded-xl px-4 text-sm [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-14 gap-2.5 px-8 py-5 text-sm uppercase tracking-[0.2em]",
        icon: "size-10",
        "icon-xs":
          "size-8 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-9 rounded-xl",
        "icon-lg": "size-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
