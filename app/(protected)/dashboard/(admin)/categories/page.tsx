"use client";

import {
    Plus, Search, Edit2, Trash2, MoreHorizontal, Layers,
    Globe, Smartphone, Palette, TrendingUp, Briefcase,
    Database, Code, Shield, Cloud, Info, X,
    RefreshCw, Download, ChevronDown, GripVertical
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { Category } from "@/types/lms";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchAdminCategories, reorderCategories } from "@/lib/store/features/admin/categoriesSlice";
import { deleteCategory } from "@/lib/actions/categories";
import {
    Dialog, DialogHeader, DialogTitle, DialogDescription,
    DialogFooter, DialogBody
} from "@/components/ui/Dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { AnimatedCheckbox } from "@/components/ui/AnimatedCheckbox";
import { Pagination } from "@/components/ui/Pagination";
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

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
};

export default function CategoryManagementPage() {
    const toast = useToast();
    const dispatch = useAppDispatch();
    const { categories, isLoading, error } = useAppSelector(state => state.categories);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [exportModal, setExportModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [localCategories, setLocalCategories] = useState<Category[]>([]);

    useEffect(() => {
        dispatch(fetchAdminCategories());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error, toast]);

    const filteredCategories = useMemo(() => {
        return categories.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.slug.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [categories, searchTerm]);

    const paginatedCategories = useMemo(() => {
        return filteredCategories.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    }, [filteredCategories, currentPage, pageSize]);

    useEffect(() => {
        setLocalCategories(paginatedCategories);
    }, [paginatedCategories]);

    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            const oldIndex = localCategories.findIndex(c => c.id === active.id);
            const newIndex = localCategories.findIndex(c => c.id === over.id);
            const newOrder = arrayMove(localCategories, oldIndex, newIndex);
            setLocalCategories(newOrder);
            const startIndex = (currentPage - 1) * pageSize;
            const updatedFullList = [...categories];
            updatedFullList.splice(startIndex, newOrder.length, ...newOrder);

            const loadingId = toast.loading("Serializing...", "Synchronizing taxonomic structure");
            await dispatch(reorderCategories(updatedFullList));
            toast.dismiss(loadingId);
            toast.success("Order synchronized successfully");
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirmId) return;
        const result = await deleteCategory(deleteConfirmId);
        if (result.success) {
            toast.success("Category deleted");
            setDeleteConfirmId(null);
            dispatch(fetchAdminCategories());
        } else {
            toast.error(result.error || "Failed to delete");
        }
    };

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

    const totalPages = Math.max(1, Math.ceil(filteredCategories.length / pageSize));

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, pageSize]);

    const totalCourses = categories.reduce((sum, c) => sum + (c.course_count || 0), 0);
    const avgCourses = categories.length > 0 ? (totalCourses / categories.length).toFixed(1) : 0;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 pb-10 font-sans"
        >
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl md:text-3xl font-bold tracking-tight"
                    >
                        Category Management
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
                    <button
                        onClick={() => setExportModal(true)}
                        className="px-4 py-2.5 rounded-xl border border-border/50 bg-muted/40 hover:bg-muted/60 text-sm font-semibold transition-all flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                    <Link href="/dashboard/categories/new">
                        <button
                            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Category</span>
                        </button>
                    </Link>
                </div>
            </div>

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
                            className="p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</p>
                                </div>
                                <div className={cn(
                                    "p-3 rounded-xl",
                                    stat.color === 'blue' && "bg-blue-500/10 text-blue-500",
                                    stat.color === 'emerald' && "bg-emerald-500/10 text-emerald-500",
                                    stat.color === 'violet' && "bg-violet-500/10 text-violet-500",
                                    stat.color === 'amber' && "bg-amber-500/10 text-amber-500"
                                )}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            <div className="bg-card/30 backdrop-blur-xl border border-border/40 rounded-3xl overflow-hidden shadow-xl">
                <div className="p-6 border-b border-border/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Filter categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-muted/20 border border-border/30 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 hover:bg-muted/30 transition-all font-medium"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        {selectedCategories.size > 0 && (
                            <button
                                className="px-4 py-2 rounded-xl bg-destructive text-white text-xs font-bold transition-all hover:bg-destructive/90 shadow-lg shadow-destructive/20 flex items-center gap-2"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Selected ({selectedCategories.size})</span>
                            </button>
                        )}
                        <button
                            onClick={() => dispatch(fetchAdminCategories())}
                            className="p-2.5 rounded-xl border border-border/30 hover:bg-muted/50 transition-all text-muted-foreground"
                            title="Refresh"
                        >
                            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                        </button>
                    </div>
                </div>

                <div className="min-w-[800px] overflow-x-auto">
                    <div className="grid grid-cols-[48px_48px_2fr_1fr_100px_120px_80px] px-6 py-4 bg-muted/5 border-b border-border/20">
                        <div className="flex items-center justify-center"></div>
                        <div className="flex items-center justify-center">
                            <AnimatedCheckbox
                                id="select-all"
                                checked={selectedCategories.size > 0 && selectedCategories.size === filteredCategories.length}
                                onChange={toggleSelectAll}
                            />
                        </div>
                        <div className="px-4 text-[10px] uppercase tracking-widest font-black text-muted-foreground/60">Category</div>
                        <div className="px-4 text-[10px] uppercase tracking-widest font-black text-muted-foreground/60">Slug Handle</div>
                        <div className="px-4 text-[10px] uppercase tracking-widest font-black text-muted-foreground/60">Serial</div>
                        <div className="px-4 text-[10px] uppercase tracking-widest font-black text-muted-foreground/60">Courses</div>
                        <div className="px-4 text-[10px] uppercase tracking-widest font-black text-muted-foreground/60 text-right">Action</div>
                    </div>

                    {isLoading && localCategories.length === 0 ? (
                        <div className="p-24 flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Initializing registry...</p>
                        </div>
                    ) : localCategories.length === 0 ? (
                        <div className="p-24 text-center">
                            <div className="flex flex-col items-center justify-center space-y-4 opacity-40">
                                <Search className="w-12 h-12" />
                                <h3 className="font-bold text-xl uppercase italic tracking-tighter">No clusters found</h3>
                                {searchTerm && <button onClick={() => setSearchTerm("")} className="px-5 py-2 rounded-xl bg-primary/10 text-primary text-xs font-black uppercase">Clear Filters</button>}
                            </div>
                        </div>
                    ) : (
                        <DndContext
                            collisionDetection={closestCenter}
                            modifiers={[restrictToVerticalAxis]}
                            onDragEnd={handleDragEnd}
                            sensors={sensors}
                        >
                            <div className="divide-y divide-border/20">
                                <SortableContext items={localCategories.map(c => c.id)} strategy={verticalListSortingStrategy}>
                                    {localCategories.map((category) => (
                                        <CategoryRowItem
                                            key={category.id}
                                            category={category}
                                            selected={selectedCategories.has(category.id)}
                                            onToggleSelect={() => toggleSelectCategory(category.id)}
                                            onDelete={() => setDeleteConfirmId(category.id)}
                                        />
                                    ))}
                                </SortableContext>
                            </div>
                        </DndContext>
                    )}
                </div>

                {!isLoading && filteredCategories.length > 0 && (
                    <div className="p-6 border-t border-border/20 bg-muted/5">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            pageSize={pageSize}
                            onPageSizeChange={setPageSize}
                            totalItems={filteredCategories.length}
                        />
                    </div>
                )}
            </div>

            <Dialog open={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} size="sm">
                <div className="p-8 text-center space-y-6">
                    <div className="w-24 h-24 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto ring-8 ring-rose-500/5"><X className="w-10 h-10" /></div>
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black tracking-tighter italic uppercase">Confirm Purge</h2>
                        <p className="text-sm font-bold text-muted-foreground opacity-60">Are you sure you want to delete this category? This action cannot be undone and will destabilize associated taxonomies.</p>
                    </div>
                </div>
                <DialogFooter className="grid grid-cols-2 gap-4 p-8 pt-0">
                    <button onClick={() => setDeleteConfirmId(null)} className="h-14 bg-muted/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-muted/40 transition-all border border-border/10">Abort</button>
                    <button onClick={handleDelete} className="h-14 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/30">Delete</button>
                </DialogFooter>
            </Dialog>

            <Dialog open={exportModal} onClose={() => setExportModal(false)} size="sm">
                <DialogHeader>
                    <DialogTitle className="italic">Matrix Extraction</DialogTitle>
                    <DialogDescription>De-serialize categorical topology into portable formats.</DialogDescription>
                </DialogHeader>
                <DialogBody className="space-y-3">
                    {['CSV', 'JSON', 'PDF'].map(ext => (
                        <button
                            key={ext}
                            className="w-full flex items-center gap-5 p-5 rounded-2xl border border-border/50 bg-muted/20 hover:bg-primary/5 hover:border-primary/30 transition-all group text-left"
                            onClick={() => setExportModal(false)}
                        >
                            <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                <Download className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-black text-sm italic uppercase tracking-tight">Export as {ext}</div>
                                <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-40">Standard Format</div>
                            </div>
                        </button>
                    ))}
                </DialogBody>
            </Dialog>
        </motion.div>
    );
}

