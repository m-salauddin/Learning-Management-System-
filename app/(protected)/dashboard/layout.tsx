import { requireAuth } from "@/lib/auth/server";
import { DashboardLayoutClient } from "./layoutClient";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { role } = await requireAuth();

    return (
        <DashboardLayoutClient role={role!}>
            {children}
        </DashboardLayoutClient>
    );
}
