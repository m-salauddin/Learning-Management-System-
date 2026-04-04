"use client"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { Star, Users, TrendingUp, TrendingDown, Eye, Pencil, Trash2 } from "lucide-react"
const courses = [
    {
        id: 1,
        title: "Complete Web Development Bootcamp 2026",
        instructor: "John Doe",
        students: 2345,
        rating: 4.9,
        revenue: 125000,
        trend: "up",
        trendValue: 12,
        status: "published",
        thumbnail: "🌐"
    },
    {
        id: 2,
        title: "Python for Data Science & Machine Learning",
        instructor: "Jane Smith",
        students: 1876,
        rating: 4.8,
        revenue: 98500,
        trend: "up",
        trendValue: 8,
        status: "published",
        thumbnail: "🐍"
    },
    {
        id: 3,
        title: "React.js - The Complete Guide",
        instructor: "Mike Johnson",
        students: 1543,
        rating: 4.7,
        revenue: 82300,
        trend: "down",
        trendValue: 3,
        status: "published",
        thumbnail: "⚛️"
    },
    {
        id: 4,
        title: "UI/UX Design Masterclass",
        instructor: "Sarah Williams",
        students: 1234,
        rating: 4.9,
        revenue: 67800,
        trend: "up",
        trendValue: 15,
        status: "published",
        thumbnail: "🎨"
    },
    {
        id: 5,
        title: "Node.js & Express - Backend Development",
        instructor: "Alex Brown",
        students: 987,
        rating: 4.6,
        revenue: 54200,
        trend: "up",
        trendValue: 5,
        status: "draft",
        thumbnail: "🚀"
    },
]
export function TopCoursesTable() {
    return (
        <div className="w-full bg-card/30 backdrop-blur-xl border border-border/40 rounded-3xl overflow-hidden shadow-xl overflow-x-auto min-w-0">
            <div className="min-w-[800px] divide-y divide-border/20">
                {}
                <div className="grid grid-cols-[2fr_1fr_120px_100px_120px_100px_120px] px-6 py-4 bg-muted/10 border-b border-border/10">
                    <div className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Course</div>
                    <div className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 hidden md:block">Instructor</div>
                    <div className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 text-center">Students</div>
                    <div className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 text-center hidden sm:block">Rating</div>
                    <div className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 text-right">Revenue</div>
                    <div className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 text-center hidden lg:block">Trend</div>
                    <div className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 text-center">Actions</div>
                </div>
                {}
                <div className="divide-y divide-border/20">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="grid grid-cols-[2fr_1fr_120px_100px_120px_100px_120px] px-6 py-4 items-center transition-colors hover:bg-muted/10 group bg-card/5"
                        >
                            {}
                            <div className="px-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg shrink-0">
                                        {course.thumbnail}
                                    </div>
                                    <div className="min-w-0 space-y-1">
                                        <p className="font-bold text-sm tracking-tight text-foreground truncate max-w-52">
                                            {course.title}
                                        </p>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "text-[9px] px-1.5 py-0 font-black uppercase tracking-widest",
                                                course.status === "published"
                                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                                                    : "bg-amber-500/10 text-amber-500 border-amber-500/30"
                                            )}
                                        >
                                            {course.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            {}
                            <div className="px-4 hidden md:block">
                                <span className="text-sm font-medium text-muted-foreground">
                                    {course.instructor}
                                </span>
                            </div>
                            {}
                            <div className="px-4 text-center">
                                <div className="inline-flex items-center gap-1.5">
                                    <Users className="w-4 h-4 text-muted-foreground/60" />
                                    <span className="text-sm font-bold tracking-tight">{course.students.toLocaleString()}</span>
                                </div>
                            </div>
                            {}
                            <div className="px-4 text-center hidden sm:block">
                                <div className="inline-flex items-center gap-1">
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                    <span className="text-sm font-black text-foreground">{course.rating}</span>
                                </div>
                            </div>
                            {}
                            <div className="px-4 text-right">
                                <span className="text-sm font-black tracking-tighter text-foreground">
                                    ৳{course.revenue.toLocaleString()}
                                </span>
                            </div>
                            {}
                            <div className="px-4 text-center hidden lg:block">
                                <Badge
                                    variant="outline"
                                    className={cn(
                                        "gap-1 text-[10px] font-black",
                                        course.trend === "up"
                                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                                            : "bg-destructive/10 text-destructive border-destructive/30"
                                    )}
                                >
                                    {course.trend === "up" ? (
                                        <TrendingUp className="w-3 h-3" />
                                    ) : (
                                        <TrendingDown className="w-3 h-3" />
                                    )}
                                    {course.trendValue}%
                                </Badge>
                            </div>
                            {}
                            <div className="px-4 text-center">
                                <div className="flex items-center justify-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-all shadow-none"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-all shadow-none"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all shadow-none"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
