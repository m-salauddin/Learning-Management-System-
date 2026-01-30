"use client";

import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { COURSES } from "@/data/courses";
import { motion } from "motion/react";

export default function CourseManagementPage() {
    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Course Management</h1>
                    <p className="text-muted-foreground text-sm">Create, edit, and manage platform courses.</p>
                </div>
                <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 cursor-pointer">
                    <Plus className="w-4 h-4" />
                    Create Course
                </button>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center gap-4 justify-between bg-muted/20">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search courses by title..."
                            className="w-full pl-9 pr-4 py-2 rounded-xl bg-background/50 border border-border/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select className="px-3 py-2 rounded-xl bg-background/50 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
                            <option>All Categories</option>
                            <option>Web Development</option>
                            <option>Data Science</option>
                            <option>Design</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/30 text-muted-foreground font-medium border-b border-border/50">
                            <tr>
                                <th className="px-6 py-4">Course Title</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Students</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 bg-card/30">
                            {COURSES.slice(0, 8).map((course, i) => (
                                <motion.tr
                                    key={course.slug}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="hover:bg-muted/40 transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-8 rounded-lg bg-muted overflow-hidden shrink-0 border border-border/50">
                                                <img src={course.image} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <span className="font-medium text-foreground line-clamp-1 max-w-[180px] sm:max-w-xs">{course.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full bg-primary/5 text-primary border border-primary/10 text-xs font-medium whitespace-nowrap">
                                            {course.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-muted-foreground whitespace-nowrap">
                                        {course.price}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                        {course.students}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 rounded-lg hover:bg-background border border-transparent hover:border-border/50 text-muted-foreground hover:text-foreground transition-all cursor-pointer" title="Edit">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-muted-foreground hover:text-red-500 transition-all cursor-pointer" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
