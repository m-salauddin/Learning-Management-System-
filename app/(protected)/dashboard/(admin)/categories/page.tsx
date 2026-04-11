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
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { SearchInput, StatsSkeleton, LoadingState, EmptyFilterState } from "@/components/dashboard/shared";
import { DashboardGrid } from "@/components/dashboard/ui/DashboardGrid";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
    DashboardTableContainer,
    DashboardTableToolbar,
    DashboardTableWrapper,
    DashboardTableHeader,
    DashboardTableHead,
    DashboardTableBody,
    DashboardTableRow,
    DashboardTableCell
} from "@/components/dashboard/ui/DashboardTable";
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10 font-sans">
            <PageHeader
                title="Category Management"
                description="Organize course taxonomies, icons, and structure"
                icon={Layers}
                actions={
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setExportModal(true)}
                            className="px-5 py-2.5 rounded-xl border border-border/50 bg-card hover:bg-muted/50 text-xs font-black uppercase tracking-widest transition-all inline-flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" /> Export
                        </button>
                        <Link href="/dashboard/categories/new">
                            <button className="bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 inline-flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Add Category
                            </button>
                        </Link>
                    </div>
                }
            />

            <DashboardGrid cols={4}>
                {isLoading ? (
                    <StatsSkeleton count={4} />
                ) : (
                    <>
                        <StatsCard
                            title="Total Categories"
                            value={categories.length}
                            icon={Layers}
                            className="border-blue-500/20"
                        />
                        <StatsCard
                            title="Total Courses"
                            value={totalCourses}
                            icon={Code}
                            className="border-emerald-500/20"
                        />
                        <StatsCard
                            title="Avg. per Category"
                            value={avgCourses}
                            icon={TrendingUp}
                            className="border-violet-500/20"
                        />
                        <StatsCard
                            title="Active Icons"
                            value={new Set(categories.map(c => c.icon)).size}
                            icon={Palette}
                            className="border-amber-500/20"
                        />
                    </>
                )}
            </DashboardGrid>
            <DashboardTableContainer>
                <DashboardTableToolbar>
                    <SearchInput
                        value={searchTerm}
                        onChange={setSearchTerm}
                        placeholder="Filter categories..."
                        className="flex-1 max-w-md"
                    />
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
                </DashboardTableToolbar>
                <DashboardTableWrapper className="min-w-[800px]">
                    <DashboardTableHeader className="grid-cols-[48px_48px_2fr_1fr_100px_120px_80px]">
                        <div className="flex items-center justify-center"></div>
                        <div className="flex items-center justify-center">
                            <AnimatedCheckbox
                                id="select-all"
                                checked={selectedCategories.size > 0 && selectedCategories.size === filteredCategories.length}
                                onChange={toggleSelectAll}
                            />
                        </div>
                        <DashboardTableHead>Category</DashboardTableHead>
                        <DashboardTableHead>Slug Handle</DashboardTableHead>
                        <DashboardTableHead>Serial</DashboardTableHead>
                        <DashboardTableHead>Courses</DashboardTableHead>
                        <DashboardTableHead className="text-right">Action</DashboardTableHead>
                    </DashboardTableHeader>
                    
                    <DashboardTableBody>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >{isLoading && localCategories.length === 0 ? (
                            <LoadingState message="Initializing registry..." />
                        ) : localCategories.length === 0 ? (
                            <EmptyFilterState 
                                searchTerm={searchTerm}
                                onReset={() => setSearchTerm("")}
                            />
                    ) : (
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
                        )}
                        </DndContext>
                    </DashboardTableBody>
                </DashboardTableWrapper>
            </DashboardTableContainer>
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
            <Dialog open={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} size="sm">
                <div className="p-8 text-center space-y-6">
                    <div className="w-24 h-24 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto ring-8 ring-rose-500/5"><X className="w-10 h-10" /></div>
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black tracking-tighter uppercase">Confirm Purge</h2>
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
                    <DialogTitle>Matrix Extraction</DialogTitle>
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
                                <div className="font-black text-sm uppercase tracking-tight">Export as {ext}</div>
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
        <DashboardTableRow
            ref={setNodeRef}
            style={style}
            className={cn(
                "grid-cols-[48px_48px_2fr_1fr_100px_120px_80px]",
                isDragging ? "z-50 bg-muted/90 backdrop-blur-xl shadow-2xl ring-2 ring-primary/40" : ""
            )}
        >
            <div className="flex items-center justify-center">
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-muted-foreground opacity-20 group-hover:text-primary group-hover:opacity-100 transition-all p-2"
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
                        className="font-black text-sm uppercase tracking-tight text-foreground group-hover:text-primary transition-colors truncate"
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
            <DashboardTableCell className="text-right">
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
                                <span className="font-black text-xs uppercase tracking-widest">Modify</span>
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
            </DashboardTableCell>
        </DashboardTableRow>
    );
}
