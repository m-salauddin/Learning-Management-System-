"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAppDispatch } from "@/lib/store/hooks";
import { setUser, setLoading } from "@/lib/store/features/auth/authSlice";

export function AuthListener() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const supabase = createClient();


        const initSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                dispatch(setUser({
                    id: session.user.id,
                    email: session.user.email!,
                    fullName: session.user.user_metadata?.full_name,
                    role: session.user.user_metadata?.role || 'student',
                    avatarUrl: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture
                }));
            } else {
                dispatch(setLoading(false));
            }
        };

        initSession();


        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                dispatch(setUser({
                    id: session.user.id,
                    email: session.user.email!,
                    fullName: session.user.user_metadata?.full_name,
                    role: session.user.user_metadata?.role || 'student',
                    avatarUrl: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture
                }));
            } else if (event === 'SIGNED_OUT') {
                dispatch(setUser(null));
            }
            dispatch(setLoading(false));
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [dispatch]);

    return null;
}
