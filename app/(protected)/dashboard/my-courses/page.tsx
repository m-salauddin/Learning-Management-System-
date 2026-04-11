"use client";
import { useAppSelector } from "@/lib/store/hooks";
import { CourseProgressCard } from "@/components/dashboard/CourseProgressCard";
import { motion } from "motion/react";
import { Search, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};
const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 }
};
interface EnrolledCourse {
    course: {
        id: string;
        slug: string;
        title: string;
        thumbnail_url: string;
        total_lessons: number;
    };
    completed_lessons: number;
    progress_percentage: number;
}
export default function MyCoursesPage() {
    const { user } = useAppSelector((state) => state.auth);
    const [searchQuery, setSearchQuery] = useState("");
    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchCourses = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }
            const { data, error } = await supabase
                .from('enrollments')
                .select(`
                    completed_lessons,
                    progress_percentage,
                    course:courses(
                        id,
                        slug,
                        title,
                        thumbnail_url,
                        total_lessons
                    )
                `)
                .eq('user_id', user.id)
                .eq('status', 'active');
            if (data) {
                setEnrolledCourses(data as unknown as EnrolledCourse[]);
            }
            setLoading(false);
        };
        fetchCourses();
    }, []);
    const filteredCourses = enrolledCourses.filter(enrollment =>
        enrollment.course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        className="text-4xl font-black tracking-tight uppercase italic leading-none"
                    >
                        Intellectual <span className="text-primary">Inventory</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: 0.1 }} 
                        className="text-muted-foreground mt-2 text-sm font-bold uppercase tracking-widest opacity-60"
                    >
                        Manage and track your active learning protocols
                    </motion.p>
                </div>
                
                <div className="relative w-full lg:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search active protocols..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-card/30 backdrop-blur-xl border border-white/5 focus:ring-4 focus:ring-primary/10 focus:border-primary/20 outline-none text-sm transition-all font-medium placeholder:text-muted-foreground/40"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest opacity-40">
                        Alpha
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 rounded-[2rem] bg-white/5 border border-white/5 animate-pulse" />
                    ))}
                </div>
            ) : filteredCourses.length > 0 ? (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                    {filteredCourses.map((enrollment) => (
                        <motion.div key={enrollment.course.slug} variants={item}>
                            <CourseProgressCard
                                slug={enrollment.course.slug}
                                title={enrollment.course.title}
                                image={enrollment.course.thumbnail_url || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop'}
                                progress={enrollment.progress_percentage || 0}
                                totalLessons={enrollment.course.total_lessons || 0}
                                completedLessons={enrollment.completed_lessons || 0}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center rounded-[3rem] border border-dashed border-white/10 bg-slate-900/40 backdrop-blur-xl group">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
                        <div className="relative p-8 bg-slate-950/60 rounded-full border border-white/10 shadow-2xl">
                            <BookOpen className="w-12 h-12 text-primary opacity-80" />
                        </div>
                    </div>
                    
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-2">
                        {searchQuery ? "No matching entities found" : "Neural Pathway Empty"}
                    </h3>
                    <p className="text-muted-foreground max-w-sm mb-10 text-sm font-medium leading-relaxed opacity-70 px-4">
                        {searchQuery ? "Your search parameters yielded zero results in the current directory." : "Your account has no active learning protocols. Initiate a new session to begin your training."}
                    </p>
                    
                    {!searchQuery && (
                        <Link href="/courses">
                            <button className="relative px-10 py-4 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-primary/90 transition-all shadow-2xl shadow-primary/40 hover:shadow-primary/60 hover:-translate-y-1 active:translate-y-0 group-hover:scale-105 duration-300">
                                Access Catalog
                                <div className="absolute inset-0 border-2 border-white/20 rounded-2xl scale-[1.05] opacity-0 group-hover:opacity-100 transition-all duration-500" />
                            </button>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
