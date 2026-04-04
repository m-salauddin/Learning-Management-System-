"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Ticket, Users, Copy, Check, Search, Download, RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useToast } from "@/components/ui/toast";
import { AdminCouponsTable } from "@/components/dashboard/tables/AdminCouponsTable";
import { useAppDispatch } from "@/lib/store/hooks";
import { fetchCoupons } from "@/lib/store/features/admin/couponsSlice";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from "@/components/ui/Dialog";
import { cn } from "@/lib/utils";
interface Course {
    id: string;
    title: string;
}
export default function CouponsPage() {
    const dispatch = useAppDispatch();
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        type: "percentage" as "percentage" | "fixed",
        value: "",
        max_uses: "",
        starts_at: "",
        ends_at: "",
        apply_to: "all" as "all" | "specific",
        selected_courses: [] as string[],
    });
    const { success, error: toastError } = useToast();
    const supabase = createClient();
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const { data: coursesData, error: coursesError } = await (supabase as any)
                .from('courses')
                .select('id, title')
                .order('title');
            if (coursesError) throw coursesError;
            setCourses(coursesData || []);
        } catch (error) {
            toastError("Failed to load catalog data");
        } finally {
            setIsLoading(false);
        }
    };
    const generateCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < 8; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
        setFormData(prev => ({ ...prev, code: result }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.code || !formData.value) {
            toastError("Required parameters missing");
            return;
        }
        try {
            const { data: newCoupon, error: couponError } = await (supabase as any)
                .from('coupon_codes')
                .insert({
                    code: formData.code.toUpperCase(),
                    type: formData.type,
                    value: parseInt(formData.value),
                    max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
                    starts_at: formData.starts_at || null,
                    ends_at: formData.ends_at || null,
                    is_active: true
                })
                .select()
                .single();
            if (couponError) throw couponError;
            if (formData.apply_to === 'specific' && formData.selected_courses.length > 0) {
                const mappings = formData.selected_courses.map(courseId => ({
                    coupon_id: newCoupon.id,
                    course_id: courseId
                }));
                const { error: mappingError } = await (supabase as any).from('coupon_courses').insert(mappings);
                if (mappingError) throw mappingError;
            }
            success("Protocol accepted. Coupon established.");
            setIsCreating(false);
            setFormData({ code: "", type: "percentage", value: "", max_uses: "", starts_at: "", ends_at: "", apply_to: "all", selected_courses: [] });
            fetchData();
            dispatch(fetchCoupons());
        } catch (error: any) {
            toastError(error.message || "Protocol failure: Could not record coupon");
        }
    };
    const toggleCourseSelection = (courseId: string) => {
        setFormData(prev => {
            const exists = prev.selected_courses.includes(courseId);
            return {
                ...prev,
                selected_courses: exists
                    ? prev.selected_courses.filter(id => id !== courseId)
                    : [...prev.selected_courses, courseId]
            };
        });
    };
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-10 font-sans text-foreground">
            {}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight uppercase italic text-foreground">Token Repository</h1>
                    <p className="text-muted-foreground mt-1 text-sm font-bold uppercase tracking-widest opacity-60">Architect and deploy promotional access vectors</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 inline-flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Forge Token
                </button>
            </div>
            {}
            <div className="rounded-[2.5rem] border border-border/40 bg-card/30 backdrop-blur-xl overflow-hidden shadow-2xl">
                <AdminCouponsTable onCreate={() => setIsCreating(true)} />
            </div>
            {}
            <Dialog open={isCreating} onClose={() => setIsCreating(false)} size="lg">
                <DialogHeader>
                    <DialogTitle className="italic">Forge New Token</DialogTitle>
                    <DialogDescription>Define usage parameters and value extraction mechanics.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <DialogBody className="space-y-8">
                        {}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Unique Identifier</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="flex-1 h-12 px-4 rounded-xl border border-border/50 bg-card/50 text-sm font-black tracking-widest placeholder:opacity-30 outline-none focus:ring-2 focus:ring-primary/20 transition-all uppercase font-mono"
                                        placeholder="TOKEN_ID_X"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={generateCode}
                                        className="px-4 h-12 border border-border/50 rounded-xl hover:bg-muted text-[10px] font-black uppercase tracking-widest transition-all"
                                    >Generate</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Type</label>
                                    <select
                                        className="w-full h-12 px-4 rounded-xl border border-border/50 bg-card/50 text-xs font-black uppercase tracking-widest outline-none transition-all"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                    >
                                        <option value="percentage">Percentage</option>
                                        <option value="fixed">Fixed</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Magnitude</label>
                                    <input
                                        type="number"
                                        className="w-full h-12 px-4 rounded-xl border border-border/50 bg-card/50 text-sm font-black outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="0.00"
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        {}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Application Scope</label>
                            <div className="flex gap-6 px-1">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div
                                        className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all", formData.apply_to === 'all' ? "border-primary bg-primary/10" : "border-border/60")}
                                        onClick={() => setFormData({ ...formData, apply_to: 'all' })}
                                    >
                                        {formData.apply_to === 'all' && <div className="w-2 h-2 rounded-full bg-primary" />}
                                    </div>
                                    <span className={cn("text-xs font-black uppercase tracking-widest transition-all", formData.apply_to === 'all' ? "text-foreground" : "text-muted-foreground")}>Global Catalog</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div
                                        className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all", formData.apply_to === 'specific' ? "border-primary bg-primary/10" : "border-border/60")}
                                        onClick={() => setFormData({ ...formData, apply_to: 'specific' })}
                                    >
                                        {formData.apply_to === 'specific' && <div className="w-2 h-2 rounded-full bg-primary" />}
                                    </div>
                                    <span className={cn("text-xs font-black uppercase tracking-widest transition-all", formData.apply_to === 'specific' ? "text-foreground" : "text-muted-foreground")}>Targeted Entities</span>
                                </label>
                            </div>
                            <AnimatePresence>
                                {formData.apply_to === 'specific' && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                        <div className="mt-4 p-5 rounded-[2rem] border border-border/50 bg-muted/10 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto custom-scrollbar">
                                            {courses.map(course => (
                                                <div
                                                    key={course.id}
                                                    onClick={() => toggleCourseSelection(course.id)}
                                                    className={cn(
                                                        "flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer group",
                                                        formData.selected_courses.includes(course.id) ? "border-primary/40 bg-primary/5 ring-1 ring-primary/20" : "border-border/30 hover:border-border/60 bg-card/30"
                                                    )}
                                                >
                                                    <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-all", formData.selected_courses.includes(course.id) ? "bg-primary border-primary" : "border-border/60")}>
                                                        {formData.selected_courses.includes(course.id) && <Check className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <span className="text-xs font-bold truncate tracking-tight">{course.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {}
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Usage Ceiling</label>
                                <input type="number" className="w-full h-12 px-4 rounded-xl border border-border/50 bg-card/50 text-xs font-bold outline-none" placeholder="INF" value={formData.max_uses} onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Lifecycle Start</label>
                                <input type="datetime-local" className="w-full h-12 px-4 rounded-xl border border-border/50 bg-card/50 text-[10px] font-mono outline-none" value={formData.starts_at} onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Lifecycle Terminus</label>
                                <input type="datetime-local" className="w-full h-12 px-4 rounded-xl border border-border/50 bg-card/50 text-[10px] font-mono outline-none" value={formData.ends_at} onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })} />
                            </div>
                        </div>
                    </DialogBody>
                    <DialogFooter className="grid grid-cols-2 gap-3 p-6">
                        <button type="button" onClick={() => setIsCreating(false)} className="py-4 bg-muted/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-muted/40 transition-all border border-border/20">Abort Process</button>
                        <button type="submit" className="py-4 bg-primary text-primary-foreground rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/30">Commit Token</button>
                    </DialogFooter>
                </form>
            </Dialog>
        </motion.div>
    );
}
