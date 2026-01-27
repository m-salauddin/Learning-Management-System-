"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";

interface AnimatedCheckboxProps {
    id: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    label?: React.ReactNode;
    className?: string;
}

export function AnimatedCheckbox({
    id,
    checked = false,
    onChange,
    label,
    className = "",
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
        // Prevent toggle if clicking a link
        if ((e.target as HTMLElement).closest('a')) {
            return;
        }
        e.preventDefault(); // Prevent default label behavior to avoid double toggles if htmlFor is used
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
                className="relative shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md"
            >
                <motion.div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors duration-200 ${isChecked
                        ? "bg-primary border-primary"
                        : "bg-transparent border-muted-foreground/40 hover:border-primary/60"
                        }`}
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

                {/* Ripple effect on click */}
                <motion.div
                    className="absolute inset-0 rounded-md bg-primary/20"
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

// Controlled version for use with react-hook-form
interface ControlledCheckboxProps extends Omit<AnimatedCheckboxProps, 'checked' | 'onChange'> {
    value?: boolean;
    onValueChange?: (checked: boolean) => void;
}

export const ControlledAnimatedCheckbox = React.forwardRef<HTMLInputElement, ControlledCheckboxProps & {
    onChange?: (e: { target: { value: boolean } }) => void
}>(({ value, onChange, onValueChange, ...props }, ref) => {
    // Hidden input for form compatibility
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
