"use client";
import {
    Plus, Search, Edit2, Trash2, MoreHorizontal, Layers,
    Globe, Smartphone, Palette, TrendingUp, Briefcase,
    Database, Code, Shield, Cloud, Info, X,
    RefreshCw, Download, ChevronDown, GripVertical, CheckCircle2, Eye, Archive, BarChart, DollarSign, BookOpen
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
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
    Dialog, DialogHeader, DialogTitle, DialogDescription,
    DialogFooter, DialogBody
} from "@/components/ui/Dialog";
import { Pagination } from "@/components/ui/Pagination";
import { useToast } from "@/components/ui/toast";
import { AnimatedCheckbox } from "@/components/ui/AnimatedCheckbox";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useAppDispatch } from "@/lib/store/hooks";
import { reorderCourses } from "@/lib/store/features/courses/coursesSlice";
import { SearchInput, StatusBadge, LevelBadge, StatsSkeleton, LoadingState, EmptyFilterState, ActionDropdown, DropdownAction } from "@/components/dashboard/shared";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { DashboardGrid } from "@/components/dashboard/ui/DashboardGrid";
import { StatsCard } from "@/components/dashboard/StatsCard";
import {
    DashboardTableToolbar,
    DashboardTableWrapper,
    DashboardTableHeader,
    DashboardTableHead,
    DashboardTableBody,
    DashboardTableRow,
} from "@/components/dashboard/ui/DashboardTable";
const CourseRow = memo(({
    course,
    isSelected,
    onSelect,
    onDelete,
    onTogglePublish,
    router,
    activeMenu,
    setActiveMenu
}: {
    course: CourseWithInstructor,
    isSelected: boolean,
    onSelect: () => void,
    onDelete: (id: string) => void,
    onTogglePublish: (course: CourseWithInstructor) => void,
    router: AppRouterInstance,
    activeMenu: string | null,
    setActiveMenu: (id: string | null) => void
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
                "min-w-[1100px] py-3.5 px-6 hover:bg-muted/40 group/row border-b border-border/80 transition-colors last:border-0 items-center gap-4",
                "grid-cols-[48px_48px_60px_2.5fr_1fr_120px_100px_100px_60px]",
                isDragging ? "z-100 relative bg-card shadow-2xl ring-2 ring-primary/40 scale-[1.01] transition-transform" : "bg-card"
            )}
        >
            <div className="flex items-center justify-center">
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing text-muted-foreground opacity-20 group-hover/row:opacity-100 transition-all p-1"
                >
                    <GripVertical className="w-3.5 h-3.5" />
                </div>
            </div>
            <div className="flex items-center justify-center">
                <AnimatedCheckbox
                    id={`select-${course.id}`}
                    checked={isSelected}
                    onChange={onSelect}
                />
            </div>
            <div className="flex items-center justify-center">
                <span className="px-2 py-0.5 rounded-lg bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary tracking-widest">
                    {String(course.serial_number || 0).padStart(2, '0')}
                </span>
            </div>
            <div className="flex items-center gap-3.5 min-w-0 pr-4">
                <div className="w-14 h-9 rounded-lg bg-muted overflow-hidden shrink-0 border border-border/40 shadow-sm relative group-hover/row:scale-105 transition-transform duration-500">
                    {course.thumbnail_url ? (
                        <Image src={course.thumbnail_url} alt="" fill unoptimized className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted text-[8px] font-black text-muted-foreground uppercase tracking-widest">N/A</div>
                    )}
                </div>
                <div className="flex flex-col min-w-0">
                    <Link
                        href={`/dashboard/courses/${course.id}/edit`}
                        className="font-bold text-[13px] text-foreground group-hover/row:text-primary transition-colors truncate leading-tight"
                    >
                        {course.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1">
                        <span
                            className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted/50 border border-border/40"
                            style={{
                                color: course.category?.color || 'currentColor',
                            }}
                        >
                            {course.category?.name || 'GENERIC'}
                        </span>
                        {course.batch_no && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-amber-500/20 bg-amber-500/10 text-amber-600">
                                BATCH {course.batch_no}
                            </span>
                        )}
                        <span className="text-[9px] text-muted-foreground/30 font-mono uppercase tracking-widest hidden lg:block">
                            ID: {course.id.slice(0, 8)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-start text-[13px] font-bold text-foreground">
                {course.price > 0 ? (
                    `৳${course.price.toLocaleString()}`
                ) : (
                    <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">Scholarship</span>
                )}
            </div>
            <div className="flex items-center justify-start">
                <StatusBadge status={course.status} />
            </div>
            <div className="flex items-center justify-center">
                <LevelBadge level={course.level || 'beginner'} />
            </div>
            <div className="flex flex-col items-center justify-center">
                <span className="text-[13px] font-bold text-foreground">{course.total_students || 0}</span>
                <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-[0.2em] opacity-40">Engaged</span>
            </div>
            <div className="flex justify-center items-center">
                <ActionDropdown 
                    id={course.id}
                    title="Course Controls"
                    activeId={activeMenu}
                    setActiveId={setActiveMenu}
                    actions={[
                        {
                            label: "Deep view",
                            icon: Eye,
                            onClick: () => router.push(`/courses/${course.slug}`),
                            variant: 'warning'
                        },
                        {
                            label: "Modify course",
                            icon: Edit2,
                            onClick: () => router.push(`/dashboard/courses/${course.id}/edit`),
                            variant: 'warning'
                        },
                        {
                            label: course.status === 'published' ? 'Archive catalog' : 'Deploy catalog',
                            icon: course.status === 'published' ? Archive : Plus,
                            onClick: () => onTogglePublish(course),
                            variant: 'success'
                        },
                        {
                            label: "Purge record",
                            icon: Trash2,
                            onClick: () => onDelete(course.id),
                            variant: 'danger'
                        }
                    ]}
                />
            </div>
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
    const [exportModal, setExportModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: string | null }>({ isOpen: false, id: null });
    const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
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
                sort: 'serial'
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
    }, [searchTerm, categoryFilter, statusFilter, levelFilter, currentPage, pageSize]);
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
    const handleDeleteCourse = (courseId: string) => {
        setDeleteModal({ isOpen: true, id: courseId });
    };

    const confirmDelete = async () => {
        if (!deleteModal.id) return;
        
        setIsLoading(true);
        const result = await deleteCourse(deleteModal.id);
        if (result.success) {
            toast.success('Course deleted successfully');
            fetchCoursesData();
            fetchStatsData();
        } else {
            toast.error('Failed to delete course');
        }
        setIsLoading(false);
        setDeleteModal({ isOpen: false, id: null });
    };

    const handleBulkAction = async (action: 'delete' | 'publish' | 'unpublish') => {
        if (action === 'delete') {
            setBulkDeleteModalOpen(true);
            return;
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

    const confirmBulkDelete = async () => {
        setIsLoading(true);
        const result = await bulkDeleteCourses(Array.from(selectedCourses));
        if (result.success) {
            toast.success(`${result.deletedCount} courses deleted`);
            setSelectedCourses(new Set());
            fetchCoursesData();
            fetchStatsData();
        } else {
            toast.error('Failed to delete courses');
        }
        setIsLoading(false);
        setBulkDeleteModalOpen(false);
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
                            className="px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-muted/50 text-[11px] font-bold uppercase tracking-wider transition-all inline-flex items-center gap-2 shadow-sm"
                        >
                            <Download className="w-4 h-4 text-primary" /> Export
                        </button>
                        <Link href="/dashboard/courses/new">
                            <button className="bg-primary text-white px-6 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-primary/90 transition-all shadow-sm inline-flex items-center gap-2">
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
                            variant="blue"
                            className="border-blue-500/20"
                        />
                        <StatsCard
                            title="Published"
                            value={stats.published}
                            icon={CheckCircle2}
                            variant="emerald"
                            className="border-emerald-500/20"
                        />
                        <StatsCard
                            title="Total Students"
                            value={stats.totalStudents}
                            icon={TrendingUp}
                            variant="violet"
                            className="border-violet-500/20"
                        />
                        <StatsCard
                            title="Revenue (Est.)"
                            value={`৳${(stats.totalRevenue || 0).toLocaleString()}`}
                            icon={DollarSign}
                            variant="amber"
                            className="border-amber-500/20"
                        />
                    </>
                )}
            </DashboardGrid>
            <div className="rounded-[1.5rem] bg-card border border-border shadow-md overflow-hidden">
                <DashboardTableToolbar className="flex-col xl:flex-row items-stretch xl:items-center px-6 py-4 gap-4 border-b border-border bg-muted/10 rounded-none">
                    <div className="flex flex-1 items-center gap-3">
                        <SearchInput
                            value={searchTerm}
                            onChange={(value) => { setSearchTerm(value); setCurrentPage(1); }}
                            placeholder="Search courses..."
                            isSearching={isLoading}
                            disabled={!stats || stats.total === 0}
                        />
                        <button
                            onClick={fetchCoursesData}
                            className="h-10 w-10 flex items-center justify-center shrink-0 rounded-xl bg-card border border-border hover:bg-muted transition-all text-muted-foreground hover:text-primary active:scale-95 shadow-sm"
                            title="Refresh catalog data"
                        >
                            <RefreshCw className={cn("w-4 h-4 text-primary", isLoading && "animate-spin")} />
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-3 bg-background p-1 rounded-xl border border-border shadow-sm">
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-fit min-w-[140px] rounded-lg font-bold text-[11px] uppercase tracking-wider h-8 bg-transparent border-none hover:bg-muted transition-all">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border bg-card text-foreground">
                                    <SelectItem value="all" className="text-[11px] font-bold">ALL CATEGORIES</SelectItem>
                                    {categories.map(c => <SelectItem key={c.id} value={c.id} className="text-[11px] font-bold">{c.name.toUpperCase()}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <div className="w-px h-4 bg-border" />
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-fit min-w-[120px] rounded-lg font-bold text-[11px] uppercase tracking-wider h-8 bg-transparent border-none hover:bg-muted transition-all">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border bg-card text-foreground">
                                    <SelectItem value="all" className="text-[11px] font-bold">ALL STATUS</SelectItem>
                                    <SelectItem value="published" className="text-[11px] font-bold">PUBLISHED</SelectItem>
                                    <SelectItem value="draft" className="text-[11px] font-bold">DRAFT</SelectItem>
                                    <SelectItem value="archived" className="text-[11px] font-bold">ARCHIVED</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="w-px h-4 bg-border" />
                            <Select value={levelFilter} onValueChange={setLevelFilter}>
                                <SelectTrigger className="w-fit min-w-[120px] rounded-lg font-bold text-[11px] uppercase tracking-wider h-8 bg-transparent border-none hover:bg-muted transition-all">
                                    <SelectValue placeholder="Level" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-border bg-card text-foreground">
                                    <SelectItem value="all" className="text-[11px] font-bold">ALL LEVELS</SelectItem>
                                    <SelectItem value="beginner" className="text-[11px] font-bold">BEGINNER</SelectItem>
                                    <SelectItem value="intermediate" className="text-[11px] font-bold">INTERMEDIATE</SelectItem>
                                    <SelectItem value="advanced" className="text-[11px] font-bold">ADVANCED</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </DashboardTableToolbar>
                <DashboardTableWrapper className="min-w-[1100px] dashboard-scrollbar">
                        <DashboardTableHeader className="grid-cols-[48px_48px_60px_2.5fr_1fr_120px_100px_100px_60px] bg-muted/30 border-b border-border/80 px-6 py-3.5 items-center gap-4">
                            <div className="flex items-center justify-center"></div>
                            <div className="flex justify-center">
                                <AnimatedCheckbox id="select-all" checked={selectedCourses.size === courses.length && courses.length > 0} onChange={toggleSelectAll} />
                            </div>
                            <DashboardTableHead className="px-0 text-center">Serial</DashboardTableHead>
                            <DashboardTableHead className="px-0">Course / Identity</DashboardTableHead>
                            <DashboardTableHead className="px-0">Monetization</DashboardTableHead>
                            <DashboardTableHead className="px-0">Lifecycle</DashboardTableHead>
                            <DashboardTableHead className="px-0 text-center">Proficiency</DashboardTableHead>
                            <DashboardTableHead className="px-0 text-center">Impact</DashboardTableHead>
                            <DashboardTableHead className="px-0 text-center">Action</DashboardTableHead>
                        </DashboardTableHeader>
                        <DashboardTableBody>
                            {isLoading ? (
                                <LoadingState 
                                    message="Synchronizing Catalog..." 
                                    gridClass="grid-cols-[48px_48px_60px_2.5fr_1fr_120px_100px_100px_60px]"
                                    rows={8}
                                    className="px-6"
                                />
                            ) : courses.length === 0 ? (
                                <EmptyFilterState searchTerm={searchTerm || categoryFilter !== 'all' ? "your filters" : ""} />
                            ) : (
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
                                        {courses.map((course) => (
                                            <CourseRow
                                                key={course.id}
                                                course={course}
                                                isSelected={selectedCourses.has(course.id)}
                                                onSelect={() => toggleSelectCourse(course.id)}
                                                onDelete={() => setDeleteModal({ isOpen: true, id: course.id })}
                                                onTogglePublish={togglePublishStatus}
                                                router={router}
                                                activeMenu={activeMenu}
                                                setActiveMenu={setActiveMenu}
                                            />
                                        ))}
                                    </SortableContext>
                                </DndContext>
                            )}
                        </DashboardTableBody>
                    </DashboardTableWrapper>

                {!isLoading && totalCourses > pageSize && (
                    <div className="px-6 py-4 border-t border-border bg-muted/10">
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
            </div>
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

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                onConfirm={confirmDelete}
                title="Purge Record"
                description="This action is irreversible. The course and all its associated data (modules, lessons, enrollments) will be permanently deleted from the registry."
                confirmText="Yes, Purge"
                isLoading={isLoading}
                variant="danger"
            />

            <ConfirmModal
                isOpen={bulkDeleteModalOpen}
                onClose={() => setBulkDeleteModalOpen(false)}
                onConfirm={confirmBulkDelete}
                title="Bulk Purge"
                description={`You are about to delete ${selectedCourses.size} course records. This action cannot be undone and will affect all enrolled students.`}
                confirmText={`Purge ${selectedCourses.size} Records`}
                isLoading={isLoading}
                variant="danger"
            />
        </motion.div>
    );
}
