"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Calendar, Tag, Percent, DollarSign, Search, Filter, RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from "@/components/ui/Dialog";
import { PageHeader } from "@/components/dashboard/ui/PageHeader";
import { StatusBadge, LoadingState, EmptyDataState } from "@/components/dashboard/shared";
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
interface Course {
    id: string;
    title: string;
    price: number;
}
interface Discount {
    id: string;
    course_id: string;
    course: Course;
    type: 'percentage' | 'fixed';
    value: number;
    starts_at: string | null;
    ends_at: string | null;
    is_active: boolean;
    created_at: string;
}
export default function DiscountsPage() {
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        course_id: "",
        type: "percentage" as "percentage" | "fixed",
        value: "",
        starts_at: "",
        ends_at: "",
    });
    const { success, error: toastError } = useToast();
    const supabase = createClient();
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const { data: discountsData, error: discountsError } = await (supabase as any)
                .from('course_discounts')
                .select(`*, course:courses(id, title, price)`)
                .order('created_at', { ascending: false });
            if (discountsError) throw discountsError;
            const { data: coursesData, error: coursesError } = await (supabase as any)
                .from('courses')
                .select('id, title, price')
                .order('title');
            if (coursesError) throw coursesError;
            setDiscounts(discountsData || []);
            setCourses(coursesData || []);
        } catch (error) {
            toastError("Failed to load data");
        } finally {
            setIsLoading(false);
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.course_id || !formData.value) {
            toastError("Please fill in required fields");
            return;
        }
        try {
            const payload = {
                course_id: formData.course_id,
                type: formData.type,
                value: parseInt(formData.value),
                starts_at: formData.starts_at || null,
                ends_at: formData.ends_at || null,
                is_active: true
            };
            const { error } = await (supabase as any).from('course_discounts').insert(payload);
            if (error) throw error;
            success("Discount generated successfully");
            setIsCreating(false);
            setFormData({ course_id: "", type: "percentage", value: "", starts_at: "", ends_at: "" });
            fetchData();
        } catch (error: any) {
            toastError(error.message || "Failed to create discount");
        }
    };
    const toggleActive = async (id: string, currentState: boolean) => {
        try {
            const { error } = await (supabase as any).from('course_discounts').update({ is_active: !currentState }).eq('id', id);
            if (error) throw error;
            setDiscounts(discounts.map(d => d.id === id ? { ...d, is_active: !currentState } : d));
            success("Status updated");
        } catch (error) {
            toastError("Failed to update status");
        }
    };
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this discount?")) return;
        try {
            const { error } = await (supabase as any).from('course_discounts').delete().eq('id', id);
            if (error) throw error;
            setDiscounts(discounts.filter(d => d.id !== id));
            success("Discount purged from matrix");
        } catch (error) {
            toastError("Failed to delete discount");
        }
    };
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10 font-sans text-foreground">
            {}
            <PageHeader
                title="Monetization Adjustments"
                description="Manage dynamic price overrides and seasonal campaigns"
                icon={Tag}
                actions={
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 inline-flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> New Adjustment
                    </button>
                }
            />
            {}
            <DashboardTableContainer>
                <DashboardTableToolbar className="flex justify-between items-center bg-muted/5 border-b border-border/20">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60 px-2">Operational Overrides / {discounts.length} Active</h2>
                    <button onClick={fetchData} className="p-2.5 rounded-xl hover:bg-muted text-muted-foreground transition-all">
                        <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                    </button>
                </DashboardTableToolbar>
                    <DashboardTableWrapper className="min-w-[900px]">
                        <DashboardTableHeader className="grid-cols-[1.5fr_1fr_120px_1fr_80px]">
                            <DashboardTableHead>Target Course Identity</DashboardTableHead>
                            <DashboardTableHead>Value Delta</DashboardTableHead>
                            <DashboardTableHead className="text-center">Lifecycle State</DashboardTableHead>
                            <DashboardTableHead className="text-center">Temporal Bounds</DashboardTableHead>
                            <DashboardTableHead className="text-right">Action</DashboardTableHead>
                        </DashboardTableHeader>
                        <DashboardTableBody>
                            {isLoading ? (
                                <LoadingState 
                                    message="Syncing price map..." 
                                    gridClass="grid-cols-[1.5fr_1fr_120px_1fr_80px]"
                                    rows={5}
                                />
                            ) : discounts.length === 0 ? (
                                <div className="py-20">
                                    <EmptyDataState icon={Tag} title="No Overrides Found" description="There are currently no active price overrides." />
                                </div>
                            ) : (
                                <>
                                    {discounts.map((discount) => (
                                <DashboardTableRow key={discount.id} className="grid-cols-[1.5fr_1fr_120px_1fr_80px]">
                                    <div className="px-4 flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-muted border border-border/20 flex items-center justify-center text-primary opacity-40 group-hover:opacity-100 transition-all group-hover:scale-105 duration-500">
                                            <Tag className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            {discount.course ? (
                                                <>
                                                    <p className="font-black text-sm tracking-tight capitalize truncate">{discount.course.title}</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground/60 tracking-tight font-mono">BASE PRICE: ৳{discount.course.price}</p>
                                                </>
                                            ) : (
                                                <p className="text-destructive text-xs font-black">ORPHANED_DATA</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="px-4">
                                        <div className={cn(
                                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border font-black text-xs tracking-tighter shadow-xs",
                                            discount.type === 'percentage' ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                        )}>
                                            {discount.type === 'percentage' ? <Percent className="w-3.5 h-3.5" /> : <DollarSign className="w-3.5 h-3.5" />}
                                            {discount.value}{discount.type === 'percentage' ? '%' : ''} REDUCTION
                                        </div>
                                    </div>
                                    <div className="px-4 text-center">
                                        <StatusBadge status={discount.is_active ? 'active' : 'inactive'} />
                                    </div>
                                    <div className="px-4 text-center">
                                        <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground/60 font-mono">
                                            <span>{discount.starts_at ? new Date(discount.starts_at).toLocaleDateString() : "INF"}</span>
                                            <span className="opacity-30">→</span>
                                            <span>{discount.ends_at ? new Date(discount.ends_at).toLocaleDateString() : "INF"}</span>
                                        </div>
                                    </div>
                                    <DashboardTableCell className="text-right">
                                        <button
                                            onClick={() => handleDelete(discount.id)}
                                            className="p-3 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </DashboardTableCell>
                                </DashboardTableRow>
                                    ))}</>
                                )}
                            </DashboardTableBody>
                        </DashboardTableWrapper>

            </DashboardTableContainer>
            {}
            <Dialog open={isCreating} onClose={() => setIsCreating(false)} size="md">
                <DialogHeader>
                    <DialogTitle>Forge Adjustment</DialogTitle>
                    <DialogDescription>Define new high-impact price overrides for the academic catalog.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <DialogBody className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Target Identity</label>
                            <select
                                className="w-full h-12 px-4 rounded-xl border border-border/50 bg-card/50 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                value={formData.course_id}
                                onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                                required
                            >
                                <option value="" className="bg-card">Select Entity...</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id} className="bg-card">
                                        {course.title} (৳{course.price})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Algorithm</label>
                                <div className="flex h-12 p-1 rounded-xl bg-muted/30 border border-border/50">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'percentage' })}
                                        className={cn("flex-1 rounded-lg text-xs font-black uppercase tracking-widest transition-all", formData.type === 'percentage' ? "bg-card shadow-lg text-primary" : "text-muted-foreground opacity-50")}
                                    >Percentage</button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'fixed' })}
                                        className={cn("flex-1 rounded-lg text-xs font-black uppercase tracking-widest transition-all", formData.type === 'fixed' ? "bg-card shadow-lg text-primary" : "text-muted-foreground opacity-50")}
                                    >Fixed</button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Magnitude</label>
                                <input
                                    type="number"
                                    className="w-full h-12 px-4 rounded-xl border border-border/50 bg-card/50 text-sm font-bold outline-none ring-primary/20 focus:ring-2"
                                    placeholder={formData.type === 'percentage' ? "Magnitude %" : "Magnitude ৳"}
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Temporal Start</label>
                                <input type="datetime-local" className="w-full h-12 px-4 rounded-xl border border-border/50 bg-card/50 text-xs font-mono outline-none" value={formData.starts_at} onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Temporal End</label>
                                <input type="datetime-local" className="w-full h-12 px-4 rounded-xl border border-border/50 bg-card/50 text-xs font-mono outline-none" value={formData.ends_at} onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })} />
                            </div>
                        </div>
                    </DialogBody>
                    <DialogFooter className="grid grid-cols-2 gap-3 p-6">
                        <button type="button" onClick={() => setIsCreating(false)} className="py-4 bg-muted/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-muted/40 transition-all border border-border/20">Abort</button>
                        <button type="submit" className="py-4 bg-primary text-primary-foreground rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/30">Commit Override</button>
                    </DialogFooter>
                </form>
            </Dialog>
        </motion.div>
    );
}
