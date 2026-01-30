"use client";

import Link from "next/link";
import { useState, useMemo, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "motion/react";
import { ArrowLeft, Search, SlidersHorizontal, X, ChevronDown, Check, Filter, LayoutGrid, Grip, AlignJustify, FileQuestion, ChevronLeft, ChevronRight } from "lucide-react";
import { fadeInUp } from "@/lib/motion";
import { Navbar } from "@/components/Navbar";
import { AnimatedCheckbox } from "@/components/ui/AnimatedCheckbox";
import { CourseCard } from "@/components/CourseCard";

// Enhanced Course Data
import { COURSES as courses } from "@/data/courses";

const CATEGORIES = ["All Topics", "Web Development", "Data Science", "Mobile Development", "Cyber Security", "Cloud Computing", "Design"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const TYPES = ["Live", "Recorded", "Career Path"];
const PRICES = ["Paid", "Free"];
const ITEMS_PER_PAGE = 9;

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            type: "spring",
            stiffness: 180,
            damping: 20,
            mass: 0.8,
        }
    },
    exit: {
        opacity: 0,
        y: 20,
        scale: 0.9,
        filter: "blur(10px)",
        transition: {
            duration: 0.2,
            ease: "easeIn"
        }
    }
};

function CoursesContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();


    const [searchInput, setSearchInput] = useState("");

    const [selectedCategory, setSelectedCategory] = useState("All Topics");
    const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [gridCols, setGridCols] = useState<1 | 2 | 3>(3);
    const [currentPage, setCurrentPage] = useState(1);
    const lastPushedSearch = useRef("");
    const [mounted, setMounted] = useState(false);
    const categoryContainerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    useEffect(() => {
        const checkScroll = () => {
            if (categoryContainerRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = categoryContainerRef.current;
                setCanScrollLeft(scrollLeft > 0);
                // Use a small buffer (1px) to avoid precision issues
                setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1);
            }
        };

        checkScroll();

        const container = categoryContainerRef.current;
        if (container) {
            const observer = new ResizeObserver(() => checkScroll());
            observer.observe(container);
            container.addEventListener('scroll', checkScroll);
            return () => {
                observer.disconnect();
                container.removeEventListener('scroll', checkScroll);
            };
        }
    }, [mounted]);

    const scroll = (direction: 'left' | 'right') => {
        if (categoryContainerRef.current) {
            const scrollAmount = 300;
            const newScrollLeft = direction === 'left'
                ? categoryContainerRef.current.scrollLeft - scrollAmount
                : categoryContainerRef.current.scrollLeft + scrollAmount;

            categoryContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };


    useEffect(() => {
        const q = searchParams.get("q") || "";
        const category = searchParams.get("category") || "All Topics";
        const levels = searchParams.get("levels")?.split(",").filter(Boolean) || [];
        const types = searchParams.get("types")?.split(",").filter(Boolean) || [];
        const prices = searchParams.get("prices")?.split(",").filter(Boolean) || [];
        const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;

        if (q !== lastPushedSearch.current) {
            setSearchInput(q);
        }

        lastPushedSearch.current = q;

        setSelectedCategory(category);
        setSelectedLevels(levels);
        setSelectedTypes(types);
        setSelectedPrices(prices);
        setCurrentPage(page);
        setMounted(true);
    }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps


    const updateUrl = (
        term: string,
        category: string,
        levels: string[],
        types: string[],
        prices: string[],
        page: number,
        replace: boolean = false
    ) => {
        lastPushedSearch.current = term;
        const params = new URLSearchParams();
        if (term) params.set("q", term);
        if (category && category !== "All Topics") params.set("category", category);
        if (levels.length > 0) params.set("levels", levels.join(","));
        if (types.length > 0) params.set("types", types.join(","));
        if (prices.length > 0) params.set("prices", prices.join(","));
        if (page > 1) params.set("page", page.toString());

        const url = `${pathname}?${params.toString()}`;
        if (replace) {
            router.replace(url, { scroll: false });
        } else {
            router.push(url, { scroll: false });
        }
    };


    // Effect for Debounced Search URL Update
    useEffect(() => {
        if (!mounted) return;

        const timer = setTimeout(() => {
            const currentQ = searchParams.get("q") || "";
            if (searchInput !== currentQ) {
                updateUrl(searchInput, selectedCategory, selectedLevels, selectedTypes, selectedPrices, 1, true);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    useEffect(() => {
        if (!mounted) return;
        updateUrl(searchInput, selectedCategory, selectedLevels, selectedTypes, selectedPrices, currentPage, false);
    }, [selectedCategory, selectedLevels, selectedTypes, selectedPrices, currentPage]);


    const toggleFilter = (item: string, current: string[], setter: (val: string[]) => void) => {
        const newSelection = current.includes(item)
            ? current.filter(i => i !== item)
            : [...current, item];
        setter(newSelection);
        setCurrentPage(1);
    };

    const handleClearAll = () => {
        setSearchInput("");
        setSelectedCategory("All Topics");
        setSelectedLevels([]);
        setSelectedTypes([]);
        setSelectedPrices([]);
        setCurrentPage(1);
        router.push(pathname, { scroll: false });
    };

    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            // Use searchInput directly for instant feedback (client-side filtering best practice)
            const matchesSearch = course.title.toLowerCase().includes(searchInput.toLowerCase()) ||
                course.description.toLowerCase().includes(searchInput.toLowerCase()) ||
                course.tags.some(tag => tag.toLowerCase().includes(searchInput.toLowerCase()));

            const matchesCategory = selectedCategory === "All Topics" || course.category === selectedCategory;
            const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(course.level);
            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(course.type);
            const matchesPrice = selectedPrices.length === 0 || selectedPrices.includes(course.priceType);

            return matchesSearch && matchesCategory && matchesLevel && matchesType && matchesPrice;
        });
    }, [searchInput, selectedCategory, selectedLevels, selectedTypes, selectedPrices]);

    const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
    const paginatedCourses = filteredCourses.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const activeFilterCount = selectedLevels.length + selectedTypes.length + selectedPrices.length;
    const hasActiveFilters = searchInput !== "" || selectedCategory !== "All Topics" || selectedLevels.length > 0 || selectedTypes.length > 0 || selectedPrices.length > 0;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getGridClass = () => {
        switch (gridCols) {
            case 1: return "grid-cols-1";
            case 2: return "grid-cols-1 md:grid-cols-2";
            case 3: return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
            default: return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-background selection:bg-primary/20">

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
                <div className="mb-8 space-y-6">
                    <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
                        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4 text-sm font-medium">
                            <ArrowLeft className="w-4 h-4" /> Back to Home
                        </Link>
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                            Explore Courses
                        </h1>
                        <p className="text-muted-foreground max-w-2xl">
                            Find the perfect course to upgrade your skills.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="sticky top-24 z-30 mb-8"
                    >
                        <div className="bg-card dark:bg-[#030712] border border-border p-2 rounded-2xl shadow-2xl shadow-black/5 dark:shadow-black/50 flex flex-col xl:flex-row gap-4 items-center max-w-full overflow-hidden">

                            {/* Categories - Scrollable Area */}
                            <div className="w-full xl:w-auto flex-1 min-w-0 relative group/categories">
                                {/* Left Scroll Button */}
                                {canScrollLeft && (
                                    <motion.button
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        onClick={() => scroll('left')}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-md text-foreground hover:bg-background hover:text-primary transition-colors flex items-center justify-center h-8 w-8 ml-1"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </motion.button>
                                )}

                                {/* Gradient Masks */}
                                {canScrollLeft && <div className="absolute left-0 top-0 bottom-0 w-12 bg-linear-to-r from-card dark:from-[#030712] to-transparent z-30 pointer-events-none" />}
                                {canScrollRight && <div className="absolute right-0 top-0 bottom-0 w-12 bg-linear-to-l from-card dark:from-[#030712] to-transparent z-30 pointer-events-none" />}

                                <div
                                    ref={categoryContainerRef}
                                    className="overflow-x-auto scrollbar-hide flex gap-1.5 p-1 px-2"
                                >
                                    {CATEGORIES.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => { setSelectedCategory(category); setCurrentPage(1); }}
                                            className={`
                                                relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer shrink-0
                                                ${selectedCategory === category
                                                    ? "text-white dark:text-black z-10"
                                                    : "bg-black/5 dark:bg-white/5 text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground"
                                                }
                                            `}
                                        >
                                            {selectedCategory === category && (
                                                <motion.div
                                                    layoutId="activeCategory"
                                                    className="absolute inset-0 bg-primary rounded-xl z-[-1]"
                                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                />
                                            )}
                                            {category}
                                        </button>
                                    ))}
                                </div>

                                {/* Right Scroll Button */}
                                {canScrollRight && (
                                    <motion.button
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        onClick={() => scroll('right')}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-md text-foreground hover:bg-background hover:text-primary transition-colors flex items-center justify-center h-8 w-8 mr-1"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </motion.button>
                                )}
                            </div>

                            {/* Separator for desktop */}
                            <div className="hidden xl:block w-px h-8 bg-border mx-2" />

                            {/* Right Actions: Search & Toggles */}
                            <div className="flex items-center gap-3 w-full xl:w-auto shrink-0">
                                <div className="relative grow sm:grow-0">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchInput}
                                        onChange={(e) => setSearchInput(e.target.value)}
                                        className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-primary/50 focus:bg-background focus:ring-0 outline-none transition-all text-sm text-foreground placeholder:text-muted-foreground"
                                    />
                                </div>

                                <div className="hidden lg:flex bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-border">
                                    <button
                                        onClick={() => setGridCols(1)}
                                        className={`p-2 rounded-lg transition-all ${gridCols === 1 ? 'bg-primary text-white dark:text-black shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}

                                    >
                                        <AlignJustify className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setGridCols(2)}
                                        className={`p-2 rounded-lg transition-all ${gridCols === 2 ? 'bg-primary text-white dark:text-black shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}

                                    >
                                        <LayoutGrid className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setGridCols(3)}
                                        className={`p-2 rounded-lg transition-all ${gridCols === 3 ? 'bg-primary text-white dark:text-black shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        <Grip className="w-4 h-4" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                                    className={`lg:hidden p-2.5 rounded-xl border border-border bg-black/5 dark:bg-white/5 text-foreground relative hover:bg-black/10 dark:hover:bg-white/10 transition-colors ${activeFilterCount > 0 ? 'text-primary' : ''}`}
                                >
                                    <Filter className="w-4 h-4" />
                                    {activeFilterCount > 0 && (
                                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    <motion.aside
                        className={`
                            ${showMobileFilters ? 'fixed inset-0 z-50 bg-background p-6 overflow-y-auto' : 'hidden'}
                            lg:block lg:w-64 lg:shrink-0 lg:sticky lg:top-48
                        `}
                    >
                        {showMobileFilters && (
                            <div className="flex items-center justify-between mb-6 lg:hidden">
                                <h3 className="text-xl font-bold">Filters</h3>
                                <button onClick={() => setShowMobileFilters(false)}><X className="w-6 h-6" /></button>
                            </div>
                        )}

                        <div className="space-y-8 pr-4">
                            <div>
                                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Level</h3>
                                <div className="space-y-3">
                                    {LEVELS.map(level => (
                                        <div key={level} className="flex items-center gap-3 group cursor-pointer select-none" onClick={() => toggleFilter(level, selectedLevels, setSelectedLevels)}>
                                            <AnimatedCheckbox id={level} checked={selectedLevels.includes(level)} />
                                            <span className={`text-sm ${selectedLevels.includes(level) ? 'text-foreground font-medium' : 'text-muted-foreground group-hover:text-foreground transition-colors'}`}>{level}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Type</h3>
                                <div className="space-y-3">
                                    {TYPES.map(type => (
                                        <div key={type} className="flex items-center gap-3 group cursor-pointer select-none" onClick={() => toggleFilter(type, selectedTypes, setSelectedTypes)}>
                                            <AnimatedCheckbox id={type} checked={selectedTypes.includes(type)} />
                                            <span className={`text-sm ${selectedTypes.includes(type) ? 'text-foreground font-medium' : 'text-muted-foreground group-hover:text-foreground transition-colors'}`}>{type}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Price</h3>
                                <div className="space-y-3">
                                    {PRICES.map(price => (
                                        <div key={price} className="flex items-center gap-3 group cursor-pointer select-none" onClick={() => toggleFilter(price, selectedPrices, setSelectedPrices)}>
                                            <AnimatedCheckbox id={price} checked={selectedPrices.includes(price)} />
                                            <span className={`text-sm ${selectedPrices.includes(price) ? 'text-foreground font-medium' : 'text-muted-foreground group-hover:text-foreground transition-colors'}`}>{price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {hasActiveFilters && (
                                <button
                                    onClick={handleClearAll}
                                    className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
                                >
                                    <X className="w-3 h-3 transition-transform duration-200 group-hover:scale-110" />
                                    Reset All Filters
                                </button>
                            )}
                        </div>
                    </motion.aside>

                    <div className="grow w-full">
                        <AnimatePresence mode="popLayout">
                            {paginatedCourses.length > 0 ? (
                                <>
                                    <div className={`grid gap-6 items-start auto-rows-fr ${getGridClass()}`}>
                                        {paginatedCourses.map((course) => (
                                            <motion.div
                                                key={course.slug}
                                                layout
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                            >
                                                <CourseCard course={course} />
                                            </motion.div>
                                        ))}
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="mt-12 flex justify-center items-center gap-2">
                                            <button
                                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                                disabled={currentPage === 1}
                                                className="p-2 rounded-xl border border-border bg-card text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                            </button>

                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`
                                                        w-10 h-10 rounded-xl font-medium cursor-pointer transition-all duration-300
                                                        ${currentPage === page
                                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-110"
                                                            : "bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                                                        }
                                                    `}
                                                >
                                                    {page}
                                                </button>
                                            ))}

                                            <button
                                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                                disabled={currentPage === totalPages}
                                                className="p-2 rounded-xl border border-border bg-card text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                            >
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border/50 rounded-3xl bg-card/20"
                                >
                                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                                        <FileQuestion className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">No matching courses found</h3>
                                    <p className="text-muted-foreground max-w-sm mb-6">
                                        Adjust your filters or try a different search term to find what you're looking for.
                                    </p>
                                    <button
                                        onClick={handleClearAll}
                                        className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        Clear all filters
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default function CoursesClient() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
            <CoursesContent />
        </Suspense>
    );
}
