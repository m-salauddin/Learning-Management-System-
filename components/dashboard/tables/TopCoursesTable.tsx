"use client"

import { cn } from "@/lib/utils"
import { MoreHorizontal, ExternalLink, Star, Users, BookOpen, TrendingUp, TrendingDown } from "lucide-react"

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
        <div className="w-full overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-border/50">
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Course</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Instructor</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Students</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Rating</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Revenue</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Trend</th>
                        <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground w-10"></th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map((course, index) => (
                        <tr
                            key={course.id}
                            className={cn(
                                "border-b border-border/30 hover:bg-muted/30 transition-colors",
                                index === courses.length - 1 && "border-0"
                            )}
                        >
                            <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-lg">
                                        {course.thumbnail}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-medium text-sm truncate max-w-[200px]">{course.title}</p>
                                        <span className={cn(
                                            "text-xs px-2 py-0.5 rounded-full",
                                            course.status === "published"
                                                ? "bg-emerald-500/10 text-emerald-500"
                                                : "bg-amber-500/10 text-amber-500"
                                        )}>
                                            {course.status}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-muted-foreground hidden md:table-cell">
                                {course.instructor}
                            </td>
                            <td className="py-4 px-4 text-center">
                                <div className="flex items-center justify-center gap-1 text-sm">
                                    <Users className="w-3.5 h-3.5 text-muted-foreground" />
                                    <span className="font-medium">{course.students.toLocaleString()}</span>
                                </div>
                            </td>
                            <td className="py-4 px-4 text-center hidden sm:table-cell">
                                <div className="flex items-center justify-center gap-1 text-sm">
                                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                    <span className="font-medium">{course.rating}</span>
                                </div>
                            </td>
                            <td className="py-4 px-4 text-right">
                                <span className="font-bold text-sm">৳{course.revenue.toLocaleString()}</span>
                            </td>
                            <td className="py-4 px-4 text-center hidden lg:table-cell">
                                <div className={cn(
                                    "inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                                    course.trend === "up"
                                        ? "bg-emerald-500/10 text-emerald-500"
                                        : "bg-red-500/10 text-red-500"
                                )}>
                                    {course.trend === "up" ? (
                                        <TrendingUp className="w-3 h-3" />
                                    ) : (
                                        <TrendingDown className="w-3 h-3" />
                                    )}
                                    {course.trendValue}%
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
