"use client";
import { useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAppDispatch } from "@/lib/store/hooks";
import { setUser, setLoading } from "@/lib/store/features/auth/authSlice";
import { Session } from "@supabase/supabase-js";
import { usePathname } from "next/navigation";

export function AuthListener() {
    const dispatch = useAppDispatch();
    const pathname = usePathname();

    const fetchAndDispatchUser = useCallback(async (session: Session | null) => {
        const supabase = createClient();
        if (session?.user) {
            try {
                const { data: profile, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .maybeSingle();

                if (error) {
                    console.error('Error fetching user profile:', JSON.stringify(error, null, 2));
                }

                if (profile) {
                    dispatch(setUser({
                        id: session.user.id,
                        email: session.user.email!,
                        fullName: profile.name,
                        role: profile.role,
                        avatarUrl: profile.avatar_url,
                        coursesEnrolled: profile.courses_enrolled || [],
                        providers: profile.providers || []
                    }));
                } else {
                    console.warn("User profile not found in database yet. Waiting for trigger...");
                }
            } catch (err) {
                console.error('Unexpected error in AuthListener:', err);
                dispatch(setLoading(false));
            }
        } else {
            dispatch(setUser(null));
        }
        dispatch(setLoading(false));
    }, [dispatch]);

    useEffect(() => {
        const supabase = createClient();

        const initSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            await fetchAndDispatchUser(session);
        };

        initSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                dispatch(setUser(null));
                dispatch(setLoading(false));
            } else if (session?.user) {
                fetchAndDispatchUser(session);
            } else {
                dispatch(setLoading(false));
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [dispatch, fetchAndDispatchUser, pathname]);

    return null;
}
