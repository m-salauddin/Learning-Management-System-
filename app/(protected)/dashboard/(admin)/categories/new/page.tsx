"use client";
import { Layers, ChevronLeft } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { CategoryForm } from "@/components/dashboard/admin/categories/CategoryForm";
export default function NewCategoryPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-10 max-w-5xl mx-auto"
        >
            {}
            <div className="flex flex-col gap-4">
                <Link
                    href="/dashboard/categories"
                    className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors w-fit group"
                >
                    <div className="p-1 rounded-md bg-white/5 border border-white/5 group-hover:border-white/10 transition-all">
                        <ChevronLeft className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Back to Categories</span>
                </Link>
                <div className="flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5">
                        <Layers className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">
                            Create <span className="text-primary">Category</span>
                        </h1>
                        <p className="text-muted-foreground mt-1 text-sm font-medium">
                            Initialize a new course taxonomy with visual identity
                        </p>
                    </div>
                </div>
            </div>
            {}
            <div className="p-8 rounded-3xl border border-border/40 bg-card/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 -mr-16 -mt-16 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 p-12 -ml-16 -mb-16 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="relative z-10">
                    <CategoryForm />
                </div>
            </div>
        </motion.div>
    );
}
