"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Check, Info, AlertTriangle, XCircle, CheckCircle2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useOnClickOutside } from "usehooks-ts";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error' | 'system';
    is_read: boolean;
    link?: string;
    created_at: string;
}

export function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    useOnClickOutside(dropdownRef as React.RefObject<HTMLElement>, () => setIsOpen(false));

    useEffect(() => {
        fetchNotifications();
        subscribeToNotifications();

        return () => {
            supabase.channel('public:notifications').unsubscribe();
        };
    }, []);

    useEffect(() => {
        setUnreadCount(notifications.filter(n => !n.is_read).length);
    }, [notifications]);

    const fetchNotifications = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(10);

            if (data) {
                setNotifications(data as Notification[]);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const subscribeToNotifications = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        supabase
            .channel('public:notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                },
                (payload) => {
                    const newNotification = payload.new as Notification;
                    setNotifications(prev => [newNotification, ...prev]);
                }
            )
            .subscribe();
    };

    const markAsRead = async (id: string) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));

        await supabase
            .from('notifications')
            // @ts-expect-error - Update type not correctly inferred for notifications
            .update({ is_read: true } as any)
            .eq('id', id);
    };

    const markAllAsRead = async () => {
        const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
        if (unreadIds.length === 0) return;

        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));

        await supabase
            .from('notifications')
            // @ts-expect-error - Update type not correctly inferred for notifications
            .update({ is_read: true } as any)
            .in('id', unreadIds);
    };

    const clearNotification = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifications(prev => prev.filter(n => n.id !== id));
        await supabase.from('notifications').delete().eq('id', id);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            case 'error': return <XCircle className="w-4 h-4 text-rose-500" />;
            case 'system': return <Info className="w-4 h-4 text-blue-500" />;
            default: return <Bell className="w-4 h-4 text-primary" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-muted/50 border border-border/50 hover:bg-muted/80 hover:text-foreground transition-all duration-200 cursor-pointer text-muted-foreground"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 sm:w-96 p-2 bg-white/80 dark:bg-slate-950/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl shadow-2xl origin-top-right overflow-hidden z-50"
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
                            <h3 className="font-semibold text-sm">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-primary hover:text-primary/70 font-medium cursor-pointer"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto py-2 space-y-1">
                            {isLoading ? (
                                <div className="p-4 text-center text-xs text-muted-foreground">Loading...</div>
                            ) : notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
                                        <Bell className="w-5 h-5 text-muted-foreground/50" />
                                    </div>
                                    <p className="text-sm font-medium text-foreground">No notifications</p>
                                    <p className="text-xs text-muted-foreground mt-1">You're all caught up!</p>
                                </div>
                            ) : (
                                notifications.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => markAsRead(item.id)}
                                        className={cn(
                                            "relative group flex gap-3 px-3 py-3 mx-1 rounded-xl transition-colors cursor-pointer",
                                            item.is_read ? "hover:bg-muted/40 opacity-70" : "bg-primary/5 hover:bg-primary/10"
                                        )}
                                    >
                                        <div className="mt-0.5 shrink-0">
                                            {getIcon(item.type)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-start gap-2">
                                                <p className={cn("text-sm leading-none", !item.is_read && "font-semibold")}>
                                                    {item.title}
                                                </p>
                                                <span className="text-[10px] text-muted-foreground shrink-0 tabular-nums">
                                                    {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {item.message}
                                            </p>
                                            {item.link && (
                                                <Link
                                                    href={item.link}
                                                    className="inline-block text-[10px] font-medium text-primary hover:underline mt-1"
                                                >
                                                    View Details
                                                </Link>
                                            )}
                                        </div>
                                        <button
                                            onClick={(e) => clearNotification(item.id, e)}
                                            className="opacity-0 group-hover:opacity-100 absolute top-2 right-2 p-1 rounded-md hover:bg-red-500/10 hover:text-red-500 transition-all"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                        {!item.is_read && (
                                            <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary" />
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
