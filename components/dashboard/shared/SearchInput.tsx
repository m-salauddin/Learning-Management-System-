"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    debounceMs?: number;
    disabled?: boolean;
    className?: string;
    isSearching?: boolean;
}

/**
 * Optimized search input component with:
 * - Debounced search (configurable delay)
 * - Clear button when text is present
 * - Loading indicator during search
 * - Keyboard shortcuts (Escape to clear)
 */
export function SearchInput({
    value,
    onChange,
    placeholder = "Search...",
    debounceMs = 300,
    disabled = false,
    className,
    isSearching = false
}: SearchInputProps) {
    // Local state for immediate UI feedback
    const [localValue, setLocalValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Sync local value when external value changes (e.g., clear filters)
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    // Debounced onChange handler
    const debouncedOnChange = useCallback(
        (newValue: string) => {
            // Clear any pending debounce
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            // Set up new debounce timer
            debounceTimerRef.current = setTimeout(() => {
                onChange(newValue);
            }, debounceMs);
        },
        [onChange, debounceMs]
    );

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        debouncedOnChange(newValue);
    };

    // Handle clear
    const handleClear = () => {
        setLocalValue("");
        onChange(""); // Immediately trigger onChange for clear action
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        inputRef.current?.focus();
    };

    // Handle keyboard shortcuts
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape" && localValue) {
            e.preventDefault();
            handleClear();
        }
    };

    const showClearButton = localValue.length > 0;
    const showLoader = isSearching && localValue.length > 0;

    return (
        <div className={cn("relative group", className)}>
            {/* Search Icon */}
            <Search
                className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 pointer-events-none",
                    disabled
                        ? "text-input-dark-text/40"
                        : "text-input-dark-text group-focus-within:text-foreground"
                )}
            />

            {/* Input */}
            <input
                ref={inputRef}
                type="text"
                name="search"
                autoComplete="off"
                data-lpignore="true" // Help ignore LastPass
                value={localValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                    "w-full pl-10 pr-10 py-2.5 rounded-xl",
                    // Dark input styling
                    "bg-input-dark border border-input-dark-border",
                    "text-foreground text-sm placeholder:text-input-dark-text",
                    // Focus state with glow
                    "focus:shadow-[0_0_0_3px_var(--input-dark-glow)] focus:border-input-dark-border",
                    "outline-none transition-all duration-200",
                    disabled && "cursor-not-allowed opacity-50"
                )}
            />

            {/* Right side: Clear button or Loading indicator */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {showLoader && (
                    <Loader2 className="w-4 h-4 text-input-dark-text animate-spin" />
                )}

                {showClearButton && !disabled && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className={cn(
                            "p-0.5 rounded-md transition-all duration-200",
                            "text-input-dark-text hover:text-foreground",
                            "hover:bg-input-dark-hover focus:outline-none focus:shadow-[0_0_0_2px_var(--input-dark-glow)]"
                        )}
                        title="Clear search (Esc)"
                        aria-label="Clear search"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
