"use client";

import { ChevronDown, Check } from "lucide-react";
import { ReactNode, useState, useRef, useEffect, createContext, useContext, Children, isValidElement } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

// Context to share state between Select and Options
interface SelectContextType {
    value: string;
    onChange: (value: string) => void;
    setIsOpen: (isOpen: boolean) => void;
}

const SelectContext = createContext<SelectContextType | undefined>(undefined);

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    children: ReactNode;
    className?: string;
    placeholder?: string;
    icon?: ReactNode;
}

export function Select({ value, onChange, children, className, placeholder, icon }: SelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Find selected label from children
    const selectedChild = Children.toArray(children).find((child) => {
        return isValidElement(child) && (child.props as { value?: string }).value === value;
    });
    const selectedLabel = isValidElement(selectedChild) ? (selectedChild.props as { children?: ReactNode }).children : undefined;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <SelectContext.Provider value={{ value, onChange, setIsOpen }}>
            <div className={cn("relative", className)} ref={containerRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-full flex items-center justify-between px-4 py-2.5 rounded-xl",
                        "bg-background/50 border border-border/50",
                        "font-medium transition-all text-sm",
                        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50",
                        "hover:bg-background/80 hover:border-primary/30",
                        icon && "pl-10",
                        isOpen && "border-primary/50 ring-2 ring-primary/20"
                    )}
                >
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                            {icon}
                        </div>
                    )}
                    <span className={cn(!selectedLabel && "text-muted-foreground")}>
                        {selectedLabel || placeholder || "Select option"}
                    </span>
                    <ChevronDown className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform duration-200",
                        isOpen && "rotate-180"
                    )} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 5, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="absolute z-50 w-full mt-2 overflow-hidden rounded-xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-xl shadow-black/10 p-1"
                        >
                            <div className="max-h-60 overflow-y-auto custom-scrollbar flex flex-col gap-0.5">
                                {children}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </SelectContext.Provider>
    );
}

export function SelectOption({ value, children }: { value: string; children: ReactNode }) {
    const context = useContext(SelectContext);

    if (!context) {
        throw new Error("SelectOption must be used within a Select");
    }

    const { value: selectedValue, onChange, setIsOpen } = context;
    const isSelected = selectedValue === value;

    return (
        <button
            type="button"
            onClick={() => {
                onChange(value);
                setIsOpen(false);
            }}
            className={cn(
                "w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-all",
                "hover:bg-primary/10 hover:text-primary",
                isSelected ? "bg-primary/5 text-primary font-medium" : "text-foreground"
            )}
        >
            <span>{children}</span>
            {isSelected && <Check className="w-3.5 h-3.5" />}
        </button>
    );
}
