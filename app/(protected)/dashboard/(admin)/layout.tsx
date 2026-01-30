import { requireAdmin } from "@/lib/auth/server";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Strictly require admin role for all routes in this group
    await requireAdmin();

    return <>{children}</>;
}
