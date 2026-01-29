import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 cursor-pointer disabled:cursor-not-allowed",
    {
        variants: {
            variant: {
                default: "bg-foreground text-background hover:bg-foreground/90 hover:-translate-y-0.5",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
                premium: "bg-card text-foreground border border-border/50 hover:bg-card/80",
            },
            size: {
                default: "h-11 px-6 py-2.5",
                sm: "h-9 rounded-xl px-4",
                lg: "h-12 rounded-2xl px-8 text-base",
                icon: "h-10 w-10",
                responsive: "h-10 px-5 text-sm sm:h-11 sm:px-8 sm:text-base", // Custom size for hero buttons
            },
            glow: {
                true: "shadow-xl shadow-foreground/10",
                false: "shadow-none"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            glow: false,
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, glow, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, glow, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
