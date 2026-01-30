"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Check, Clock, Info, Shield, BookOpen, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// Mock Data
const MOCK_NOTIFICATIONS = [
    {
        id: "1",
        title: "New Course Available",
        description: "Advanced React Patterns course is now live.",
        time: "2 min ago",
        type: "course",
        unread: true,
    },
    {
        id: "2",
        title: "Security Alert",
        description: "New login detected from a new device.",
        time: "1 hour ago",
        type: "security",
        unread: true,
    },
    {
        id: "3",
        title: "Assignment Due",
        description: "Your assignment for Next.js Fundamentals is due tomorrow.",
        time: "5 hours ago",
        type: "info",
        unread: false,
    },
    {
        id: "4",
        title: "System Update",
        description: "Platform maintenance scheduled for this weekend.",
        time: "1 day ago",
        type: "system",
        unread: false,
    },
];

// Animation variants for cleaner, professional animations
const panelVariants = {
    hidden: {
        opacity: 0,
        y: -8,
        scale: 0.98
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94] as const
        }
    },
    exit: {
        opacity: 0,
        y: -8,
        scale: 0.98,
        transition: {
            duration: 0.15,
            ease: "easeIn" as const
        }
    }
};

const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.04,
            delayChildren: 0.05
        }
    }
};


export function NotificationPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            const timer = setTimeout(() => setIsLoading(false), 1500); // Simulate network latency
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const unreadCount = notifications.filter(n => n.unread).length;
    const filteredNotifications = activeTab === 'all'
        ? notifications
        : notifications.filter(n => n.unread);

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n => n.id === id ? ({ ...n, unread: false }) : n));
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'security': return <Shield className="w-4 h-4 text-red-500" />;
            case 'course': return <BookOpen className="w-4 h-4 text-blue-500" />;
            case 'system': return <Info className="w-4 h-4 text-amber-500" />;
            default: return <Bell className="w-4 h-4 text-primary" />;
        }
    };

    const getIconBg = (type: string) => {
        switch (type) {
            case 'security': return "bg-red-500/10";
            case 'course': return "bg-blue-500/10";
            case 'system': return "bg-amber-500/10";
            default: return "bg-primary/10";
        }
    };

    return (
        <div className="relative" ref={wrapperRef}>
            {/* Bell Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "relative flex items-center justify-center w-10 h-10 rounded-xl border border-border/50 cursor-pointer",
                    "bg-muted/50 hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isOpen && "bg-muted/80 text-foreground"
                )}
                whileTap={{ scale: 0.95 }}
            >
                <Bell className="w-5 h-5" />
                <AnimatePresence>
                    {unreadCount > 0 && (
                        <motion.span
                            className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 text-[10px] font-medium bg-red-500 text-white rounded-full flex items-center justify-center border-2 border-background"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring" as const, stiffness: 500, damping: 25 }}
                        >
                            {unreadCount}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute right-0 top-14.5 mt-2 w-80 sm:w-96 rounded-2xl border border-white/20 dark:border-white/10 bg-white dark:bg-slate-950 shadow-xl overflow-hidden z-50 flex flex-col max-h-[80vh]"
                    >
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between bg-muted/30">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-sm">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer hover:underline"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="flex p-1.5 gap-1 border-b border-border/30 bg-muted/20">
                            {(['all', 'unread'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "relative flex-1 py-2 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer",
                                        activeTab === tab
                                            ? "text-foreground"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                                    )}
                                >
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-primary/10 rounded-lg shadow-sm border border-primary/30"
                                            transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
                                        />
                                    )}
                                    <span className={cn(
                                        "relative z-10 capitalize",
                                        activeTab === tab && "text-primary font-semibold"
                                    )}>
                                        {tab === 'unread' ? `Unread (${unreadCount})` : 'All'}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Notification List */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            <AnimatePresence mode="popLayout">
                                {isLoading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="p-2 space-y-2"
                                    >
                                        {[1, 2, 3].map((i) => (
                                            <Skeleton key={i} className="flex gap-3 p-3 rounded-lg">
                                                <div className="w-9 h-9 rounded-lg shrink-0 bg-muted-foreground/20" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-3 w-3/4 bg-muted-foreground/20 rounded-md" />
                                                    <div className="h-2 w-full bg-muted-foreground/20 rounded-md" />
                                                </div>
                                            </Skeleton>
                                        ))}
                                    </motion.div>
                                ) : filteredNotifications.length === 0 ? (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex flex-col items-center justify-center py-12 text-muted-foreground"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                                            <Bell className="w-6 h-6 opacity-40" />
                                        </div>
                                        <p className="text-sm font-medium">No notifications</p>
                                        <p className="text-xs text-muted-foreground/70 mt-0.5">
                                            You&apos;re all caught up!
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={activeTab}
                                        variants={listContainerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="p-2 space-y-1"
                                    >
                                        <AnimatePresence initial={false}>
                                            {filteredNotifications.map((notification, index) => (
                                                <motion.div
                                                    key={notification.id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{
                                                        opacity: 1,
                                                        transition: {
                                                            duration: 0.2,
                                                            delay: index * 0.03
                                                        }
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        transition: { duration: 0.15 }
                                                    }}
                                                    className={cn(
                                                        "group relative flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors duration-150",
                                                        notification.unread
                                                            ? "bg-primary/3 hover:bg-primary/6"
                                                            : "hover:bg-muted/40"
                                                    )}
                                                    onClick={() => notification.unread && markAsRead(notification.id)}
                                                >
                                                    {/* Icon */}
                                                    <div className={cn(
                                                        "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                                                        getIconBg(notification.type)
                                                    )}>
                                                        {getIcon(notification.type)}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0 space-y-0.5 pr-8">
                                                        <p className={cn(
                                                            "text-sm",
                                                            notification.unread
                                                                ? "font-semibold text-foreground"
                                                                : "font-medium text-foreground/80"
                                                        )}>
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                            {notification.description}
                                                        </p>
                                                        <div className="flex items-center gap-1 pt-1">
                                                            <Clock className="w-3 h-3 text-muted-foreground/60" />
                                                            <span className="text-[11px] text-muted-foreground/60">
                                                                {notification.time}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Unread Indicator - only shows when NOT hovering */}
                                                    {notification.unread && (
                                                        <div className="absolute top-3.5 right-3 w-2 h-2 rounded-full bg-primary group-hover:opacity-0 transition-opacity duration-150" />
                                                    )}

                                                    {/* Action Buttons - only shows on hover */}
                                                    <div className="absolute top-2 right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                                        {notification.unread && (
                                                            <motion.button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    markAsRead(notification.id);
                                                                }}
                                                                className="p-1.5 rounded-md text-muted-foreground/60 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                title="Mark as read"
                                                            >
                                                                <Check className="w-3.5 h-3.5" />
                                                            </motion.button>
                                                        )}
                                                        <motion.button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteNotification(notification.id);
                                                            }}
                                                            className="p-1.5 rounded-md text-muted-foreground/60 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            title="Delete"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </motion.button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
