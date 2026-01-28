export type UserRole = 'student' | 'teacher' | 'moderator' | 'admin';

export interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    role: UserRole;
    created_at: string;
}
