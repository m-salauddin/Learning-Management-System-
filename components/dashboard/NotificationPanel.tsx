"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Check, Clock, Info, Shield, BookOpen, X, CreditCard, UserPlus, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { 
    getNotifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    deleteNotification,
    Notification 
} from "@/lib/actions/notifications";
import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
    const [isLoading, setIsLoading] = useState(true);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    const fetchNotifications = useCallback(async () => {
        setIsLoading(true);
        const result = await getNotifications();
        if (result.success && result.data) {
            setNotifications(result.data);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchNotifications();

        // Set up Realtime subscription
        const channel = supabase
            .channel('notifications_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'notifications'
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        const newNotification = payload.new as Notification;
                        setNotifications(prev => [newNotification, ...prev]);
                        // Show a toast for new notifications if the panel is closed
                        if (!isOpen) {
                            toast.info(newNotification.title, {
                                description: newNotification.message,
                                action: {
                                    label: 'View',
                                    onClick: () => {
                                        setIsOpen(true);
                                    }
                                }
                            });
                        }
                    } else if (payload.eventType === 'UPDATE') {
                        const updatedNotification = payload.new as Notification;
                        setNotifications(prev => 
                            prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
                        );
                    } else if (payload.eventType === 'DELETE') {
                        const deletedId = payload.old.id;
                        setNotifications(prev => prev.filter(n => n.id !== deletedId));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchNotifications, supabase, isOpen]);

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

    const unreadCount = notifications.filter(n => !n.is_read).length;
    const filteredNotifications = activeTab === 'all'
        ? notifications
        : notifications.filter(n => !n.is_read);

    const handleMarkAllAsRead = async () => {
        const result = await markAllNotificationsAsRead();
        if (result.success) {
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        }
    };

    const handleMarkAsRead = async (id: string) => {
        const result = await markNotificationAsRead(id);
        if (result.success) {
            setNotifications(notifications.map(n => n.id === id ? ({ ...n, is_read: true }) : n));
        }
    };

    const handleDeleteNotification = async (id: string) => {
        const result = await deleteNotification(id);
        if (result.success) {
            setNotifications(notifications.filter(n => n.id !== id));
        }
    };

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.is_read) {
            await handleMarkAsRead(notification.id);
        }
        if (notification.link) {
            router.push(notification.link);
            setIsOpen(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type.toLowerCase()) {
            case 'security': return <Shield className="w-4 h-4 text-red-500" />;
            case 'course': return <BookOpen className="w-4 h-4 text-blue-500" />;
            case 'payment': return <CreditCard className="w-4 h-4 text-emerald-500" />;
            case 'success': return <Check className="w-4 h-4 text-emerald-500" />;
            case 'info': return <Info className="w-4 h-4 text-blue-500" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            case 'enrollment': return <UserPlus className="w-4 h-4 text-violet-500" />;
            default: return <Bell className="w-4 h-4 text-primary" />;
        }
    };

    const getIconBg = (type: string) => {
        switch (type.toLowerCase()) {
            case 'security': return "bg-red-500/10";
            case 'course': return "bg-blue-500/10";
            case 'payment': return "bg-emerald-500/10";
            case 'success': return "bg-emerald-500/10";
            case 'info': return "bg-blue-500/10";
            case 'warning': return "bg-amber-500/10";
            case 'enrollment': return "bg-violet-500/10";
            default: return "bg-primary/10";
        }
    };

    return (
        <div className="relative" ref={wrapperRef}>
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

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute right-0 top-14.5 mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-background shadow-xl overflow-hidden z-50 flex flex-col max-h-[80vh]"
                    >
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
                                    onClick={handleMarkAllAsRead}
                                    className="text-xs text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer hover:underline"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

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
                                            <Skeleton key={i} className="flex gap-3 p-3 rounded-lg bg-muted/50 border border-border/20">
                                                <div className="w-9 h-9 rounded-lg shrink-0 bg-muted-foreground/10" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-3 w-3/4 bg-muted-foreground/10 rounded-md" />
                                                    <div className="h-2 w-full bg-muted-foreground/10 rounded-md" />
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
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                        transition: {
                                                            duration: 0.2,
                                                            delay: index * 0.03
                                                        }
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        x: 10,
                                                        transition: { duration: 0.15 }
                                                    }}
                                                    className={cn(
                                                        "group relative flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all duration-150 border border-transparent",
                                                        !notification.is_read
                                                            ? "bg-primary/5 hover:bg-primary/8 border-primary/10"
                                                            : "hover:bg-muted/50"
                                                    )}
                                                    onClick={() => handleNotificationClick(notification)}
                                                >
                                                    <div className={cn(
                                                        "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                                                        getIconBg(notification.type || 'info')
                                                    )}>
                                                        {getIcon(notification.type || 'info')}
                                                    </div>
                                                    
                                                    <div className="flex-1 min-w-0 space-y-0.5 pr-8">
                                                        <p className={cn(
                                                            "text-sm",
                                                            !notification.is_read
                                                                ? "font-semibold text-foreground"
                                                                : "font-medium text-foreground/80"
                                                        )}>
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                            {notification.message}
                                                        </p>
                                                        <div className="flex items-center gap-1 pt-1">
                                                            <Clock className="w-3 h-3 text-muted-foreground/60" />
                                                            <span className="text-[11px] text-muted-foreground/60">
                                                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="absolute top-2 right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {!notification.is_read && (
                                                            <motion.button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleMarkAsRead(notification.id);
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
                                                                handleDeleteNotification(notification.id);
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
