"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, onCheckedChange, ...props }, ref) => {
        return (
            <div className="relative flex items-center h-5 w-5">
                <input
                    type="checkbox"
                    ref={ref}
                    className={cn(
                        "peer h-5 w-5 shrink-0 rounded border border-border/60 bg-muted/20 outline-hidden transition-all focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-primary checked:border-primary appearance-none cursor-pointer",
                        className
                    )}
                    onChange={(e) => onCheckedChange?.(e.target.checked)}
                    {...props}
                />
                <Check className="absolute h-3.5 w-3.5 text-primary-foreground pointer-events-none opacity-0 peer-checked:opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity font-black" />
            </div>
        )
    }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
