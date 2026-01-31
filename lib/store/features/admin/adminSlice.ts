// ============================================================================
// ADMIN REDUX SLICE
// ============================================================================
// State management for admin dashboard, analytics, and user management
// ============================================================================

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
    AdminDashboardStats, UserManagement, AuditLogEntry
} from "@/types/lms";
import * as adminActions from "@/lib/actions/admin";

// ============================================================================
// STATE INTERFACE
// ============================================================================

interface AdminState {
    // Dashboard stats
    dashboardStats: AdminDashboardStats | null;
    
    // Platform metrics
    platformMetrics: {
        totalUsers: number;
        activeUsers: number;
        totalCourses: number;
        publishedCourses: number;
        totalEnrollments: number;
        completedEnrollments: number;
        totalRevenue: number;
        averageRating: number;
    } | null;
    
    // Revenue metrics
    revenueMetrics: {
        total: number;
        byPeriod: { period: string; amount: number }[];
        byCourse: { courseId: string; title: string; amount: number }[];
    } | null;
    
    // Popular courses
    popularCourses: Array<{
        course_id: string;
        title: string;
        enrollment_count: number;
        avg_rating: number;
    }>;
    
    // Enrollment trends
    enrollmentTrends: Array<{ date: string; count: number }>;
    
    // User management
    users: UserManagement[];
    totalUsers: number;
    usersPage: number;
    usersPageSize: number;
    usersTotalPages: number;
    usersFilters: {
        role?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    };
    
    // Audit log
    auditLog: AuditLogEntry[];
    auditLogTotal: number;
    auditLogPage: number;
    auditLogPageSize: number;
    auditLogTotalPages: number;
    
    // Daily active users
    dailyActiveUsers: number;
    
    // Loading states
    loading: {
        stats: boolean;
        metrics: boolean;
        revenue: boolean;
        users: boolean;
        auditLog: boolean;
        userAction: boolean;
    };
    
    // Error states
    errors: {
        stats: string | null;
        metrics: string | null;
        revenue: string | null;
        users: string | null;
        auditLog: string | null;
        userAction: string | null;
    };
}

const initialState: AdminState = {
    dashboardStats: null,
    platformMetrics: null,
    revenueMetrics: null,
    popularCourses: [],
    enrollmentTrends: [],
    users: [],
    totalUsers: 0,
    usersPage: 1,
    usersPageSize: 10,
    usersTotalPages: 0,
    usersFilters: {},
    auditLog: [],
    auditLogTotal: 0,
    auditLogPage: 1,
    auditLogPageSize: 20,
    auditLogTotalPages: 0,
    dailyActiveUsers: 0,
    loading: {
        stats: false,
        metrics: false,
        revenue: false,
        users: false,
        auditLog: false,
        userAction: false
    },
    errors: {
        stats: null,
        metrics: null,
        revenue: null,
        users: null,
        auditLog: null,
        userAction: null
    }
};

// ============================================================================
// ASYNC THUNKS
// ============================================================================

export const fetchDashboardStats = createAsyncThunk(
    'admin/fetchDashboardStats',
    async (_, { rejectWithValue }) => {
        try {
            const result = await adminActions.getAdminDashboardStats();
            if (!result.success) {
                return rejectWithValue(result.error);
            }
            return result.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch dashboard stats');
        }
    }
);

export const fetchPlatformMetrics = createAsyncThunk(
    'admin/fetchPlatformMetrics',
    async (_, { rejectWithValue }) => {
        try {
            const result = await adminActions.getPlatformMetrics();
            if (!result.success) {
                return rejectWithValue(result.error);
            }
            return result.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch platform metrics');
        }
    }
);

export const fetchRevenueMetrics = createAsyncThunk(
    'admin/fetchRevenueMetrics',
    async (params: {
        startDate?: string;
        endDate?: string;
        groupBy?: 'day' | 'week' | 'month';
    } = {}, { rejectWithValue }) => {
        try {
            const result = await adminActions.getRevenueMetrics(params);
            if (!result.success) {
                return rejectWithValue(result.error);
            }
            return result.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch revenue metrics');
        }
    }
);

