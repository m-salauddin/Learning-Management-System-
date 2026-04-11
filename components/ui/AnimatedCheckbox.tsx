"use client";
import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
interface AnimatedCheckboxProps {
    id: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    label?: React.ReactNode;
    className?: string;
    variant?: "square" | "circle";
    activeColor?: string;
}
export function AnimatedCheckbox({
    id,
    checked = false,
    onChange,
    label,
    className = "",
    variant = "square",
    activeColor,
}: AnimatedCheckboxProps) {
    const [isChecked, setIsChecked] = React.useState(checked);
    React.useEffect(() => {
        setIsChecked(checked);
    }, [checked]);
    const handleToggle = () => {
        const newValue = !isChecked;
        setIsChecked(newValue);
        onChange?.(newValue);
    };
    const handleLabelClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('a')) {
            return;
        }
        e.preventDefault();
        handleToggle();
    };
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <button
                type="button"
                role="checkbox"
                aria-checked={isChecked}
                id={id}
                onClick={handleToggle}
                className={cn(
                    "relative shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer",
                    variant === "circle" ? "rounded-full" : "rounded-md"
                )}
            >
                <motion.div
                    className={cn(
                        "w-5 h-5 border-2 flex items-center justify-center transition-colors duration-200 pointer-events-none",
                        variant === "circle" ? "rounded-full" : "rounded-md",
                        isChecked
                            ? (!activeColor && "bg-primary border-primary")
                            : "bg-transparent border-muted-foreground/40 hover:border-primary/60"
                    )}
                    style={isChecked && activeColor ? { 
                        backgroundColor: activeColor, 
                        borderColor: activeColor,
                        boxShadow: `0 4px 12px ${activeColor}40`
                    } : {}}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    <AnimatePresence mode="wait">
                        {isChecked && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                }}
                            >
                                <Check className="w-3.5 h-3.5 text-primary-foreground stroke-3" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
                <motion.div
                    className="absolute inset-0 rounded-md bg-primary/20 pointer-events-none"
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 0, opacity: 0 }}
                    whileTap={{ scale: 2.5, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                />
            </button>
            {label && (
                <div
                    onClick={handleLabelClick}
                    className="text-sm text-muted-foreground cursor-pointer select-none leading-tight"
                >
                    {label}
                </div>
            )}
        </div>
    );
}
interface ControlledCheckboxProps extends Omit<AnimatedCheckboxProps, 'checked' | 'onChange'> {
    value?: boolean;
    onValueChange?: (checked: boolean) => void;
}
export const ControlledAnimatedCheckbox = React.forwardRef<HTMLInputElement, ControlledCheckboxProps & {
    onChange?: (e: { target: { value: boolean } }) => void
}>(({ value, onChange, onValueChange, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => inputRef.current!);
    const handleChange = (checked: boolean) => {
        if (inputRef.current) {
            inputRef.current.checked = checked;
        }
        onChange?.({ target: { value: checked } });
        onValueChange?.(checked);
    };
    return (
        <>
            <input
                ref={inputRef}
                type="checkbox"
                className="sr-only"
                checked={value}
                onChange={(e) => handleChange(e.target.checked)}
            />
            <AnimatedCheckbox
                {...props}
                checked={value}
                onChange={handleChange}
            />
        </>
    );
});
ControlledAnimatedCheckbox.displayName = "ControlledAnimatedCheckbox";
