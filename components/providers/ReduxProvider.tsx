'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store/store';
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { setUser, setLoading } from '@/lib/store/features/auth/authSlice';
import { UserRole } from '@/types/user';

function AuthInitializer({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const initAuth = async () => {
            const supabase = createClient();
            store.dispatch(setLoading(true));

            // Check current session
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                store.dispatch(setUser({
                    id: session.user.id,
                    email: session.user.email,
                    fullName: session.user.user_metadata?.full_name,
                    role: (session.user.user_metadata?.role as UserRole) || 'student',
                    avatarUrl: session.user.user_metadata?.avatar_url,
                }));
            } else {
                store.dispatch(setUser(null));
            }

            // Listen for changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange(
                async (event, session) => {
                    if (session?.user) {
                        store.dispatch(setUser({
                            id: session.user.id,
                            email: session.user.email,
                            fullName: session.user.user_metadata?.full_name,
                            role: (session.user.user_metadata?.role as UserRole) || 'student',
                            avatarUrl: session.user.user_metadata?.avatar_url,
                        }));
                    } else {
                        store.dispatch(setUser(null));
                    }
                }
            );

            return () => {
                subscription.unsubscribe();
            };
        };

        initAuth();
    }, []);

    return <>{children}</>;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AuthInitializer>{children}</AuthInitializer>
        </Provider>
    );
}
