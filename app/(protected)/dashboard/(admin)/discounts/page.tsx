"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2, Calendar, Tag, Percent, DollarSign, Search, Filter } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useToast } from "@/components/ui/toast";

interface Course {
    id: string;
    title: string;
    price: number;
}

interface Discount {
    id: string;
    course_id: string;
    course: Course; // Joined
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

    // Form State
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

            // Fetch Discounts
            const { data: discountsData, error: discountsError } = await (supabase
                .from('course_discounts' as any)
                .select(`
          *,
          course:courses(id, title, price)
        `)
                .order('created_at', { ascending: false }) as any);

            if (discountsError) throw discountsError;

            // Fetch Courses (for dropdown)
            const { data: coursesData, error: coursesError } = await (supabase
                .from('courses' as any)
                .select('id, title, price')
                .order('title') as any);

            if (coursesError) throw coursesError;

            setDiscounts(discountsData || []);
            setCourses(coursesData || []);

        } catch (error) {
            console.error('Error fetching data:', error);
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

            const { error } = await supabase
                .from('course_discounts' as any)
                .insert(payload);

            if (error) throw error;

            success("Discount created successfully");
            setIsCreating(false);
            setFormData({
                course_id: "",
                type: "percentage",
                value: "",
                starts_at: "",
                ends_at: "",
            });
            fetchData();

        } catch (error: any) {
            toastError(error.message || "Failed to create discount");
        }
    };

    const toggleActive = async (id: string, currentState: boolean) => {
        try {
            const { error } = await supabase
                .from('course_discounts' as any)
                .update({ is_active: !currentState })
                .eq('id', id);

            if (error) throw error;

            setDiscounts(discounts.map(d =>
                d.id === id ? { ...d, is_active: !currentState } : d
            ));
            success("Status updated");
        } catch (error) {
            toastError("Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this discount?")) return;

        try {
            const { error } = await supabase
                .from('course_discounts' as any)
                .delete()
                .eq('id', id);

            if (error) throw error;

            setDiscounts(discounts.filter(d => d.id !== id));
            success("Discount deleted");
        } catch (error) {
            toastError("Failed to delete discount");
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Discounts</h1>
                    <p className="text-muted-foreground">Manage automatic course discounts.</p>
                </div>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors cursor-pointer"
                >
                    {isCreating ? <Trash2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {isCreating ? "Cancel" : "Add Discount"}
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
                            <h2 className="text-lg font-semibold mb-4">Create New Discount</h2>
                            <form onSubmit={handleSubmit} className="grid gap-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Target Course</label>
                                        <select
                                            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                                            value={formData.course_id}
                                            onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                                            required
                                        >
                                            <option value="">Select a course...</option>
                                            {courses.map(course => (
                                                <option key={course.id} value={course.id}>
                                                    {course.title} (${course.price})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Type</label>
                                            <div className="flex rounded-lg border border-input p-1 bg-muted/50">
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, type: 'percentage' })}
                                                    className={`flex-1 flex items-center justify-center text-sm py-1.5 rounded-md transition-all cursor-pointer ${formData.type === 'percentage'
                                                            ? 'bg-background shadow-sm font-medium text-foreground'
                                                            : 'text-muted-foreground hover:text-foreground'
                                                        }`}
                                                >
                                                    <Percent className="w-3.5 h-3.5 mr-1.5" /> %
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, type: 'fixed' })}
                                                    className={`flex-1 flex items-center justify-center text-sm py-1.5 rounded-md transition-all cursor-pointer ${formData.type === 'fixed'
                                                            ? 'bg-background shadow-sm font-medium text-foreground'
                                                            : 'text-muted-foreground hover:text-foreground'
                                                        }`}
                                                >
                                                    <DollarSign className="w-3.5 h-3.5 mr-1.5" /> Fixed
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Value</label>
                                            <input
                                                type="number"
                                                min="0"
                                                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                                                placeholder={formData.type === 'percentage' ? "e.g. 20" : "e.g. 500"}
                                                value={formData.value}
                                                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Start Date (Optional)</label>
                                        <input
                                            type="datetime-local"
                                            className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
                                            value={formData.starts_at}
                                            onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">End Date (Optional)</label>
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
                                        Create Discount
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
                                <th className="px-6 py-4 font-medium">Course</th>
                                <th className="px-6 py-4 font-medium">Discount</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Period</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                        Loading discounts...
                                    </td>
                                </tr>
                            ) : discounts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                        No discounts found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                discounts.map((discount) => (
                                    <tr key={discount.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            {discount.course ? (
                                                <div>
                                                    <p className="font-medium text-foreground">{discount.course.title}</p>
                                                    <p className="text-xs text-muted-foreground">${discount.course.price}</p>
                                                </div>
                                            ) : (
                                                <span className="text-destructive">Deleted Course</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${discount.type === 'percentage'
                                                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                    }`}>
                                                    {discount.type === 'percentage' ? (
                                                        <Percent className="w-3 h-3 mr-1" />
                                                    ) : (
                                                        <DollarSign className="w-3 h-3 mr-1" />
                                                    )}
                                                    {discount.value}{discount.type === 'percentage' ? '%' : ''} Off
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => toggleActive(discount.id, discount.is_active)}
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${discount.is_active
                                                        ? "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20"
                                                        : "bg-zinc-500/10 text-zinc-600 border-zinc-500/20 hover:bg-zinc-500/20 dark:text-zinc-400"
                                                    }`}
                                            >
                                                {discount.is_active ? "Active" : "Inactive"}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground text-xs">
                                            {discount.starts_at ? new Date(discount.starts_at).toLocaleDateString() : "Now"}
                                            {" → "}
                                            {discount.ends_at ? new Date(discount.ends_at).toLocaleDateString() : "Forever"}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(discount.id)}
                                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                                                title="Delete Discount"
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
