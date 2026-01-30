"use client";

import { Search, Shield, User, Trash2, Edit, MoreHorizontal } from "lucide-react";
import { motion } from "motion/react";

const USERS = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 3 === 0 ? "admin" : "student",
    status: "active",
    joined: "Jan 12, 2024"
}));

export default function UserManagementPage() {
    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground text-sm">Manage platform users, roles, and permissions.</p>
                </div>
                <button className="bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 cursor-pointer">
                    Add New User
                </button>
            </div>

            <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center gap-4 justify-between bg-muted/20">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            className="w-full pl-9 pr-4 py-2 rounded-xl bg-background/50 border border-border/50 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select className="px-3 py-2 rounded-xl bg-background/50 border border-border/50 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
                            <option>All Roles</option>
                            <option>Admin</option>
                            <option>Student</option>
                            <option>Instructor</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-muted/30 text-muted-foreground font-medium border-b border-border/50">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Joined Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50 bg-card/30">
                            {USERS.map((user, i) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="hover:bg-muted/40 transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold border border-primary/10">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-foreground">{user.name}</div>
                                                <div className="text-xs text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${user.role === 'admin'
                                                ? "bg-red-500/10 text-red-500 border-red-500/20"
                                                : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                            }`}>
                                            {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                            <span className="capitalize">{user.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-medium">
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        {user.joined}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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

                <div className="p-4 border-t border-border/50 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Showing {USERS.length} of 128 users</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 rounded-lg border border-border/50 hover:bg-background transition-colors disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 rounded-lg border border-border/50 hover:bg-background transition-colors">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
