import { Play, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

interface CourseProgressCardProps {
    slug: string;
    title: string;
    image: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
}

export function CourseProgressCard({ slug, title, image, progress, totalLessons, completedLessons }: CourseProgressCardProps) {
    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative rounded-[2rem] overflow-hidden border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:border-primary/30"
        >
            {/* Image Section */}
            <div className="relative h-44 overflow-hidden">
                <Image 
                    src={image} 
                    alt={title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized
                />
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <Link href={`/courses/${slug}`} className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                    </Link>
                </div>

                {/* Progress Badge */}
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-slate-950/60 backdrop-blur-md border border-white/10 text-[10px] font-black italic uppercase tracking-widest text-primary shadow-xl">
                    {Math.round(progress)}% Complete
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 pt-4 space-y-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-80 italic">
                        <BookOpen className="w-3 h-3" />
                        Active Protocol
                    </div>
                    <h4 className="font-black text-lg tracking-tight line-clamp-1 group-hover:text-primary transition-colors duration-300">
                        {title}
                    </h4>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-end text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 italic">
                        <span>Progress Vector</span>
                        <span>{completedLessons}/{totalLessons} Units</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                            className="h-full bg-linear-to-r from-primary to-primary/60 rounded-full relative shadow-[0_0_12px_rgba(var(--primary),0.4)]"
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                        </motion.div>
                    </div>
                </div>

                <Link 
                    href={`/courses/${slug}`}
                    className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/5 hover:bg-primary/10 hover:border-primary/20 hover:text-primary transition-all duration-300 font-black text-[10px] uppercase tracking-widest group/btn"
                >
                    Continue Learning
                    <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
            </div>
        </motion.div>
    );
}

