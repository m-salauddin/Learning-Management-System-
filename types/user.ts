export type UserRole = 'student' | 'teacher' | 'moderator' | 'admin';

export type AuthProvider = 'google' | 'github' | 'password';

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    avatar_url: string;
    role: UserRole;
    courses_enrolled: string[];
    providers: AuthProvider[];
    created_at: string;
    updated_at: string;
}
