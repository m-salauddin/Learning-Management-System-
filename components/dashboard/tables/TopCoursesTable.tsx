"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead>Course</TableHead>
                    <TableHead className="hidden md:table-cell">Instructor</TableHead>
                    <TableHead className="text-center">Students</TableHead>
                    <TableHead className="text-center hidden sm:table-cell">Rating</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-center hidden lg:table-cell">Trend</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {courses.map((course) => (
                    <TableRow key={course.id}>
                        {/* Course Info */}
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg shrink-0">
                                    {course.thumbnail}
                                </div>
                                <div className="min-w-0 space-y-1">
                                    <p className="font-medium text-sm truncate max-w-52">
                                        {course.title}
                                    </p>
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            "text-[10px] px-1.5 py-0 font-medium",
                                            course.status === "published"
                                                ? "bg-success/10 text-success border-success/30"
                                                : "bg-warning/10 text-warning border-warning/30"
                                        )}
                                    >
                                        {course.status}
                                    </Badge>
                                </div>
                            </div>
                        </TableCell>

                        {/* Instructor */}
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                            {course.instructor}
                        </TableCell>

                        {/* Students */}
                        <TableCell className="text-center">
                            <div className="inline-flex items-center gap-1.5">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">{course.students.toLocaleString()}</span>
                            </div>
                        </TableCell>

                        {/* Rating */}
                        <TableCell className="text-center hidden sm:table-cell">
                            <div className="inline-flex items-center gap-1">
                                <Star className="w-4 h-4 text-warning fill-warning" />
                                <span className="font-medium">{course.rating}</span>
                            </div>
                        </TableCell>

                        {/* Revenue */}
                        <TableCell className="text-right font-semibold">
                            ৳{course.revenue.toLocaleString()}
                        </TableCell>

                        {/* Trend */}
                        <TableCell className="text-center hidden lg:table-cell">
                            <Badge
                                variant="outline"
                                className={cn(
                                    "gap-1 text-xs font-medium",
                                    course.trend === "up"
                                        ? "bg-success/10 text-success border-success/30"
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
                        </TableCell>

                        {/* Actions */}
                        <TableCell>
                            <div className="flex items-center justify-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                >
                                    <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
