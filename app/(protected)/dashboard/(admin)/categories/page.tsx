"use client";

import {
    Plus, Search, Edit2, Trash2, MoreHorizontal, Layers,
    Globe, Smartphone, Palette, TrendingUp, Briefcase,
    Database, Code, Shield, Cloud, Info, X, Save,
    RefreshCw, Download, CheckCircle2, ChevronDown, Filter
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import {
    Category, getCategoriesAdmin, deleteCategory
} from "@/lib/actions/categories";
import {
    Dialog, DialogHeader, DialogTitle, DialogDescription,
    DialogFooter
} from "@/components/ui/Dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { SearchInput } from "@/components/dashboard/shared/SearchInput";
import { AnimatedCheckbox } from "@/components/ui/AnimatedCheckbox";
import { Pagination } from "@/components/ui/Pagination";

const iconMap: Record<string, any> = {
    'Globe': Globe,
    'Smartphone': Smartphone,
    'Palette': Palette,
    'TrendingUp': TrendingUp,
    'Briefcase': Briefcase,
    'Database': Database,
    'Code': Code,
    'Shield': Shield,
    'Cloud': Cloud,
    'Layers': Layers,
    'Info': Info,
    'book': Globe,
    'code': Code,
    'palette': Palette
};

export default function CategoryManagementPage() {
    const toast = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

    // Modals
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [exportModal, setExportModal] = useState(false);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const fetchCategories = async () => {
        setIsLoading(true);
        const result = await getCategoriesAdmin();
        if (result.success && result.data) {
            setCategories(result.data);
        } else {
            toast.error("Failed to fetch categories");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async () => {
        if (!deleteConfirmId) return;
        const result = await deleteCategory(deleteConfirmId);
        if (result.success) {
            toast.success("Category deleted");
            setDeleteConfirmId(null);
            fetchCategories();
        } else {
            toast.error(result.error || "Failed to delete");
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleSelectAll = () => {
        if (selectedCategories.size === filteredCategories.length) {
            setSelectedCategories(new Set());
        } else {
            setSelectedCategories(new Set(filteredCategories.map(c => c.id)));
        }
    };

    const toggleSelectCategory = (id: string) => {
        const newSelected = new Set(selectedCategories);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedCategories(newSelected);
    };

    const clearSelection = () => setSelectedCategories(new Set());

    const totalPages = Math.ceil(filteredCategories.length / pageSize);
    const paginatedCategories = filteredCategories.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Stats
    const totalCourses = categories.reduce((sum, c) => sum + (c.course_count || 0), 0);
    const avgCourses = categories.length > 0 ? (totalCourses / categories.length).toFixed(1) : 0;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 pb-10 font-sans"
        >
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold tracking-tight text-white uppercase italic"
                    >
                        Category <span className="text-primary italic font-black">Management</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground mt-1 text-sm font-medium"
                    >
                        Organize course taxonomies, icons, and structure
                    </motion.p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setExportModal(true)}
                        className="px-4 py-2.5 rounded-xl border border-border/50 bg-muted/40 hover:bg-muted/60 text-sm font-semibold transition-all flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </motion.button>
                    <Link
                        href="/dashboard/categories/new"
                        className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center gap-2 uppercase tracking-tighter"
                    >
                        <Plus className="w-5 h-5 font-black" />
                        <span>Add Category</span>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {isLoading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl animate-pulse h-28" />
                    ))
                ) : (
                    [
                        { label: 'Total Categories', value: categories.length, icon: Layers, color: 'blue' },
                        { label: 'Total Courses', value: totalCourses, icon: Code, color: 'emerald' },
                        { label: 'Avg. per Category', value: avgCourses, icon: TrendingUp, color: 'violet' },
                        { label: 'Active Icons', value: new Set(categories.map(c => c.icon)).size, icon: Palette, color: 'amber' }
                    ].map((stat, idx) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{stat.label}</p>
                                    <p className="text-3xl font-bold mt-2 text-white">{stat.value}</p>
                                </div>
                                <div className={cn(
                                    "p-3 rounded-xl",
                                    stat.color === 'blue' && "bg-blue-500/10 text-blue-600",
                                    stat.color === 'emerald' && "bg-emerald-500/10 text-emerald-600",
                                    stat.color === 'violet' && "bg-violet-500/10 text-violet-600",
                                    stat.color === 'amber' && "bg-amber-500/10 text-amber-600"
                                )}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Table Container */}
            <div className="rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl overflow-hidden shadow-sm shadow-black/5">
                {/* Toolbar */}
                <div className="p-4 md:p-6 border-b border-border/40 bg-card/30 backdrop-blur-xl">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between">
                        <div className="flex items-center gap-2 w-full lg:max-w-md focus-within:ring-0">
                            <SearchInput
                                value={searchTerm}
                                onChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
                                placeholder="Search categories..."
                                debounceMs={300}
                                isSearching={isLoading}
                                className="flex-1"
                            />
                            <button
                                onClick={fetchCategories}
                                className="h-11 w-11 flex items-center justify-center shrink-0 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/50 transition-all focus:outline-none"
                            >
                                <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4">

                            <div className="text-xs text-muted-foreground px-3 py-1.5 rounded-lg border border-border/50 bg-muted/20 hidden sm:block">
                                {filteredCategories.length} Categories
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Rendering */}
                {isLoading ? (
                    <div className="p-12 text-center">
                        <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground animate-pulse">Synchronizing categories...</p>
                    </div>
                ) : (
                    <div className="overflow-hidden overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-b border-border/40">
                                    <TableHead className="w-[50px] px-6 py-3">
                                        <AnimatedCheckbox
                                            id="select-all"
                                            checked={selectedCategories.size === filteredCategories.length && filteredCategories.length > 0}
                                            onChange={toggleSelectAll}
                                        />
                                    </TableHead>
                                    <TableHead className="px-6 py-3 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Category</TableHead>
                                    <TableHead className="px-6 py-3 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Slug</TableHead>
                                    <TableHead className="px-6 py-3 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Courses</TableHead>
                                    <TableHead className="px-6 py-3 text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Last Updated</TableHead>
                                    <TableHead className="px-6 py-3 text-[10px] font-black text-white/40 uppercase tracking-[0.2em] text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-border/20">
                                {paginatedCategories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="bg-muted/50 p-4 rounded-2xl border border-border/50">
                                                    <Layers className="w-8 h-8 text-muted-foreground/50" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-semibold text-white">No categories found</p>
                                                    <p className="text-sm text-muted-foreground">Try adjusting your search terms</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    paginatedCategories.map((category) => {
                                        const Icon = iconMap[category.icon || 'Layers'] || Layers;
                                        return (
                                            <TableRow key={category.id} className="border-b border-border/30 transition-all duration-200 group">
                                                <TableCell className="px-6 py-4">
                                                    <AnimatedCheckbox
                                                        id={`select-${category.id}`}
                                                        checked={selectedCategories.has(category.id)}
                                                        onChange={() => toggleSelectCategory(category.id)}
                                                    />
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-10 h-10 rounded-xl border flex items-center justify-center shadow-inner transition-all"
                                                            style={{
                                                                backgroundColor: `${category.color || '#6366f1'}20`,
                                                                borderColor: `${category.color || '#6366f1'}40`,
                                                                color: category.color || '#6366f1'
                                                            }}
                                                        >
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                        <Link
                                                            href={`/dashboard/categories/${category.id}/edit`}
                                                            className="font-bold text-white group-hover:text-primary transition-colors italic"
                                                        >
                                                            {category.name}
                                                        </Link>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-6 py-4 font-mono text-xs text-muted-foreground">
                                                    {category.slug}
                                                </TableCell>
                                                <TableCell className="px-6 py-4">
                                                    <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-xs text-muted-foreground font-semibold">
                                                        {category.course_count || 0}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-xs text-muted-foreground">
                                                    {new Date(category.updated_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/dashboard/categories/${category.id}/edit`}
                                                            className="p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-all text-muted-foreground"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </Link>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors outline-none">
                                                                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                                                                </button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-48 p-1.5 rounded-xl border border-border/50 bg-slate-900/95 backdrop-blur-xl shadow-2xl">
                                                                <DropdownMenuItem asChild>
                                                                    <Link href={`/dashboard/categories/${category.id}/edit`} className="rounded-lg cursor-pointer text-sm gap-2.5 text-slate-200 focus:bg-white/10">
                                                                        <Edit2 className="w-4 h-4" /> Edit Category
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem className="rounded-lg cursor-pointer text-sm gap-2.5 text-slate-200 focus:bg-white/10">
                                                                    <Plus className="w-4 h-4" /> Add Sub-category
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator className="my-1 bg-white/5" />
                                                                <DropdownMenuItem onClick={() => setDeleteConfirmId(category.id)} className="rounded-lg cursor-pointer text-sm gap-2.5 text-red-400 focus:bg-red-500/10">
                                                                    <Trash2 className="w-4 h-4" /> Delete Category
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Pagination */}
                {!isLoading && filteredCategories.length > 0 && (
                    <div className="p-6 border-t border-border/40 bg-muted/10">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            pageSize={pageSize}
                            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
                            totalItems={filteredCategories.length}
                        />
                    </div>
                )}
            </div>

            {/* Floating Bulk Actions Bar */}
            <AnimatePresence>
                {selectedCategories.size > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 p-1.5 pr-4 pl-4 rounded-full border border-border bg-card/95 text-foreground shadow-xl backdrop-blur-md"
                    >
                        <span className="text-sm font-semibold mr-2 whitespace-nowrap pl-1 text-white">{selectedCategories.size} selected</span>
                        <div className="h-4 w-px bg-border mx-1" />
                        <div className="flex items-center gap-1">
                            <button className="p-2 rounded-full hover:bg-muted transition-colors text-red-500" title="Delete Selected">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="h-4 w-px bg-border mx-1" />
                        <button onClick={clearSelection} className="p-2 rounded-full hover:bg-muted transition-colors ml-1 text-muted-foreground hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Modal */}
            <Dialog open={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} size="sm">
                <DialogHeader className="text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-4 border border-red-500/20">
                        <Trash2 className="w-8 h-8" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-white uppercase italic">Destroy <span className="text-red-500">Category?</span></DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm font-medium">This will remove the category permanently. Course links will be lost.</DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex gap-4 pt-4 border-none px-6 pb-6">
                    <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 rounded-xl border border-border text-white/40 font-bold hover:text-white transition-all text-sm uppercase tracking-tighter">Abort</button>
                    <button onClick={handleDelete} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-black hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 text-sm uppercase tracking-tighter">Delete</button>
                </DialogFooter>
            </Dialog>

            {/* Export Modal */}
            {exportModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-slate-900 border border-border rounded-3xl p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-2 uppercase italic">Export <span className="text-primary italic font-black">Categories</span></h2>
                        <p className="text-muted-foreground text-sm mb-8 font-medium">Download all categories and metadata.</p>
                        <div className="space-y-3">
                            {['CSV', 'JSON', 'PDF'].map(ext => (
                                <button key={ext} className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-white/5 hover:bg-primary/10 hover:border-primary/50 transition-all group">
                                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all"><Download className="w-5 h-5" /></div>
                                    <div className="text-left">
                                        <div className="font-bold text-white">Export as {ext}</div>
                                        <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Ready for download</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setExportModal(false)} className="mt-8 w-full py-4 text-white/40 font-bold hover:text-white transition-all text-xs uppercase tracking-widest">Cancel</button>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