function CategoryRowItem({ category, selected, onToggleSelect, onDelete }: {
    category: Category;
    selected: boolean;
    onToggleSelect: () => void;
    onDelete: () => void;
}) {
    const { transform, transition, setNodeRef, isDragging, attributes, listeners } = useSortable({
        id: category.id,
    });

    const Icon = iconMap[category.icon || 'Layers'] || Layers;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "grid grid-cols-[48px_48px_2fr_1fr_100px_120px_80px] items-center px-6 py-5 transition-colors group bg-card/10 select-none",
                isDragging ? "z-50 bg-muted/90 backdrop-blur-xl shadow-2xl ring-2 ring-primary/40" : "hover:bg-muted/10"
            )}
        >
            <div className="flex items-center justify-center">
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-muted-foreground/20 group-hover:text-primary transition-colors p-2"
                >
                    <GripVertical className="w-4 h-4" />
                </div>
            </div>
            <div className="flex items-center justify-center">
                <AnimatedCheckbox
                    id={`select-${category.id}`}
                    checked={selected}
                    onChange={onToggleSelect}
                />
            </div>
            <div className="px-4 flex items-center gap-4 min-w-0">
                <div
                    className="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-500"
                    style={{
                        backgroundColor: `${category.color || '#6366f1'}15`,
                        borderColor: `${category.color || '#6366f1'}30`,
                        color: category.color || '#6366f1'
                    }}
                >
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                    <Link
                        href={`/dashboard/categories/${category.id}/edit`}
                        className="font-black text-sm italic uppercase tracking-tight text-foreground group-hover:text-primary transition-colors truncate"
                    >
                        {category.name}
                    </Link>
                    <span className="text-[9px] font-black text-muted-foreground/40 font-mono truncate uppercase tracking-widest hidden md:block">
                        {category.id}
                    </span>
                </div>
            </div>
            <div className="px-4">
                <div className="text-[10px] font-black font-mono text-muted-foreground opacity-40 truncate uppercase tracking-widest bg-muted/20 px-2 py-1 rounded w-fit">
                    {category.slug}
                </div>
            </div>
            <div className="px-4">
                <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-black text-amber-500 tracking-widest">
                    {String(category.serial_number || 0).padStart(2, '0')}
                </span>
            </div>
            <div className="px-4">
                <span className="px-2.5 py-1 rounded-full bg-muted/30 border border-border/20 text-[10px] text-muted-foreground font-black uppercase tracking-tighter">
                    {category.course_count || 0} Entities
                </span>
            </div>
            <div className="px-4 text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-2.5 rounded-xl hover:bg-muted font-medium transition-all text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl border-border/40 bg-card/85 backdrop-blur-2xl shadow-2xl">
                        <DropdownMenuItem asChild className="rounded-xl focus:bg-primary/10 focus:text-primary cursor-pointer p-3">
                            <Link href={`/dashboard/categories/${category.id}/edit`} className="flex items-center gap-3">
                                <Edit2 className="w-4 h-4" />
                                <span className="font-black text-xs uppercase tracking-widest italic">Modify</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/20 mx-1 my-1.5" />
                        <DropdownMenuItem
                            onClick={onDelete}
                            className="rounded-xl focus:bg-destructive/10 focus:text-destructive text-destructive cursor-pointer p-3"
                        >
                            <div className="flex items-center gap-3">
                                <Trash2 className="w-4 h-4" />
                                <span className="font-black text-xs uppercase tracking-widest">Purge</span>
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
