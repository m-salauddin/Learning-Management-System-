"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Ticket, Users, Copy, Check, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useToast } from "@/components/ui/toast";

interface Course {
    id: string;
    title: string;
}

interface Coupon {
    id: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    max_uses: number | null;
    used_count: number;
    starts_at: string | null;
    ends_at: string | null;
    is_active: boolean;
    coupon_courses?: { course_id: string }[]; // Joined
}

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
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

            // Fetch Coupons with course mappings
            const { data: couponsData, error: couponsError } = await (supabase as any)
                .from('coupon_codes')
                .select(`
          *,
          coupon_courses(course_id)
        `)
                .order('created_at', { ascending: false });

            if (couponsError) throw couponsError;

            // Fetch Courses (for selection)
            const { data: coursesData, error: coursesError } = await (supabase as any)
                .from('courses')
                .select('id, title')
                .order('title');

            if (coursesError) throw coursesError;

            setCoupons(couponsData || []);
            setCourses(coursesData || []);

        } catch (error) {
            console.error('Error fetching data:', error);
            toastError("Failed to load data");
        } finally {
            setIsLoading(false);
        }
    };

    const generateCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData(prev => ({ ...prev, code: result }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.code || !formData.value) {
            toastError("Please fill in required fields");
            return;
        }

        try {
            // 1. Create Coupon
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

            // 2. Create Mappings (if specific)
            if (formData.apply_to === 'specific' && formData.selected_courses.length > 0) {
                const mappings = formData.selected_courses.map(courseId => ({
                    coupon_id: newCoupon.id,
                    course_id: courseId
                }));

                const { error: mappingError } = await (supabase as any)
                    .from('coupon_courses')
                    .insert(mappings);

                if (mappingError) throw mappingError;
            }

            success("Coupon created successfully");
            setIsCreating(false);
            setFormData({
                code: "",
                type: "percentage",
                value: "",
                max_uses: "",
                starts_at: "",
                ends_at: "",
                apply_to: "all",
                selected_courses: [],
            });
            fetchData();

        } catch (error: any) {
            toastError(error.message || "Failed to create coupon");
        }
    };

    const toggleCourseSelection = (courseId: string) => {
        setFormData(prev => {
            const exists = prev.selected_courses.includes(courseId);
            if (exists) {
                return { ...prev, selected_courses: prev.selected_courses.filter(id => id !== courseId) };
            } else {
                return { ...prev, selected_courses: [...prev.selected_courses, courseId] };
            }
        });
    };

    const toggleActive = async (id: string, currentState: boolean) => {
        try {
            const { error } = await (supabase as any)
                .from('coupon_codes')
                .update({ is_active: !currentState })
                .eq('id', id);

            if (error) throw error;

            setCoupons(coupons.map(c =>
                c.id === id ? { ...c, is_active: !currentState } : c
            ));
            success("Status updated");
        } catch (error) {
            toastError("Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this coupon? This cannot be undone.")) return;

        try {
            const { error } = await (supabase as any)
                .from('coupon_codes')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setCoupons(coupons.filter(c => c.id !== id));
            success("Coupon deleted");
        } catch (error) {
            toastError("Failed to delete coupon");
        }
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        success("Code copied to clipboard");
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>
                    <p className="text-muted-foreground">Manage promo codes and campaigns.</p>
                </div>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors cursor-pointer"
                >
                    {isCreating ? <Trash2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {isCreating ? "Cancel" : "Create Coupon"}
                </button>
            </div>

            <AnimatePresence>
                {isCreating && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
                            <h2 className="text-lg font-semibold mb-4">New Coupon Code</h2>
                            <form onSubmit={handleSubmit} className="grid gap-6">

                                {/* Code & Type */}
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Coupon Code</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                className="flex-1 h-10 px-3 rounded-lg border border-input bg-background text-sm uppercase font-mono"
                                                placeholder="SAVE50"
                                                value={formData.code}
                                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={generateCode}
                                                className="px-3 h-10 border border-input rounded-lg hover:bg-muted text-xs font-medium cursor-pointer"
                                            >
                                                Generate
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Discount Type</label>
                                        <select
                                            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                        >
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="fixed">Fixed Amount ($)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Value</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                                            placeholder={formData.type === 'percentage' ? "e.g. 20" : "e.g. 50"}
                                            value={formData.value}
                                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Scope */}
                                <div className="space-y-3">
                                    <label className="text-sm font-medium">Applies To</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                                            <input
                                                type="radio"
                                                name="apply_to"
                                                checked={formData.apply_to === 'all'}
                                                onChange={() => setFormData({ ...formData, apply_to: 'all' })}
                                                className="text-primary"
                                            />
                                            All Courses (Global)
                                        </label>
                                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                                            <input
                                                type="radio"
                                                name="apply_to"
                                                checked={formData.apply_to === 'specific'}
                                                onChange={() => setFormData({ ...formData, apply_to: 'specific' })}
                                                className="text-primary"
                                            />
                                            Specific Courses
                                        </label>
                                    </div>

                                    {formData.apply_to === 'specific' && (
                                        <div className="mt-2 border border-input rounded-xl p-3 max-h-48 overflow-y-auto bg-muted/30">
                                            {courses.length === 0 ? (
                                                <p className="text-xs text-muted-foreground p-2">No courses available.</p>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {courses.map(course => (
                                                        <label key={course.id} className="flex items-center gap-2 text-sm p-1.5 hover:bg-background rounded-lg transition-colors cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.selected_courses.includes(course.id)}
                                                                onChange={() => toggleCourseSelection(course.id)}
                                                                className="rounded border-input text-primary focus:ring-primary"
                                                            />
                                                            <span className="truncate">{course.title}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Limits & Dates */}
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Usage Limit (Optional)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                                            placeholder="Unlimited"
                                            value={formData.max_uses}
                                            onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Start Date</label>
                                        <input
                                            type="datetime-local"
                                            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                                            value={formData.starts_at}
                                            onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">End Date</label>
                                        <input
                                            type="datetime-local"
                                            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                                            value={formData.ends_at}
                                            onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all cursor-pointer shadow-sm hover:shadow-md"
                                    >
                                        Create Coupon
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* List */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                            <tr>
                                <th className="px-6 py-4 font-medium">Code</th>
                                <th className="px-6 py-4 font-medium">Discount</th>
                                <th className="px-6 py-4 font-medium">Usage</th>
                                <th className="px-6 py-4 font-medium">Applies To</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                        Loading coupons...
                                    </td>
                                </tr>
                            ) : coupons.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                        No coupons found. Create your first campaign!
                                    </td>
                                </tr>
                            ) : (
                                coupons.map((coupon) => (
                                    <tr key={coupon.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => copyCode(coupon.code)}
                                                className="group flex items-center gap-2 font-mono font-medium text-foreground bg-muted/50 hover:bg-muted px-2 py-1 rounded cursor-pointer transition-colors"
                                            >
                                                {coupon.code}
                                                <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium">
                                                {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                                            </span>
                                            <span className="text-muted-foreground ml-1">OFF</span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            <span className="text-foreground font-medium">{coupon.used_count}</span>
                                            {coupon.max_uses ? ` / ${coupon.max_uses}` : " (∞)"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {(!coupon.coupon_courses || coupon.coupon_courses.length === 0) ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                                    Global
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400">
                                                    {coupon.coupon_courses.length} Course{coupon.coupon_courses.length > 1 ? 's' : ''}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleActive(coupon.id, coupon.is_active)}
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${coupon.is_active
                                                    ? "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20"
                                                    : "bg-zinc-500/10 text-zinc-600 border-zinc-500/20 hover:bg-zinc-500/20 dark:text-zinc-400"
                                                    }`}
                                            >
                                                {coupon.is_active ? "Active" : "Inactive"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(coupon.id)}
                                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                                                title="Delete Coupon"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
