export type UserRole = 'student' | 'teacher' | 'moderator' | 'admin';

export type AuthProvider = 'google' | 'github' | 'password';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

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

// Extended User Management Types
export interface ExtendedUser extends UserProfile {
    status?: UserStatus;
    last_login?: string;
    phone?: string;
    bio?: string;
    location?: string;
    website?: string;
    is_verified?: boolean;
    total_courses?: number;
    completed_courses?: number;
    certificates_earned?: number;
}

export interface UserFilters {
    search?: string;
    role?: UserRole | 'all';
    status?: UserStatus | 'all';
    dateFrom?: string;
    dateTo?: string;
    provider?: AuthProvider | 'all';
    verified?: boolean | 'all';
}

export interface UserSortConfig {
    field: 'name' | 'email' | 'role' | 'created_at' | 'last_login' | 'status';
    order: 'asc' | 'desc';
}

export interface UserTableColumn {
    key: string;
    label: string;
    sortable: boolean;
    hidden?: boolean;
}

export interface BulkAction {
    type: 'delete' | 'activate' | 'suspend' | 'change-role' | 'export';
    userIds: string[];
    newRole?: UserRole;
}

export interface UserActivity {
    id: string;
    user_id: string;
    action: string;
    description: string;
    timestamp: string;
    ip_address?: string;
}

export interface UserStats {
    total: number;
    active: number;
    inactive: number;
    suspended: number;
    students: number;
    teachers: number;
    moderators: number;
    admins: number;
    newThisMonth: number;
    growthPercentage: number;
}
