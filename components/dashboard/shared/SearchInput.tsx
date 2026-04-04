"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    debounceMs?: number;
    disabled?: boolean;
    className?: string;
    isSearching?: boolean;
}
export function SearchInput({
    value,
    onChange,
    placeholder = "Search...",
    debounceMs = 300,
    disabled = false,
    className,
    isSearching = false
}: SearchInputProps) {
    const [localValue, setLocalValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        setLocalValue(value);
    }, [value]);
    const debouncedOnChange = useCallback(
        (newValue: string) => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            debounceTimerRef.current = setTimeout(() => {
                onChange(newValue);
            }, debounceMs);
        },
        [onChange, debounceMs]
    );
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        debouncedOnChange(newValue);
    };
    const handleClear = () => {
        setLocalValue("");
        onChange("");
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        inputRef.current?.focus();
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape" && localValue) {
            e.preventDefault();
            handleClear();
        }
    };
    const showClearButton = localValue.length > 0;
    return (
        <div className={cn("relative group", className)}>
            {}
            <Search
                className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 pointer-events-none",
                    disabled
                        ? "text-input-dark-text/40"
                        : "text-input-dark-text group-focus-within:text-foreground"
                )}
            />
            {}
            <input
                ref={inputRef}
                type="text"
                name="search"
                autoComplete="off"
                data-lpignore="true"
                value={localValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                    "w-full pl-10 pr-10 py-2.5 rounded-xl",
                    "bg-input-dark border border-input-dark-border",
                    "text-foreground text-sm placeholder:text-input-dark-text",
                    "focus:shadow-[0_0_0_3px_var(--input-dark-glow)] focus:border-input-dark-border",
                    "outline-none transition-all duration-200",
                    disabled && "cursor-not-allowed opacity-50"
                )}
            />
            {}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                <AnimatePresence>
                    {showClearButton && !disabled && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            type="button"
                            onClick={handleClear}
                            className={cn(
                                "p-1.5 rounded-lg transition-all",
                                "bg-foreground/5 text-input-dark-text hover:text-foreground",
                                "hover:bg-foreground/10 focus:outline-none ring-1 ring-input-dark-border/50",
                                "flex items-center justify-center"
                            )}
                            title="Clear search (Esc)"
                            aria-label="Clear search"
                        >
                            <X className="w-3.5 h-3.5" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
