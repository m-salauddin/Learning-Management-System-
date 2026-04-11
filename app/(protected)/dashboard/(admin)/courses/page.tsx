"use client";
import {
    Plus, Search, Edit2, Trash2, MoreHorizontal, Layers,
    Globe, Smartphone, Palette, TrendingUp, Briefcase,
    Database, Code, Shield, Cloud, Info, X,
    RefreshCw, Download, ChevronDown, GripVertical, CheckCircle2, Eye, RefreshCw as RefreshIcon, Archive, BarChart, DollarSign, BookOpen
} from "lucide-react";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useMemo, memo } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    CourseWithInstructor, CourseStatus
} from "@/types/lms";
import {
    getCourses, getCourseStats, deleteCourse, bulkDeleteCourses,
    bulkUpdateCourseStatus, exportCoursesToCSV, exportCoursesToJSON,
    getCategories, publishCourse, unpublishCourse
} from "@/lib/actions/courses";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog, DialogHeader, DialogTitle, DialogDescription,
    DialogFooter, DialogBody
} from "@/components/ui/Dialog";
import { Pagination } from "@/components/ui/Pagination";
import { useToast } from "@/components/ui/toast";
import { AnimatedCheckbox } from "@/components/ui/AnimatedCheckbox";
import { useAppDispatch } from "@/lib/store/hooks";
import { reorderCourses } from "@/lib/store/features/courses/coursesSlice";
import { SearchInput, StatusBadge, LevelBadge, StatsSkeleton, LoadingState, EmptyFilterState } from "@/components/dashboard/shared";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
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
const CourseRow = memo(({
    course,
    isSelected,
    onSelect,
    onDelete,
    onTogglePublish,
    router
}: {
    course: CourseWithInstructor,
    isSelected: boolean,
    onSelect: () => void,
    onDelete: (id: string) => void,
    onTogglePublish: (course: CourseWithInstructor) => void,
    router: any
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: course.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
    };
    return (
        <DashboardTableRow
            ref={setNodeRef}
            style={style}
            className={cn(
                "grid-cols-[48px_48px_60px_2.5fr_1fr_120px_100px_100px_80px]",
                isDragging ? "z-100 relative bg-muted shadow-2xl ring-2 ring-primary/40 scale-[1.01] transition-transform" : ""
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
                    id={`select-${course.id}`}
                    checked={isSelected}
                    onChange={onSelect}
                />
            </div>
            <div className="px-4 text-center">
                <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-black text-amber-500 tracking-widest">
                    {String(course.serial_number || 0).padStart(2, '0')}
                </span>
            </div>
            <div className="px-4 flex items-center gap-4 min-w-0">
                <div className="w-16 h-11 rounded-xl bg-muted overflow-hidden shrink-0 border border-border/20 shadow-sm relative group-hover:scale-105 transition-transform duration-500">
                    {course.thumbnail_url ? (
                        <Image src={course.thumbnail_url} alt="" fill unoptimized className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted text-[10px] font-black text-muted-foreground uppercase tracking-widest">N/A</div>
                    )}
                </div>
                <div className="flex flex-col min-w-0">
                    <Link
                        href={`/dashboard/courses/${course.id}/edit`}
                        className="font-black text-sm uppercase tracking-tight text-foreground group-hover:text-primary transition-colors truncate"
                    >
                        {course.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                        <span
                            className="text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border"
                            style={{
                                backgroundColor: `${course.category?.color || '#6366f1'}15`,
                                color: course.category?.color || '#6366f1',
                                borderColor: `${course.category?.color || '#6366f1'}30`
                            }}
                        >
                            {course.category?.name || 'GENERIC'}
                        </span>
                        {course.batch_no && (
                            <span className="text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border border-amber-500/20 bg-amber-500/10 text-amber-500">
                                Batch {course.batch_no}
                            </span>
                        )}
                        <span className="text-[9px] text-muted-foreground/40 font-mono uppercase tracking-widest hidden md:block">
                            ID: {course.id.slice(0, 8)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="px-4">
                {course.price > 0 ? (
                    <span className="text-sm font-black tracking-tighter">৳{course.price.toLocaleString()}</span>
                ) : (
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">Scholarship</span>
                )}
            </div>
            <div className="px-4">
                <StatusBadge status={course.status} />
            </div>
            <div className="px-4 text-center">
                <LevelBadge level={course.level || 'beginner'} />
            </div>
            <div className="px-4 text-center">
                <div className="inline-flex flex-col items-center">
                    <span className="text-sm font-black tracking-tight">{course.total_students || 0}</span>
                    <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest opacity-40">Engaged</span>
                </div>
            </div>
            <DashboardTableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-2.5 rounded-xl hover:bg-muted font-medium transition-all text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl border-border/40 bg-card/85 backdrop-blur-2xl shadow-2xl">
                        <DropdownMenuItem className="rounded-xl gap-3 cursor-pointer p-3 focus:bg-primary/10 focus:text-primary" onClick={() => router.push(`/courses/${course.slug}`)}>
                            <Eye className="w-4 h-4" />
                            <span className="font-black text-xs uppercase tracking-widest">Deep View</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl gap-3 cursor-pointer p-3 focus:bg-primary/10 focus:text-primary" onClick={() => router.push(`/dashboard/courses/${course.id}/edit`)}>
                            <Edit2 className="w-4 h-4" />
                            <span className="font-black text-xs uppercase tracking-widest">Modify</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/20 mx-1 my-1.5" />
                        <DropdownMenuItem className="rounded-xl gap-3 cursor-pointer p-3 focus:bg-primary/10 focus:text-primary" onClick={() => onTogglePublish(course)}>
                            {course.status === 'published' ? <Archive className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            <span className="font-black text-xs uppercase tracking-widest">{course.status === 'published' ? 'Archive catalog' : 'Deploy catalog'}</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/20 mx-1 my-1.5" />
                        <DropdownMenuItem onClick={() => onDelete(course.id)} className="rounded-xl gap-3 cursor-pointer p-3 focus:bg-destructive/10 focus:text-destructive text-destructive">
                            <Trash2 className="w-4 h-4" />
                            <span className="font-black text-xs uppercase tracking-widest">Purge</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </DashboardTableCell>
        </DashboardTableRow>
    );
});
CourseRow.displayName = "CourseRow";
export default function CourseManagementPage() {
    const toast = useToast();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {})
    );
    const [courses, setCourses] = useState<CourseWithInstructor[]>([]);
    const [stats, setStats] = useState<any | null>(null);
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [levelFilter, setLevelFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCourses, setTotalCourses] = useState(0);
    const [onlyLatestBatch, setOnlyLatestBatch] = useState(true);
    const [exportModal, setExportModal] = useState(false);
    const fetchCoursesData = async () => {
        setIsLoading(true);
        try {
            const result = await getCourses({
                search: searchTerm,
                category: categoryFilter,
                status: statusFilter as any,
                level: levelFilter,
                page: currentPage,
                pageSize,
                sort: 'serial',
                onlyLatestBatch: onlyLatestBatch
            });
            if (result.data) {
                setCourses(result.data);
                setTotalCourses(result.total);
            } else {
                toast.error('Failed to fetch courses');
            }
        } catch (error) {
            console.error('Error in fetchCoursesData:', error);
            toast.error('Error fetching courses');
        }
        setIsLoading(false);
    };
    const fetchStatsData = async () => {
        const result = await getCourseStats();
        if (result.stats) {
            setStats(result.stats);
        }
    };
    const fetchCategoriesData = async () => {
        const result = await getCategories();
        if (result.data) {
            setCategories(result.data);
        }
    };
    useEffect(() => {
        fetchCoursesData();
    }, [searchTerm, categoryFilter, statusFilter, levelFilter, currentPage, pageSize, onlyLatestBatch]);
    useEffect(() => {
        fetchStatsData();
        fetchCategoriesData();
    }, []);
    const toggleSelectAll = () => {
        if (selectedCourses.size === courses.length && courses.length > 0) {
            setSelectedCourses(new Set());
        } else {
            setSelectedCourses(new Set(courses.map(c => c.id)));
        }
    };
    const toggleSelectCourse = (courseId: string) => {
        const newSelected = new Set(selectedCourses);
        if (newSelected.has(courseId)) {
            newSelected.delete(courseId);
        } else {
            newSelected.add(courseId);
        }
        setSelectedCourses(newSelected);
    };
    const clearSelection = () => {
        setSelectedCourses(new Set());
    };
    const handleDeleteCourse = async (courseId: string) => {
        if (!confirm("Are you sure you want to delete this course?")) return;
        const result = await deleteCourse(courseId);
        if (result.success) {
            toast.success('Course deleted successfully');
            fetchCoursesData();
            fetchStatsData();
        } else {
            toast.error('Failed to delete course');
        }
    };
    const handleBulkAction = async (action: 'delete' | 'publish' | 'unpublish') => {
        if (action === 'delete') {
            if (!confirm(`Are you sure you want to delete ${selectedCourses.size} courses?`)) return;
            const result = await bulkDeleteCourses(Array.from(selectedCourses));
            if (result.success) {
                toast.success(`${result.deletedCount} courses deleted`);
            } else {
                toast.error('Failed to delete courses');
            }
        } else if (action === 'publish') {
            const result = await bulkUpdateCourseStatus(Array.from(selectedCourses), 'published');
            if (result.success) {
                toast.success(`${result.updatedCount} courses published`);
            } else {
                toast.error('Failed to publish courses');
            }
        } else if (action === 'unpublish') {
            const result = await bulkUpdateCourseStatus(Array.from(selectedCourses), 'draft');
            if (result.success) {
                toast.success(`${result.updatedCount} courses unpublished`);
            } else {
                toast.error('Failed to unpublish courses');
            }
        }
        setSelectedCourses(new Set());
        fetchCoursesData();
        fetchStatsData();
    };
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = courses.findIndex((item) => item.id === active.id);
            const newIndex = courses.findIndex((item) => item.id === over.id);
            const newOrder = arrayMove(courses, oldIndex, newIndex);
            const localOrder = newOrder.map((c, i) => ({
                ...c,
                serial_number: i + 1 + (currentPage - 1) * pageSize
            }));
            setCourses(localOrder);
            const loadingId = toast.loading("Serializing...", "Synchronizing catalog structure");
            const resultAction = await dispatch(reorderCourses(localOrder as any));
            toast.dismiss(loadingId);
            if (reorderCourses.rejected.match(resultAction)) {
                toast.error(resultAction.payload as string || "Failed to synchronize order");
                fetchCoursesData();
            } else {
                toast.success("Order synchronized successfully");
            }
        }
    };
    const togglePublishStatus = async (course: CourseWithInstructor) => {
        const action = course.status === 'published' ? unpublishCourse : publishCourse;
        const result = await action(course.id);
        if (result.success) {
            toast.success(`Course ${course.status === 'published' ? 'unpublished' : 'published'} successfully`);
            fetchCoursesData();
            fetchStatsData();
        } else {
            toast.error(`Failed to update status`);
        }
    };
    const handleExportCSV = async () => {
        const result = await exportCoursesToCSV({ search: searchTerm, category: categoryFilter, status: statusFilter as any });
        if (result.csv) {
            const blob = new Blob([result.csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `courses-export-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success('Courses exported to CSV');
            setExportModal(false);
        } else {
            toast.error('Failed to export courses');
        }
    };
    const handleExportJSON = async () => {
        const result = await exportCoursesToJSON({ search: searchTerm, category: categoryFilter, status: statusFilter as any });
        if (result.json) {
            const blob = new Blob([result.json], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `courses-export-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success('Courses exported to JSON');
            setExportModal(false);
        } else {
            toast.error('Failed to export courses');
        }
    };
    const handleExportPDF = async () => {
        const result = await exportCoursesToJSON({ search: searchTerm, category: categoryFilter, status: statusFilter as any });
        if (result.json) {
            try {
                const coursesData = JSON.parse(result.json);
                const doc = new jsPDF();
                doc.setFillColor(63, 81, 181);
                doc.rect(0, 0, 210, 40, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(22);
                doc.setFont("helvetica", "bold");
                doc.text("Dokkhota IT LMS", 14, 25);
                doc.setFontSize(12);
                doc.setFont("helvetica", "normal");
                doc.text("Course Report", 14, 33);
                doc.setTextColor(100, 100, 100);
                doc.setFontSize(10);
                doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 50);
                doc.text(`Total Courses: ${coursesData.length}`, 14, 56);
                const tableColumn = ["Title", "Category", "Status", "Price", "Students"];
                const tableRows = coursesData.map((course: any) => [
                    course.title,
                    course.category?.name || "N/A",
                    (course.status || "draft").toUpperCase(),
                    `BDT ${course.price}`,
                    course.total_students || 0
                ]);
                autoTable(doc, {
                    head: [tableColumn],
                    body: tableRows,
                    startY: 65,
                    theme: 'grid',
                    styles: { fontSize: 9 },
                    headStyles: { fillColor: [63, 81, 181] }
                });
                doc.save(`courses-export-${new Date().toISOString().split('T')[0]}.pdf`);
                toast.success('Courses exported to PDF');
                setExportModal(false);
            } catch (err) {
                console.error(err);
                toast.error('Failed to generate PDF');
            }
        }
    };
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-10 font-sans">
            <PageHeader
                title="Course Management"
                description="Create, edit, and track performance of all courses"
                icon={BookOpen}
                actions={
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setExportModal(true)}
                            className="px-5 py-2.5 rounded-xl border border-border/50 bg-card hover:bg-muted/50 text-xs font-black uppercase tracking-widest transition-all inline-flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" /> Export
                        </button>
                        <Link href="/dashboard/courses/new">
                            <button className="bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 inline-flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Create Course
                            </button>
                        </Link>
                    </div>
                }
            />

            <DashboardGrid cols={4}>
                {!stats ? (
                    <StatsSkeleton count={4} />
                ) : (
                    <>
                        <StatsCard
                            title="Total Courses"
                            value={stats.total}
                            icon={BookOpen}
                            className="border-blue-500/20"
                        />
                        <StatsCard
                            title="Published"
                            value={stats.published}
                            icon={CheckCircle2}
                            className="border-emerald-500/20"
                        />
                        <StatsCard
                            title="Total Students"
                            value={stats.totalStudents}
                            icon={TrendingUp}
                            className="border-violet-500/20"
                        />
                        <StatsCard
                            title="Revenue (Est.)"
                            value={`৳${(stats.totalRevenue || 0).toLocaleString()}`}
                            icon={DollarSign}
                            className="border-emerald-500/20"
                        />
                    </>
                )}
            </DashboardGrid>
            {/* Main Table Interface */}
            <DashboardTableContainer>
                <DashboardTableToolbar className="flex-col 2xl:flex-row items-start 2xl:items-center p-6 gap-6">
                    <div className="flex w-full 2xl:w-auto items-center gap-3 bg-card/50 p-2 rounded-2xl border border-border/50">
                        <SearchInput
                            value={searchTerm}
                            onChange={(value) => { setSearchTerm(value); setCurrentPage(1); }}
                            placeholder="Search courses..."
                            debounceMs={300}
                            isSearching={isLoading}
                            disabled={!stats || stats.total === 0}
                            className="flex-1"
                        />
                        <button
                            onClick={fetchCoursesData}
                            className="h-11 w-11 flex items-center justify-center shrink-0 rounded-xl border border-border/30 hover:bg-muted/50 transition-all text-muted-foreground group"
                            title="Refresh"
                        >
                            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                        </button>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-full sm:w-fit min-w-[140px] rounded-xl">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full sm:w-fit min-w-[140px] rounded-xl">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={levelFilter} onValueChange={setLevelFilter}>
                            <SelectTrigger className="w-full sm:w-fit min-w-[140px] rounded-xl">
                                <SelectValue placeholder="Level" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="all">All Levels</SelectItem>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                        </Select>
                        <button
                            onClick={() => setOnlyLatestBatch(!onlyLatestBatch)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-border/30",
                                onlyLatestBatch
                                    ? "bg-primary/10 text-primary border-primary/20"
                                    : "bg-muted/10 text-muted-foreground hover:bg-muted/20"
                            )}
                        >
                            <Layers className="w-3.5 h-3.5" />
                            <span>Latest Batch {onlyLatestBatch ? 'Active' : 'Disabled'}</span>
                        </button>
                        {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || levelFilter !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setCategoryFilter('all');
                                    setStatusFilter('all');
                                    setLevelFilter('all');
                                    setCurrentPage(1);
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 text-destructive text-xs font-bold hover:bg-destructive/20 transition-all"
                            >
                                <X className="w-3.5 h-3.5" />
                                Clear
                            </button>
                        )}
                    </div>
                </DashboardTableToolbar>
                {isLoading ? (
                    <LoadingState message="Synchronizing Catalog..." />
                ) : courses.length === 0 ? (
                    <EmptyFilterState searchTerm={searchTerm || categoryFilter !== 'all' ? "your filters" : ""} />
                ) : (
                    <DashboardTableWrapper className="min-w-[1100px]">
                        <DashboardTableHeader className="grid-cols-[48px_48px_60px_2.5fr_1fr_120px_100px_100px_80px]">
                            <div className="flex items-center justify-center"></div>
                            <div className="flex justify-center">
                                <AnimatedCheckbox id="select-all" checked={selectedCourses.size === courses.length && courses.length > 0} onChange={toggleSelectAll} />
                            </div>
                            <DashboardTableHead className="text-center">Serial</DashboardTableHead>
                            <DashboardTableHead>Course / Identity</DashboardTableHead>
                            <DashboardTableHead>Monetization</DashboardTableHead>
                            <DashboardTableHead>Lifecycle</DashboardTableHead>
                            <DashboardTableHead className="text-center">Proficiency</DashboardTableHead>
                            <DashboardTableHead className="text-center">Impact</DashboardTableHead>
                            <DashboardTableHead className="text-right">Action</DashboardTableHead>
                        </DashboardTableHeader>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                            modifiers={[restrictToVerticalAxis]}
                        >
                            <SortableContext
                                items={courses.map((c) => c.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <DashboardTableBody>
                                    {courses.map((course) => (
                                        <CourseRow
                                            key={course.id}
                                            course={course}
                                            isSelected={selectedCourses.has(course.id)}
                                            onSelect={() => toggleSelectCourse(course.id)}
                                            onDelete={handleDeleteCourse}
                                            onTogglePublish={togglePublishStatus}
                                            router={router}
                                        />
                                    ))}
                                </DashboardTableBody>
                            </SortableContext>
                        </DndContext>
                    </DashboardTableWrapper>
                )}
                {!isLoading && totalCourses > pageSize && (
                    <div className="p-6 border-t border-border/20 bg-muted/5">
                        <Pagination
                            currentPage={currentPage}
                            totalItems={totalCourses}
                            pageSize={pageSize}
                            totalPages={Math.ceil(totalCourses / pageSize)}
                            onPageChange={setCurrentPage}
                            onPageSizeChange={(size) => {
                                setPageSize(size);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                )}
            </DashboardTableContainer>
            <AnimatePresence>
                {selectedCourses.size > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 p-2.5 rounded-2xl border border-primary/20 bg-card/90 text-foreground shadow-2xl backdrop-blur-2xl ring-4 ring-primary/5"
                    >
                        <div className="flex items-center gap-3 pl-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-xs">{selectedCourses.size}</div>
                            <span className="text-xs font-black uppercase tracking-widest">Active Selections</span>
                        </div>
                        <div className="h-4 w-px bg-border/40" />
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleBulkAction('publish')} className="p-2.5 rounded-xl hover:bg-emerald-500/10 transition-all text-emerald-500 group" title="Batch Publish">
                                <CheckCircle2 className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleBulkAction('unpublish')} className="p-2.5 rounded-xl hover:bg-amber-500/10 transition-all text-amber-500 group" title="Batch Archive">
                                <Archive className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleBulkAction('delete')} className="p-2.5 rounded-xl hover:bg-rose-500/10 transition-all text-rose-500 group" title="Batch Purge">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="h-4 w-px bg-border/40" />
                        <button onClick={clearSelection} className="p-2.5 rounded-xl hover:bg-muted transition-all text-muted-foreground hover:text-foreground" title="Deselect All">
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
            <Dialog open={exportModal} onClose={() => setExportModal(false)} size="sm">
                <DialogHeader>
                    <DialogTitle>Export Academic Catalog</DialogTitle>
                    <DialogDescription>Choose a high-fidelity format to migrate or report your course taxonomy.</DialogDescription>
                </DialogHeader>
                <DialogBody className="space-y-3">
                    {[
                        { name: 'CSV', desc: 'Spreadsheet Intelligence', color: 'emerald', action: handleExportCSV },
                        { name: 'JSON', desc: 'Developer Grade Schema', color: 'amber', action: handleExportJSON },
                        { name: 'PDF', desc: 'Print Ready Performance', color: 'rose', action: handleExportPDF }
                    ].map(type => (
                        <button
                            key={type.name}
                            onClick={type.action}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-muted/20 hover:bg-primary/5 hover:border-primary/30 transition-all group text-left outline-none"
                        >
                            <div className={cn(
                                "p-3 rounded-xl transition-all group-hover:scale-110",
                                type.color === 'emerald' && "bg-emerald-500/10 text-emerald-500",
                                type.color === 'amber' && "bg-amber-500/10 text-amber-500",
                                type.color === 'rose' && "bg-rose-500/10 text-rose-500"
                            )}>
                                <Download className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-bold text-foreground text-sm tracking-tight">Export as {type.name}</div>
                                <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">{type.desc}</div>
                            </div>
                        </button>
                    ))}
                </DialogBody>
                <DialogFooter>
                    <button onClick={() => setExportModal(false)} className="w-full py-3 rounded-xl border border-border/50 hover:bg-muted font-black text-xs uppercase tracking-widest transition-all">Dismiss Interface</button>
                </DialogFooter>
            </Dialog>
        </motion.div>
    );
}
