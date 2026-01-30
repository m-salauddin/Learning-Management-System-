// Re-export AppRole from auth server for dashboard components
export type { AppRole as UserRole } from "@/lib/auth/server";

export const NAV_CONFIG: Record<string, { label: string; color: string }> = {
    student: { label: 'Student', color: 'primary' },
    teacher: { label: 'Instructor', color: 'emerald-500' },
    moderator: { label: 'Moderator', color: 'amber-500' },
    admin: { label: 'Admin', color: 'red-500' },
};
