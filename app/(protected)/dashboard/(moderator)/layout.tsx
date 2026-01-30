import { requireRole } from "@/lib/auth/server";

export default async function ModeratorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireRole(["moderator"]);
    return <>{children}</>;
}
