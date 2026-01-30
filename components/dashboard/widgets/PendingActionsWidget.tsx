"use client"

import { cn } from "@/lib/utils"
import { Check, Clock, AlertCircle, ArrowRight } from "lucide-react"
import { motion } from "motion/react"

const pendingItems = [
    {
        id: 1,
        type: "course_review",
        title: "Advanced JavaScript Course",
        description: "New course pending approval",
        time: "Submitted 2 hours ago",
        priority: "high",
        action: "Review"
    },
    {
        id: 2,
        type: "instructor_request",
        title: "Instructor Application - Sarah Ahmed",
        description: "Requesting teacher role",
        time: "Submitted 5 hours ago",
        priority: "medium",
        action: "Approve"
    },
    {
        id: 3,
        type: "refund_request",
        title: "Refund Request #1234",
        description: "User requesting ৳1,500 refund",
        time: "Submitted 1 day ago",
        priority: "high",
        action: "Process"
    },
    {
        id: 4,
        type: "content_report",
        title: "Content Report #567",
        description: "Reported comment on lesson",
        time: "Submitted 2 days ago",
        priority: "low",
        action: "View"
    },
]

const priorityStyles = {
    high: "bg-red-500/10 text-red-500 border-red-500/20",
    medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
}

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05
        }
    }
}

const itemVariants = {
    hidden: { 
        opacity: 0, 
        x: -20,
        y: 10
    },
    visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
            type: "spring" as const,
            stiffness: 260,
            damping: 20
        }
    }
}

export function PendingActionsWidget() {
    return (
        <motion.div 
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {pendingItems.map((item, index) => (
                <motion.div
                    key={item.id}
                    variants={itemVariants}
                    className="relative p-4 rounded-2xl border border-border/50 hover:border-primary/30 bg-card/30 hover:bg-card/50 transition-all group overflow-hidden"
                    whileHover={{ 
                        scale: 1.01,
                        transition: { duration: 0.2 }
                    }}
                >
                    {/* Subtle hover gradient overlay */}
                    <motion.div 
                        className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.8 }}
                    />

                    <div className="relative flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                                <motion.h4 
                                    className="font-medium text-sm truncate"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.1 + 0.2 }}
                                >
                                    {item.title}
                                </motion.h4>
                                <motion.span 
                                    className={cn(
                                        "text-xs px-2 py-0.5 rounded-full border capitalize shrink-0",
                                        priorityStyles[item.priority as keyof typeof priorityStyles]
                                    )}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ 
                                        delay: index * 0.1 + 0.3,
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 15
                                    }}
                                >
                                    {item.priority}
                                </motion.span>
                            </div>
                            <motion.p 
                                className="text-xs text-muted-foreground leading-relaxed"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.25 }}
                            >
                                {item.description}
                            </motion.p>
                            <motion.div 
                                className="flex items-center gap-1 text-xs text-muted-foreground"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.1 + 0.3 }}
                            >
                                <Clock className="w-3 h-3" />
                                <span>{item.time}</span>
                            </motion.div>
                        </div>
                        <motion.button 
                            className="px-3 py-1.5 text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors flex items-center gap-1 shrink-0 whitespace-nowrap"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ 
                                delay: index * 0.1 + 0.35,
                                type: "spring",
                                stiffness: 400,
                                damping: 15
                            }}
                            whileHover={{ 
                                scale: 1.05,
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {item.action}
                            <ArrowRight className="w-3 h-3" />
                        </motion.button>
                    </div>
                </motion.div>
            ))}
        </motion.div>
    )
}
