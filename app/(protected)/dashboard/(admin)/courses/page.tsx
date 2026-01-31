"use client";

import {
    Search, BookOpen, Trash2, Edit, MoreHorizontal, Filter, ChevronDown,
    Plus, Download, TrendingUp, TrendingDown,
    CheckCircle2, AlertCircle, Eye, RefreshCw, Archive, Layers, BarChart, DollarSign
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
    CourseWithInstructor, CourseStatus
} from "@/types/lms";
import {
    getCourses, getCourseStats, deleteCourse, bulkDeleteCourses,
    bulkUpdateCourseStatus, exportCoursesToCSV, exportCoursesToJSON,
    getCategories, publishCourse, unpublishCourse
} from "@/lib/actions/courses";
import { Select, SelectOption } from "@/components/ui/Select";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { Pagination } from "@/components/ui/Pagination";
import { useToast } from "@/components/ui/toast";
import { AnimatedCheckbox } from "@/components/ui/AnimatedCheckbox";
import Link from "next/link";
import Image from "next/image";

export default function CourseManagementPage() {
    // Toast
    const toast = useToast();

    // State Management
    const [courses, setCourses] = useState<CourseWithInstructor[]>([]);
    const [stats, setStats] = useState<any | null>(null);
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());

    // Filters & Pagination
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [levelFilter, setLevelFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCourses, setTotalCourses] = useState(0);

    // Modals & Confirmation (Simplified for now using window.confirm or similar pattern)
    const [bulkActionModal, setBulkActionModal] = useState<'delete' | 'publish' | 'unpublish' | null>(null);
    const [exportModal, setExportModal] = useState(false);

    // Fetch Data
    const fetchCoursesData = async () => {
        setIsLoading(true);
        const result = await getCourses({
            search: searchTerm,
            category: categoryFilter,
            status: statusFilter as any,
            level: levelFilter,
            page: currentPage,
            pageSize
        });

        if (result.data) {
            setCourses(result.data);
            setTotalCourses(result.total);
        } else {
            toast.error('Failed to fetch courses');
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

    // Selection Handlers
    const toggleSelectAll = () => {
        if (selectedCourses.size === courses.length) {
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

    // Action Handlers
    const handleDeleteCourse = async (courseId: string) => {
        if (!confirm("Are you sure you want to delete this course?")) return;

        const result = await deleteCourse(courseId);
        if (result.success) {
            toast.success('Course deleted successfully');
            fetchCoursesData();
            fetchStatsData();
        } else {
            toast.error('Failed to delete course', result.error || 'An error occurred');
        }
    };

    const handleBulkAction = async () => {
        if (bulkActionModal === 'delete') {
            if (!confirm(`Are you sure you want to delete ${selectedCourses.size} courses?`)) return;
            const result = await bulkDeleteCourses(Array.from(selectedCourses));
            if (result.success) {
                toast.success(`${result.deletedCount} courses deleted`);
            } else {
                toast.error('Failed to delete courses');
            }
        } else if (bulkActionModal === 'publish') {
            const result = await bulkUpdateCourseStatus(Array.from(selectedCourses), 'published');
            if (result.success) {
                toast.success(`${result.updatedCount} courses published`);
            } else {
                toast.error('Failed to publish courses');
            }
        } else if (bulkActionModal === 'unpublish') {
            const result = await bulkUpdateCourseStatus(Array.from(selectedCourses), 'draft');
            if (result.success) {
                toast.success(`${result.updatedCount} courses unpublished`);
            } else {
                toast.error('Failed to unpublish courses');
            }
        }

        setBulkActionModal(null);
        setSelectedCourses(new Set());
        fetchCoursesData();
        fetchStatsData();
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

    // Export Handlers
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

    // Helper Styles
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'published': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
            case 'draft': return 'bg-muted text-muted-foreground border-border/50';
            case 'archived': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const getLevelStyle = (level: string) => {
        switch (level) {
            case 'beginner': return 'text-emerald-500';
            case 'intermediate': return 'text-blue-500';
            case 'advanced': return 'text-rose-500';
            default: return 'text-muted-foreground';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 pb-10 font-sans"
        >
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold tracking-tight"
                    >
                        Course Management
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground mt-1"
                    >
                        Create, edit, and track performance of all courses
                    </motion.p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setExportModal(true)}
                        className="px-4 py-2.5 rounded-xl border border-border/50 bg-background/50 hover:bg-background text-sm font-semibold transition-all flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </motion.button>
                    <Link href="/dashboard/courses/new">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create Course</span>
                        </motion.button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {!stats ? (
                    [...Array(4)].map((_, i) => (
                        <div key={`skel-${i}`} className="p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-xl animate-pulse">
                            <div className="h-4 w-24 bg-muted/40 rounded mb-3" />
                            <div className="h-8 w-16 bg-muted/40 rounded" />
                        </div>
                    ))
                ) : (
                    [
                        { label: 'Total Courses', value: stats.total, icon: BookOpen, color: 'blue' },
                        { label: 'Published', value: stats.published, icon: CheckCircle2, color: 'emerald' },
                        { label: 'Total Students', value: stats.totalStudents, icon: TrendingUp, color: 'violet' },
                        { label: 'Revenue (Est.)', value: `৳${(stats.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'emerald' }
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
                                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                                    <p className="text-3xl font-bold mt-2">{stat.value}</p>
                                </div>
                                <div className={cn(
                                    "p-3 rounded-xl",
                                    stat.color === 'blue' && "bg-blue-500/10 text-blue-600",
                                    stat.color === 'emerald' && "bg-emerald-500/10 text-emerald-600",
                                    stat.color === 'violet' && "bg-violet-500/10 text-violet-600",
                                    stat.color === 'rose' && "bg-rose-500/10 text-rose-600"
                                )}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Main Table Container */}
            <div className="rounded-3xl border border-border/40 bg-card/30 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/5">

                {/* Toolbar */}
                <div className="p-4 md:p-6 border-b border-border/40 bg-muted/20">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between">
                        {/* Search */}
                        <div className="relative w-full lg:max-w-md group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background/50 border border-border/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/70"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Select value={categoryFilter} onChange={setCategoryFilter} icon={<Layers className="w-4 h-4" />} className="w-full sm:w-36">
                                <SelectOption value="all">Category</SelectOption>
                                {categories.map(c => <SelectOption key={c.id} value={c.id}>{c.name}</SelectOption>)}
                            </Select>

                            <Select value={statusFilter} onChange={setStatusFilter} icon={<BookOpen className="w-4 h-4" />} className="w-full sm:w-36">
                                <SelectOption value="all">Status</SelectOption>
                                <SelectOption value="published">Published</SelectOption>
                                <SelectOption value="draft">Draft</SelectOption>
                                <SelectOption value="archived">Archived</SelectOption>
                            </Select>

                            <Select value={levelFilter} onChange={setLevelFilter} icon={<BarChart className="w-4 h-4" />} className="w-full sm:w-36">
                                <SelectOption value="all">Level</SelectOption>
                                <SelectOption value="beginner">Beginner</SelectOption>
                                <SelectOption value="intermediate">Intermediate</SelectOption>
                                <SelectOption value="advanced">Advanced</SelectOption>
                            </Select>

                            <button onClick={fetchCoursesData} className="p-2.5 rounded-xl border border-border/50 bg-background/50 hover:bg-background hover:text-primary transition-colors text-muted-foreground">
                                <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                            </button>

                            {selectedCourses.size > 0 && (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
                                    <span className="text-sm font-semibold text-primary">{selectedCourses.size} selected</span>
                                    <div className="flex gap-1">
                                        <button onClick={() => { setBulkActionModal('publish'); handleBulkAction(); }} className="p-2 rounded-lg hover:bg-primary/20 transition-colors" title="Publish">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        </button>
                                        <button onClick={() => { setBulkActionModal('unpublish'); handleBulkAction(); }} className="p-2 rounded-lg hover:bg-primary/20 transition-colors" title="Unpublish">
                                            <Archive className="w-4 h-4 text-amber-500" />
                                        </button>
                                        <button onClick={() => { setBulkActionModal('delete'); handleBulkAction(); }} className="p-2 rounded-lg hover:bg-red-500/20 transition-colors" title="Delete">
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/10 text-muted-foreground font-semibold uppercase tracking-wider text-xs border-b border-border/40">
                            <tr>
                                <th className="px-6 py-4">
                                    <AnimatedCheckbox id="select-all" checked={selectedCourses.size === courses.length && courses.length > 0} onChange={toggleSelectAll} />
                                </th>
                                <th className="px-6 py-4">Course</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Level</th>
                                <th className="px-6 py-4">Students</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="border-b border-border/40">
                                        <td className="px-6 py-4"><div className="w-5 h-5 bg-muted/40 rounded animate-pulse" /></td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-8 rounded bg-muted/40 animate-pulse" />
                                                <div className="h-4 w-32 bg-muted/40 rounded animate-pulse" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><div className="h-4 w-16 bg-muted/40 rounded animate-pulse" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-20 bg-muted/40 rounded-full animate-pulse" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-20 bg-muted/40 rounded animate-pulse" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-12 bg-muted/40 rounded animate-pulse" /></td>
                                        <td className="px-6 py-4"><div className="h-8 w-8 bg-muted/40 rounded ml-auto animate-pulse" /></td>
                                    </tr>
                                ))
                            ) : courses.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-20 text-center text-muted-foreground">No courses found matching your filters.</td>
                                </tr>
                            ) : (
                                courses.map((course, i) => (
                                    <motion.tr
                                        key={course.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="hover:bg-primary/5 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <AnimatedCheckbox
                                                id={`select-${course.id}`}
                                                checked={selectedCourses.has(course.id)}
                                                onChange={() => toggleSelectCourse(course.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-14 h-10 rounded-lg bg-muted overflow-hidden shrink-0 border border-border/20">
                                                    {course.thumbnail_url ? (
                                                        <Image src={course.thumbnail_url} alt="" width={56} height={40} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-muted text-xs text-muted-foreground">No Img</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <Link href={`/courses/${course.slug}`} className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 max-w-[200px]">
                                                        {course.title}
                                                    </Link>
                                                    <div className="text-xs text-muted-foreground">{course.category?.name || 'Uncategorized'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm">
                                            {course.price > 0 ? `৳${course.price.toLocaleString()}` : <span className="text-emerald-500 font-bold">Free</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize border", getStatusStyle(course.status))}>
                                                <span className={cn("w-1.5 h-1.5 rounded-full",
                                                    course.status === 'published' ? "bg-emerald-500" :
                                                        course.status === 'draft' ? "bg-muted-foreground" : "bg-amber-500"
                                                )} />
                                                {course.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium capitalize">
                                            <span className={getLevelStyle(course.level || 'beginner')}>
                                                {course.level || 'Beginner'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground text-sm">
                                            {course.total_students || 0}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Dropdown trigger={<button className="p-2 rounded-lg hover:bg-muted/50 transition-colors"><MoreHorizontal className="w-4 h-4" /></button>}>
                                                <DropdownItem icon={<Eye className="w-4 h-4" />} onClick={() => window.location.href = `/courses/${course.slug}`}>View Course</DropdownItem>
                                                <DropdownItem icon={<Edit className="w-4 h-4" />} onClick={() => window.location.href = `/dashboard/courses/${course.id}/edit`}>Edit Course</DropdownItem>
                                                <DropdownItem icon={course.status === 'published' ? <Archive className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />} onClick={() => togglePublishStatus(course)}>
                                                    {course.status === 'published' ? 'Unpublish' : 'Publish'}
                                                </DropdownItem>
                                                <DropdownItem icon={<Trash2 className="w-4 h-4" />} destructive onClick={() => handleDeleteCourse(course.id)}>Delete Course</DropdownItem>
                                            </Dropdown>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!isLoading && totalCourses > 0 && (
                    <div className="p-6 border-t border-border/40 bg-muted/10">
                        <Pagination
                            currentPage={currentPage}
                            totalItems={totalCourses}
                            pageSize={pageSize}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>

            {/* Export Modal */}
            {exportModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl">
                        <h2 className="text-xl font-bold mb-2">Export Courses</h2>
                        <p className="text-muted-foreground text-sm mb-6">Choose a format to download your course data.</p>
                        <div className="grid grid-cols-1 gap-3">
                            <button onClick={handleExportCSV} className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-primary/5 hover:border-primary/30 transition-all group text-left">
                                <div className="p-2 rounded-lg bg-green-500/10 text-green-500"><Download className="w-5 h-5" /></div>
                                <div><div className="font-semibold text-foreground">Export as CSV</div><div className="text-xs text-muted-foreground">Best for spreadsheet software</div></div>
                            </button>
                            <button onClick={handleExportJSON} className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-primary/5 hover:border-primary/30 transition-all group text-left">
                                <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500"><Download className="w-5 h-5" /></div>
                                <div><div className="font-semibold text-foreground">Export as JSON</div><div className="text-xs text-muted-foreground">For developer use</div></div>
                            </button>
                            <button onClick={handleExportPDF} className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-primary/5 hover:border-primary/30 transition-all group text-left">
                                <div className="p-2 rounded-lg bg-red-500/10 text-red-500"><Download className="w-5 h-5" /></div>
                                <div><div className="font-semibold text-foreground">Export as PDF</div><div className="text-xs text-muted-foreground">Formatted report</div></div>
                            </button>
                        </div>
                        <button onClick={() => setExportModal(false)} className="mt-6 w-full py-2.5 rounded-xl border border-border/50 hover:bg-muted font-medium transition-colors">Cancel</button>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}