export const fetchPopularCourses = createAsyncThunk(
    'admin/fetchPopularCourses',
    async (limit: number = 5, { rejectWithValue }) => {
        try {
            const result = await adminActions.getPopularCourses(limit);
            if (!result.success) {
                return rejectWithValue(result.error);
            }
            return result.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch popular courses');
        }
    }
);

export const fetchEnrollmentTrends = createAsyncThunk(
    'admin/fetchEnrollmentTrends',
    async (days: number = 30, { rejectWithValue }) => {
        try {
            const result = await adminActions.getEnrollmentTrends(days);
            if (!result.success) {
                return rejectWithValue(result.error);
            }
            return result.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch enrollment trends');
        }
    }
);

export const fetchDailyActiveUsers = createAsyncThunk(
    'admin/fetchDailyActiveUsers',
    async (days: number = 7, { rejectWithValue }) => {
        try {
            const result = await adminActions.getDailyActiveUsers(days);
            if (!result.success) {
                return rejectWithValue(result.error);
            }
            return result.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch daily active users');
        }
    }
);

export const fetchUsers = createAsyncThunk(
    'admin/fetchUsers',
    async (params: {
        page?: number;
        pageSize?: number;
        role?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    } = {}, { rejectWithValue }) => {
        try {
            const result = await adminActions.getAllUsers(params);
            return result;
        } catch (error) {
            return rejectWithValue('Failed to fetch users');
        }
    }
);

export const updateUserRole = createAsyncThunk(
    'admin/updateUserRole',
    async (params: {
        userId: string;
        newRole: 'admin' | 'moderator' | 'teacher' | 'student';
    }, { rejectWithValue }) => {
        try {
            const result = await adminActions.updateUserRole(params.userId, params.newRole);
            if (!result.success) {
                return rejectWithValue(result.error);
            }
            return params;
        } catch (error) {
            return rejectWithValue('Failed to update user role');
        }
    }
);

export const suspendUser = createAsyncThunk(
    'admin/suspendUser',
    async (params: {
        userId: string;
        reason: string;
    }, { rejectWithValue }) => {
        try {
            const result = await adminActions.suspendUser(params.userId, params.reason);
            if (!result.success) {
                return rejectWithValue(result.error);
            }
            return params.userId;
        } catch (error) {
            return rejectWithValue('Failed to suspend user');
        }
    }
);

export const fetchAuditLog = createAsyncThunk(
    'admin/fetchAuditLog',
    async (params: {
        page?: number;
        pageSize?: number;
        action?: string;
        adminId?: string;
        targetType?: string;
        startDate?: string;
        endDate?: string;
    } = {}, { rejectWithValue }) => {
        try {
            const result = await adminActions.getAuditLog(params);
            return result;
        } catch (error) {
            return rejectWithValue('Failed to fetch audit log');
        }
    }
);

export const approveCourse = createAsyncThunk(
    'admin/approveCourse',
    async (courseId: string, { rejectWithValue }) => {
        try {
            const result = await adminActions.approveCourse(courseId);
            if (!result.success) {
                return rejectWithValue(result.error);
            }
            return courseId;
        } catch (error) {
            return rejectWithValue('Failed to approve course');
        }
    }
);

export const rejectCourse = createAsyncThunk(
    'admin/rejectCourse',
    async (params: { courseId: string; reason: string }, { rejectWithValue }) => {
        try {
            const result = await adminActions.rejectCourse(params.courseId, params.reason);
            if (!result.success) {
                return rejectWithValue(result.error);
            }
            return params.courseId;
        } catch (error) {
            return rejectWithValue('Failed to reject course');
        }
    }
);

