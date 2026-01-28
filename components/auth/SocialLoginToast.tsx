"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { createClient } from "@/lib/supabase/client";
import { useAppDispatch } from "@/lib/store/hooks";
import { setUser } from "@/lib/store/features/auth/authSlice";

export function SocialLoginToast() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const toast = useToast();
    const dispatch = useAppDispatch();
    const hasToasted = useRef(false);

    useEffect(() => {
        const checkLogin = async () => {
            const isSocialLogin = searchParams?.get("social_login") === "success";
            const isGoogleLogin = searchParams?.get("google_login") === "success";

            if ((isSocialLogin || isGoogleLogin) && !hasToasted.current) {
                hasToasted.current = true;


                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    toast.success("Welcome back!", `Signed in as ${user.user_metadata?.full_name || user.email}`);
                } else {
                    toast.success("Welcome back!", "Successfully signed in with social account.");
                }


                const params = new URLSearchParams(searchParams.toString());
                params.delete("social_login");
                params.delete("google_login");
                router.replace(`?${params.toString()}`);
            }
        };

        checkLogin();
    }, [searchParams, router, toast, dispatch]);

    return null;
}
