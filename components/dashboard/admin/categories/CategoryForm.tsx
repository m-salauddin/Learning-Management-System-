"use client";

import {
    Globe, Smartphone, Palette, TrendingUp, Briefcase,
    Database, Code, Shield, Cloud, Layers, Info, Save, X
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { Category, createCategory, updateCategory } from "@/lib/actions/categories";

const iconOptions = [
    { name: 'Globe', icon: Globe },
    { name: 'Smartphone', icon: Smartphone },
    { name: 'Palette', icon: Palette },
    { name: 'TrendingUp', icon: TrendingUp },
    { name: 'Briefcase', icon: Briefcase },
    { name: 'Database', icon: Database },
    { name: 'Code', icon: Code },
    { name: 'Shield', icon: Shield },
    { name: 'Cloud', icon: Cloud },
    { name: 'Layers', icon: Layers },
    { name: 'Info', icon: Info },
];

const colorOptions = [
    { name: 'Indigo', hex: '#6366f1' },
    { name: 'Blue', hex: '#3b82f6' },
    { name: 'Sky', hex: '#0ea5e9' },
    { name: 'Teal', hex: '#14b8a6' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Green', hex: '#22c55e' },
    { name: 'Yellow', hex: '#eab308' },
    { name: 'Orange', hex: '#f97316' },
    { name: 'Red', hex: '#ef4444' },
    { name: 'Rose', hex: '#f43f5e' },
    { name: 'Pink', hex: '#ec4899' },
    { name: 'Violet', hex: '#8b5cf6' },
];

interface CategoryFormProps {
    initialData?: Category;
    isEditing?: boolean;
}

export function CategoryForm({ initialData, isEditing = false }: CategoryFormProps) {
    const router = useRouter();
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        icon: initialData?.icon || "Layers",
        color: initialData?.color || "#6366f1",
        description: initialData?.description || ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = isEditing && initialData
                ? await updateCategory(initialData.id, formData)
                : await createCategory(formData);

            if (result.success) {
                toast.success(isEditing ? "Category updated" : "Category created");
                router.push("/dashboard/categories");
                router.refresh();
            } else {
                toast.error(result.error || "Operation failed");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name Field */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Category Name</label>
                    <input
                        type="text" required value={formData.name}
                        onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                        placeholder="e.g. Master Web Development"
                        className="w-full bg-slate-950/50 border border-border/50 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
                    />
                </div>

                {/* Slug Field */}
                <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">URL ID (Slug)</label>
                    <input
                        type="text" value={formData.slug}
                        onChange={(e) => setFormData(p => ({ ...p, slug: e.target.value }))}
                        placeholder="auto-generated"
                        className="w-full bg-slate-950/50 border border-border/50 rounded-2xl px-5 py-4 text-white/60 outline-none focus:border-primary/50 transition-all font-mono text-xs"
                    />
                </div>

                {/* Icon Selection */}
                <div className="md:col-span-2 space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block">Visual Representation (Icon)</label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-11 gap-3 p-6 bg-slate-950/50 rounded-3xl border border-border/50">
                        {iconOptions.map((opt) => (
                            <button
                                key={opt.name} type="button"
                                onClick={() => setFormData(p => ({ ...p, icon: opt.name }))}
                                className={cn(
                                    "aspect-square rounded-2xl border flex items-center justify-center transition-all duration-300",
                                    formData.icon === opt.name
                                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-110"
                                        : "bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/30"
                                )}
                            >
                                <opt.icon className="w-5 h-5" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Color Selection */}
                <div className="md:col-span-2 space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 block">Thematic Color Accent</label>
                    <div className="flex flex-wrap gap-4 p-6 bg-slate-950/50 rounded-3xl border border-border/50">
                        {colorOptions.map((opt) => (
                            <button
                                key={opt.hex} type="button"
                                onClick={() => setFormData(p => ({ ...p, color: opt.hex }))}
                                className={cn(
                                    "w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center",
                                    formData.color === opt.hex
                                        ? "border-white scale-110 shadow-lg"
                                        : "border-transparent hover:scale-110"
                                )}
                                style={{ backgroundColor: opt.hex }}
                                title={opt.name}
                            >
                                {formData.color === opt.hex && <div className="w-2 h-2 bg-white rounded-full shadow-sm" />}
                            </button>
                        ))}
                        <div className="flex items-center gap-3 ml-auto pl-6 border-l border-white/10">
                            <div className="w-10 h-10 rounded-xl border border-white/10 overflow-hidden relative group">
                                <input
                                    type="color"
                                    value={formData.color}
                                    onChange={(e) => setFormData(p => ({ ...p, color: e.target.value }))}
                                    className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer"
                                />
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                    <Palette className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <input
                                type="text"
                                value={formData.color}
                                onChange={(e) => setFormData(p => ({ ...p, color: e.target.value }))}
                                className="w-24 bg-transparent border-none text-xs font-mono text-white/60 focus:text-white outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Description Field */}
                <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Narrative (Description)</label>
                    <textarea
                        rows={5} value={formData.description}
                        onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                        placeholder="Briefly describe what this category encompasses and what students will learn..."
                        className="w-full bg-slate-950/50 border border-border/50 rounded-2xl px-5 py-4 text-white outline-none focus:border-primary/50 transition-all resize-none text-sm leading-relaxed"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-6">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-8 py-3.5 rounded-2xl border border-border/50 text-white/60 font-bold hover:text-white hover:bg-white/5 transition-all text-sm"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-primary text-white px-10 py-3.5 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {isEditing ? "Update Category" : "Create Category"}
                </button>
            </div>
        </form>
    );
}
