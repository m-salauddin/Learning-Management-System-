import { requireRole } from "@/lib/auth/server";

export default async function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    await requireRole(["teacher"]);
    return <>{children}</>;
}