// ============================================================================
// SLICE
// ============================================================================

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setUsersFilters(state, action: PayloadAction<AdminState['usersFilters']>) {
            state.usersFilters = { ...state.usersFilters, ...action.payload };
        },
        clearUsersFilters(state) {
            state.usersFilters = {};
        },
        setUsersPage(state, action: PayloadAction<number>) {
            state.usersPage = action.payload;
        },
        setAuditLogPage(state, action: PayloadAction<number>) {
            state.auditLogPage = action.payload;
        },
        clearErrors(state) {
            state.errors = {
                stats: null,
                metrics: null,
                revenue: null,
                users: null,
                auditLog: null,
                userAction: null
            };
        }
    },
    extraReducers: (builder) => {
        // Dashboard stats
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.loading.stats = true;
                state.errors.stats = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.loading.stats = false;
                state.dashboardStats = action.payload as AdminDashboardStats;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading.stats = false;
                state.errors.stats = action.payload as string;
            });
        
        // Platform metrics
        builder
            .addCase(fetchPlatformMetrics.pending, (state) => {
                state.loading.metrics = true;
                state.errors.metrics = null;
            })
            .addCase(fetchPlatformMetrics.fulfilled, (state, action) => {
                state.loading.metrics = false;
                state.platformMetrics = action.payload as any;
            })
            .addCase(fetchPlatformMetrics.rejected, (state, action) => {
                state.loading.metrics = false;
                state.errors.metrics = action.payload as string;
            });
        
        // Revenue metrics
        builder
            .addCase(fetchRevenueMetrics.pending, (state) => {
                state.loading.revenue = true;
                state.errors.revenue = null;
            })
            .addCase(fetchRevenueMetrics.fulfilled, (state, action) => {
                state.loading.revenue = false;
                state.revenueMetrics = action.payload as any;
            })
            .addCase(fetchRevenueMetrics.rejected, (state, action) => {
                state.loading.revenue = false;
                state.errors.revenue = action.payload as string;
            });
        
        // Popular courses
        builder
            .addCase(fetchPopularCourses.fulfilled, (state, action) => {
                state.popularCourses = action.payload || [];
            });
        
        // Enrollment trends
        builder
            .addCase(fetchEnrollmentTrends.fulfilled, (state, action) => {
                state.enrollmentTrends = action.payload || [];
            });
        
        // Daily active users
        builder
            .addCase(fetchDailyActiveUsers.fulfilled, (state, action) => {
                state.dailyActiveUsers = action.payload || 0;
            });
        
        // Fetch users
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading.users = true;
                state.errors.users = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading.users = false;
                state.users = action.payload.data;
                state.totalUsers = action.payload.total;
                state.usersPage = action.payload.page;
                state.usersPageSize = action.payload.pageSize;
                state.usersTotalPages = action.payload.totalPages;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading.users = false;
                state.errors.users = action.payload as string;
            });
        
        // Update user role
        builder
            .addCase(updateUserRole.pending, (state) => {
                state.loading.userAction = true;
                state.errors.userAction = null;
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                state.loading.userAction = false;
                const { userId, newRole } = action.payload;
                const userIndex = state.users.findIndex(u => u.id === userId);
                if (userIndex !== -1) {
                    state.users[userIndex].role = newRole;
                }
            })
            .addCase(updateUserRole.rejected, (state, action) => {
                state.loading.userAction = false;
                state.errors.userAction = action.payload as string;
            });
        
        // Suspend user
        builder
            .addCase(suspendUser.pending, (state) => {
                state.loading.userAction = true;
                state.errors.userAction = null;
            })
            .addCase(suspendUser.fulfilled, (state, action) => {
                state.loading.userAction = false;
                // Could update user status in list if we have a status field
            })
            .addCase(suspendUser.rejected, (state, action) => {
                state.loading.userAction = false;
                state.errors.userAction = action.payload as string;
            });
        
        // Audit log
        builder
            .addCase(fetchAuditLog.pending, (state) => {
                state.loading.auditLog = true;
                state.errors.auditLog = null;
            })
            .addCase(fetchAuditLog.fulfilled, (state, action) => {
                state.loading.auditLog = false;
                state.auditLog = action.payload.data;
                state.auditLogTotal = action.payload.total;
                state.auditLogPage = action.payload.page;
                state.auditLogPageSize = action.payload.pageSize;
                state.auditLogTotalPages = action.payload.totalPages;
            })
            .addCase(fetchAuditLog.rejected, (state, action) => {
                state.loading.auditLog = false;
                state.errors.auditLog = action.payload as string;
            });
    }
});

export const {
    setUsersFilters,
    clearUsersFilters,
    setUsersPage,
    setAuditLogPage,
    clearErrors
} = adminSlice.actions;

export default adminSlice.reducer;
