"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Clock, Hash, CornerDownLeft, Command, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchCommandProps {
    isOpen: boolean;
    onClose: () => void;
}

type SearchItem = {
    id: string;
    label: string;
    type: "category" | "level" | "price" | "recent" | "course";
    value: string; // The param value or search term
    group: string;
};

const FILTER_SUGGESTIONS: SearchItem[] = [
    { id: "cat-web", label: "Web Development", type: "category", value: "Web Development", group: "Categories" },
    { id: "cat-data", label: "Data Science", type: "category", value: "Data Science", group: "Categories" },
    { id: "cat-mobile", label: "Mobile App Dev", type: "category", value: "Mobile App Dev", group: "Categories" },
    { id: "lvl-beg", label: "Beginner Friendly", type: "level", value: "Beginner", group: "Filters" },
    { id: "lvl-adv", label: "Advanced Techniques", type: "level", value: "Advanced", group: "Filters" },
    { id: "prc-free", label: "Free Courses", type: "price", value: "Free", group: "Filters" },
];

export function SearchCommand({ isOpen, onClose }: SearchCommandProps) {
    const router = useRouter();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [query, setQuery] = React.useState("");
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [recentSearches, setRecentSearches] = React.useState<string[]>([]);

    const [mounted, setMounted] = React.useState(false);

    // Initialize recent searches and mounting
    React.useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("dokkhotait-recent-searches");
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // Focus input on open
    React.useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
        } else {
            setQuery("");
            setSelectedIndex(0);
        }
    }, [isOpen]);

    // Handle Closing
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    // Filter Items
    const filteredItems = React.useMemo(() => {
        let items: SearchItem[] = [];

        // 1. Add Recent Searches matching query
        if (query.trim() === "") {
            items = recentSearches.map((term, i) => ({
                id: `recent-${i}`,
                label: term,
                type: "recent",
                value: term,
                group: "Recent Searches"
            }));
        }

        // 2. Add Filter Suggestions matching query
        const matches = FILTER_SUGGESTIONS.filter(item =>
            item.label.toLowerCase().includes(query.toLowerCase())
        );
        items = [...items, ...matches];

        // 3. Add current query as a "Search for..." option if not empty
        if (query.trim() !== "") {
            items.unshift({
                id: "search-query",
                label: `Search for "${query}"`,
                type: "course",
                value: query,
                group: "Search"
            });
        }

        return items;
    }, [query, recentSearches]);

    // Update selected index when list changes
    React.useEffect(() => {
        setSelectedIndex(0);
    }, [filteredItems]);

    const handleSelect = (item: SearchItem) => {
        // Save to recent if it's a generic search or a filter
        if (!recentSearches.includes(item.label) && item.type !== "recent") {
            const newRecent = [item.label, ...recentSearches].slice(0, 5);
            setRecentSearches(newRecent);
            localStorage.setItem("dokkhotait-recent-searches", JSON.stringify(newRecent));
        }

        // Navigate
        const params = new URLSearchParams();
        if (item.type === "category") params.set("category", item.value);
        else if (item.type === "level") params.set("levels", item.value);
        else if (item.type === "price") params.set("prices", item.value);
        else params.set("q", item.value); // generic search

        router.push(`/courses?${params.toString()}`);
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (filteredItems[selectedIndex]) {
                handleSelect(filteredItems[selectedIndex]);
            }
        }
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100"
                    />

                    {/* Modal Wrapper */}
                    <div className="fixed inset-0 z-101 flex items-start justify-center pt-[15vh] pointer-events-none px-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="w-full max-w-2xl pointer-events-auto"
                        >
                            <div className="bg-white dark:bg-[#030712] rounded-2xl border border-black/5 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[70vh]">
                                {/* Input Header */}
                                <div className="flex items-center px-5 py-4 border-b border-black/3 dark:border-white/6">
                                    <Search className="w-5 h-5 text-primary mr-3" />
                                    <input
                                        ref={inputRef}
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Search..."
                                        className="flex-1 bg-transparent border-none outline-none text-lg text-foreground placeholder:text-muted-foreground/50 font-medium selection:bg-primary/20"
                                    />
                                    <div className="hidden md:flex items-center gap-2">
                                        <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded bg-muted px-2 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                            ESC
                                        </kbd>
                                    </div>
                                </div>

                                {/* Results List */}
                                <div className="overflow-y-auto p-2 scrollbar-none">
                                    {filteredItems.length === 0 ? (
                                        <div className="py-12 text-center text-muted-foreground">
                                            <p className="text-sm">No results found.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            {filteredItems.map((item, index) => (
                                                <button
                                                    key={item.id}
                                                    onClick={() => handleSelect(item)}
                                                    onMouseEnter={() => setSelectedIndex(index)}
                                                    className={cn(
                                                        "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors duration-200 border border-transparent",
                                                        selectedIndex === index
                                                            ? "bg-primary/5 dark:bg-primary/10 text-primary border-primary/10" // Active State: Theme Color, No Gradient
                                                            : "text-muted-foreground hover:bg-muted/50"
                                                    )}
                                                >
                                                    {/* Icon based on Type */}
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-md flex items-center justify-center shrink-0 border transition-colors",
                                                        selectedIndex === index
                                                            ? "bg-primary text-primary-foreground border-primary" // Solid Primary Icon
                                                            : "bg-muted/50 border-transparent text-muted-foreground"
                                                    )}>
                                                        {item.type === "recent" && <Clock className="w-4 h-4" />}
                                                        {item.type === "category" && <Command className="w-4 h-4" />}
                                                        {item.type === "level" && <Hash className="w-4 h-4" />}
                                                        {item.type === "price" && <Hash className="w-4 h-4" />}
                                                        {item.type === "course" && <Search className="w-4 h-4" />}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <span className={cn("text-sm font-medium truncate transition-colors", selectedIndex === index && "text-primary")}>
                                                                {item.label}
                                                            </span>
                                                            {item.type !== "course" && item.type !== "recent" && (
                                                                <span className={cn(
                                                                    "text-[10px] uppercase tracking-wider opacity-60 ml-2",
                                                                    selectedIndex === index ? "text-primary" : ""
                                                                )}>
                                                                    {item.type}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {selectedIndex === index && (
                                                        <CornerDownLeft className="w-3.5 h-3.5 opacity-100 text-primary" />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Minimal Footer */}
                                {filteredItems.length > 0 && (
                                    <div className="px-5 py-2.5 bg-muted/20 border-t border-black/3 dark:border-white/6 flex items-center justify-between text-[11px] text-muted-foreground">
                                        <span>
                                            Select <strong className="font-medium text-foreground">↵</strong>
                                        </span>
                                        <span>
                                            Navigate <strong className="font-medium text-foreground">↑↓</strong>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
