"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Ticket, Users, Copy, Check, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useToast } from "@/components/ui/toast";
import { AdminCouponsTable } from "@/components/dashboard/tables/AdminCouponsTable";
import { useAppDispatch } from "@/lib/store/hooks";
import { fetchCoupons } from "@/lib/store/features/admin/couponsSlice";


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
    const dispatch = useAppDispatch();
    const [courses, setCourses] = useState<Course[]>([]);
    // const [coupons, setCoupons] = useState<Coupon[]>([]); // Removed local coupons state
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

            // Fetch Coupons with course mappings - MOVED TO REDUX
            // const { data: couponsData, error: couponsError } = await (supabase as any)
            //     .from('coupon_codes') ...

            // Fetch Courses (for selection)
            const { data: coursesData, error: coursesError } = await (supabase as any)
                .from('courses')
                .select('id, title')
                .order('title');

            if (coursesError) throw coursesError;

            // setCoupons(couponsData || []);
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
            dispatch(fetchCoupons()); // Refresh Redux Table

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

    /* Handlers removed as they are moved to Redux or AdminCouponsTable logic 
    const toggleActive = async (id: string, currentState: boolean) => { ... }
    const handleDelete = async (id: string) => { ... }
    const copyCode = (code: string) => { ... }
    */

    return (
        <div className="space-y-6 max-w-7xl mx-auto">


            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>
                    <p className="text-muted-foreground">Manage promo codes and campaigns.</p>
                </div>
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
            <AdminCouponsTable onCreate={() => setIsCreating(true)} />

            {/* Old Table Removed */}
        </div >
    );
}
