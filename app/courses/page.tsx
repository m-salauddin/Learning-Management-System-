"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Star, ArrowRight, Search, SlidersHorizontal, X, ChevronDown, Check, Filter, LayoutGrid, Grip, AlignJustify, FileQuestion, ChevronLeft, ChevronRight } from "lucide-react";
import { staggerContainer, staggerItem, fadeInUp } from "@/lib/motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnimatedCheckbox } from "@/components/ui/AnimatedCheckbox";

// Enhanced Course Data
import { COURSES as courses } from "@/data/courses";

const CATEGORIES = ["All Topics", "Web Development", "Data Science", "Mobile Development", "Cyber Security", "Cloud Computing", "Design"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const TYPES = ["Live", "Recorded", "Career Path"];
const PRICES = ["Paid", "Free"];
const ITEMS_PER_PAGE = 9;

export default function CoursesPage() {
    const [searchInput, setSearchInput] = useState(""); // Immediate input value
    const [searchTerm, setSearchTerm] = useState(""); // Debounced value for filtering
    const [selectedCategory, setSelectedCategory] = useState("All Topics");
    const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedPrices, setSelectedPrices] = useState<string[]>([]);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [gridCols, setGridCols] = useState<1 | 2 | 3>(3);
    const [currentPage, setCurrentPage] = useState(1);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // Toggle filter helper
    const toggleFilter = (item: string, current: string[], setter: (val: string[]) => void) => {
        if (current.includes(item)) {
            setter(current.filter(i => i !== item));
        } else {
            setter([...current, item]);
        }
        setCurrentPage(1); // Reset to page 1 on filter change
    };

    // Reset pagination when category or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCategory]);



    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesCategory = selectedCategory === "All Topics" || course.category === selectedCategory;
            const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(course.level);
            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(course.type);
            const matchesPrice = selectedPrices.length === 0 || selectedPrices.includes(course.priceType);

            return matchesSearch && matchesCategory && matchesLevel && matchesType && matchesPrice;
        });
    }, [searchTerm, selectedCategory, selectedLevels, selectedTypes, selectedPrices]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
    const paginatedCourses = filteredCourses.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const activeFilterCount = selectedLevels.length + selectedTypes.length + selectedPrices.length;

    const handleClearAll = () => {
        setSearchInput("");
        setSearchTerm("");
        setSelectedCategory("All Topics");
        setSelectedLevels([]);
        setSelectedTypes([]);
        setSelectedPrices([]);
        setCurrentPage(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Check if any filters are active
    const hasActiveFilters = searchInput !== "" || selectedCategory !== "All Topics" || selectedLevels.length > 0 || selectedTypes.length > 0 || selectedPrices.length > 0;

    // Handle page change with scroll to top
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Dynamic grid classes based on selection
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
        <div className="min-h-screen bg-background selection:bg-primary/20" suppressHydrationWarning>
            <Navbar />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
                {/* Header Section */}
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

                    {/* Top Section: Category Tabs + Search + Controls */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex flex-col xl:flex-row gap-6 justify-between items-start xl:items-center sticky top-24 z-30 bg-background/95 backdrop-blur-xl p-4 -mx-4 rounded-3xl border border-border/40 shadow-sm"
                    >
                        {/* Topic Tabs (Scrollable) */}
                        <div className="w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 scrollbar-hide">
                            <div className="flex gap-2">
                                {CATEGORIES.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`
                                            relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap
                                            ${selectedCategory === category
                                                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 ring-2 ring-primary/20"
                                                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                                            }
                                        `}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right Side: Search + Grid Toggle */}
                        <div className="flex items-center gap-3 w-full xl:w-auto">
                            {/* Search */}
                            <div className="relative grow xl:grow-0 min-w-[240px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-card border border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 outline-none transition-all text-sm"
                                />
                            </div>

                            {/* View Toggle (Desktop Only) */}
                            <div className="hidden lg:flex bg-muted/30 p-1 rounded-xl border border-border/50">
                                <button
                                    onClick={() => setGridCols(1)}
                                    className={`p-2 rounded-lg transition-all ${gridCols === 1 ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                    title="List View"
                                >
                                    <AlignJustify className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setGridCols(2)}
                                    className={`p-2 rounded-lg transition-all ${gridCols === 2 ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                    title="Grid View (2)"
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setGridCols(3)}
                                    className={`p-2 rounded-lg transition-all ${gridCols === 3 ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                    title="Compact View (3)"
                                >
                                    <Grip className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Mobile Filter Toggle */}
                            <button
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                className="lg:hidden p-2.5 rounded-xl border border-border bg-card text-foreground relative"
                            >
                                <Filter className="w-4 h-4" />
                                {activeFilterCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary" />
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* Sidebar Filters (Level, Type, Price) */}
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
                            {/* Section: Levels */}
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

                            {/* Section: Types */}
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

                            {/* Section: Price */}
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

                    {/* Main Content Grid */}
                    <div className="grow w-full">
                        <AnimatePresence mode="wait">
                            {paginatedCourses.length > 0 ? (
                                <>
                                    <motion.div
                                        key={`grid-${currentPage}-${selectedCategory}-${searchTerm}-${selectedLevels.join('-')}-${selectedTypes.join('-')}-${selectedPrices.join('-')}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className={`grid gap-6 items-start auto-rows-fr ${getGridClass()}`}
                                    >
                                        {paginatedCourses.map((course) => (
                                            <div
                                                key={course.slug}
                                                className="group relative h-full"
                                            >
                                                {/* Restored Original Card Design */}
                                                <div className="relative h-full flex flex-col bg-card/80 dark:bg-card/60 backdrop-blur-xl border border-border/50 dark:border-white/10 rounded-3xl overflow-hidden transition-all duration-500 group-hover:border-primary/30 group-hover:shadow-2xl group-hover:-translate-y-2">
                                                    {/* Shine effect overlay */}
                                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                                    </div>

                                                    {/* Course Image */}
                                                    <div className="p-4 pb-0">
                                                        <div className="relative h-48 rounded-2xl overflow-hidden w-full">
                                                            <Image
                                                                src={course.image}
                                                                alt={course.title}
                                                                fill
                                                                className="object-cover transition-transform duration-700 group-hover:scale-110"

                                                            />
                                                            {/* Gradient overlay */}
                                                            <div className="absolute inset-0 bg-linear-to-t from-card/80 via-transparent to-transparent" />

                                                            {/* Duration badge */}
                                                            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-background/70 dark:bg-black/50 backdrop-blur-md text-sm font-semibold border border-white/20 shadow-lg">
                                                                <span className="text-primary">
                                                                    {course.duration}
                                                                </span>
                                                            </div>

                                                            {/* Rating badge */}
                                                            <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-background/70 dark:bg-black/50 backdrop-blur-md border border-white/20 shadow-lg">
                                                                <div className="flex items-center gap-1">
                                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                                    <span className="font-bold text-foreground">{course.rating}</span>
                                                                </div>
                                                                <span className="text-muted-foreground text-xs">
                                                                    ({course.students})
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Content */}
                                                    <div className="p-6 pt-4 grow flex flex-col">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-primary border border-primary/20 bg-primary/5 px-2 py-0.5 rounded-md">
                                                                {course.level}
                                                            </span>
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border px-2 py-0.5 rounded-md">
                                                                {course.type}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-xl font-bold mb-2 transition-colors duration-300 group-hover:text-primary">
                                                            {course.title}
                                                        </h3>
                                                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                                            {course.description}
                                                        </p>

                                                        {/* Tags */}
                                                        <div className="flex flex-wrap gap-2 mb-5">
                                                            {course.tags.map((tag) => (
                                                                <span
                                                                    key={tag}
                                                                    className="px-3 py-1 rounded-full text-xs font-medium bg-muted/80 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-300"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        {/* Price & CTA */}
                                                        <div className="flex items-center justify-between pt-4 mt-auto border-t border-border/50 dark:border-white/5">
                                                            <div className="flex flex-col">
                                                                <span className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Price</span>
                                                                <span className="text-2xl font-black text-primary">
                                                                    {course.price}
                                                                </span>
                                                            </div>
                                                            <Link
                                                                href={`/courses/${course.slug}`}
                                                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 group/btn"
                                                            >
                                                                <span>Course</span>
                                                                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>

                                    {/* Pagination Controls */}
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
            <Footer />
        </div >
    );
}
