// ============================================================================
// LMS COMPLETE TYPES
// ============================================================================
// These types match the database schema and are used throughout the application.
// ============================================================================

import { Json } from './supabase';

// ============================================================================
// ENUMS
// ============================================================================

export type UserRole = 'student' | 'teacher' | 'moderator' | 'admin';
export type AuthProvider = 'google' | 'github' | 'password';
export type CourseStatus = 'draft' | 'pending_review' | 'published' | 'archived';
export type LessonType = 'video' | 'text' | 'quiz' | 'assignment';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type CouponType = 'percentage' | 'fixed';
export type EnrollmentStatus = 'active' | 'expired' | 'cancelled' | 'refunded';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

// ============================================================================
// USER TYPES
// ============================================================================

export interface User {
    id: string;
    name: string;
    email: string;
    avatar_url: string;
    courses_enrolled: string[];
    role: UserRole;
    providers: AuthProvider[];
    created_at: string;
    updated_at: string;
}

export interface InstructorProfile {
    id: string;
    bio: string;
    expertise: string[];
    social_links: {
        twitter?: string;
        linkedin?: string;
        youtube?: string;
        website?: string;
    };
    total_courses: number;
    total_students: number;
    rating: number;
    created_at: string;
    updated_at: string;
}

export interface InstructorWithUser extends InstructorProfile {
    user: User;
}

// ============================================================================
// CATEGORY TYPES
// ============================================================================

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    parent_id: string | null;
    course_count: number;
    created_at: string;
    updated_at: string;
}

// ============================================================================
// COURSE TYPES
// ============================================================================

export interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    short_description: string;
    thumbnail_url: string;
    preview_video_url: string;
    instructor_id: string;
    category_id: string | null;
    price: number;
    level: CourseLevel;
    language: string;
    duration_hours: number;
    total_lessons: number;
    total_students: number;
    rating: number;
    rating_count: number;
    status: CourseStatus;
    published: boolean;
    requirements: string[];
    learning_objectives: string[];
    tags: string[];
    created_at: string;
    updated_at: string;
}

export interface CourseWithInstructor extends Course {
    instructor: User;
    category?: Category;
}

export interface CourseWithModules extends CourseWithInstructor {
    modules: ModuleWithLessons[];
}

// ============================================================================
// MODULE TYPES
// ============================================================================

export interface Module {
    id: string;
    course_id: string;
    title: string;
    description: string;
    position: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export interface ModuleWithLessons extends Module {
    lessons: Lesson[];
}

// ============================================================================
// LESSON TYPES
// ============================================================================

export interface Lesson {
    id: string;
    module_id: string;
    title: string;
    description: string;
    lesson_type: LessonType;
    position: number;
    duration_minutes: number;
    is_free_preview: boolean;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export interface LessonAsset {
    id: string;
    lesson_id: string;
    video_path: string;
    video_duration_seconds: number;
    markdown_content: string;
    resources: LessonResource[];
    attachments: string[];
    created_at: string;
    updated_at: string;
}

export interface LessonResource {
    title: string;
    url: string;
    type: 'link' | 'pdf' | 'code' | 'file';
}

export interface LessonWithAsset extends Lesson {
    asset?: LessonAsset;
}

// ============================================================================
// ENROLLMENT TYPES
// ============================================================================

export interface Enrollment {
    id: string;
    user_id: string;
    course_id: string;
    enrolled_at: string;
    expires_at: string | null;
    status: EnrollmentStatus;
    progress_percentage: number;
    completed_lessons: number;
    total_lessons: number;
    last_accessed_at: string;
    last_lesson_id: string | null;
    completed_at: string | null;
    certificate_issued: boolean;
    created_at: string;
    updated_at: string;
}

export interface EnrollmentWithCourse extends Enrollment {
    course: CourseWithInstructor;
}

export interface EnrollmentWithProgress extends Enrollment {
    course: CourseWithInstructor;
    lesson_progress: LessonProgress[];
}

// ============================================================================
// PROGRESS TYPES
// ============================================================================

export interface LessonProgress {
    id: string;
    user_id: string;
    lesson_id: string;
    enrollment_id: string;
    watched_seconds: number;
    total_seconds: number;
    progress_percentage: number;
    is_completed: boolean;
    completed_at: string | null;
    started_at: string;
    last_watched_at: string;
    created_at: string;
    updated_at: string;
}

// ============================================================================
// COUPON TYPES
// ============================================================================

export interface Coupon {
    id: string;
    code: string;
    discount_type: CouponType;
    discount_value: number;
    min_purchase_amount: number;
    max_discount_amount: number | null;
    valid_from: string;
    valid_until: string | null;
    usage_limit: number | null;
    usage_count: number;
    per_user_limit: number;
    course_ids: string[];
    category_ids: string[];
    is_active: boolean;
    description: string;
    created_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface CouponValidationResult {
    valid: boolean;
    error?: string;
    coupon_id?: string;
    discount_type?: CouponType;
    discount_value?: number;
    discount_amount?: number;
    final_price?: number;
}

// ============================================================================
// TRANSACTION TYPES
// ============================================================================

export interface Transaction {
    id: string;
    user_id: string;
    course_id: string;
    amount: number;
    currency: string;
    original_price: number;
    discount_amount: number;
    coupon_id: string | null;
    coupon_code: string;
    payment_provider: string;
    payment_intent_id: string;
    payment_method: string;
    status: TransactionStatus;
    paid_at: string | null;
    refunded_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface TransactionWithDetails extends Transaction {
    user: User;
    course: Course;
    coupon?: Coupon;
}

// ============================================================================
// CERTIFICATE TYPES
// ============================================================================

export interface Certificate {
    id: string;
    user_id: string;
    course_id: string;
    enrollment_id: string;
    certificate_number: string;
    issued_at: string;
    verification_url: string;
    is_valid: boolean;
    student_name: string;
    course_title: string;
    instructor_name: string;
    completion_date: string;
    created_at: string;
}

export interface CertificateVerification {
    valid: boolean;
    error?: string;
    student_name?: string;
    course_title?: string;
    instructor_name?: string;
    completion_date?: string;
    issued_at?: string;
}

// ============================================================================
// REVIEW TYPES
// ============================================================================

export interface CourseReview {
    id: string;
    user_id: string;
    course_id: string;
    enrollment_id: string;
    rating: number;
    review_text: string;
    is_verified: boolean;
    is_featured: boolean;
    is_hidden: boolean;
    helpful_count: number;
    created_at: string;
    updated_at: string;
}

export interface CourseReviewWithUser extends CourseReview {
    user: User;
}

// ============================================================================
// DASHBOARD STATS TYPES
// ============================================================================

export interface AdminDashboardStats {
    total_users: number;
    total_students: number;
    total_teachers: number;
    total_courses: number;
    published_courses: number;
    total_enrollments: number;
    active_enrollments: number;
    total_revenue: number;
    new_users_today: number;
    new_enrollments_today: number;
    revenue_today: number;
}

export interface InstructorDashboardStats {
    total_courses: number;
    published_courses: number;
    total_students: number;
    total_revenue: number;
    avg_rating: number;
    total_reviews: number;
}

export interface StudentDashboardStats {
    enrolled_courses: number;
    completed_courses: number;
    in_progress_courses: number;
    total_certificates: number;
    total_learning_time: number;
    avg_progress: number;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface DailyStats {
    date: string;
    count: number;
}

export interface PopularCourse {
    course_id: string;
    title: string;
    instructor_name: string;
    enrollment_count: number;
    revenue: number;
    rating: number;
}

export interface RevenueStats {
    total: number;
    by_day: DailyStats[];
    by_course: { course_id: string; title: string; revenue: number }[];
}

// ============================================================================
// AUDIT LOG TYPES
// ============================================================================

export interface AuditLog {
    id: string;
    user_id: string | null;
    action: string;
    entity_type: string;
    entity_id: string | null;
    old_values: Json | null;
    new_values: Json | null;
    ip_address: string | null;
    user_agent: string;
    created_at: string;
}

export interface AuditLogEntry extends AuditLog {
    admin?: {
        id: string;
        name: string;
        email: string;
        avatar_url: string | null;
    };
}

// ============================================================================
// USER MANAGEMENT TYPES
// ============================================================================

export interface UserManagement extends User {
    instructor_profile?: InstructorProfile;
}

export interface CertificateWithDetails extends Certificate {
    course: Course;
    user: User;
}

export interface CourseWithDetails extends CourseWithInstructor {
    enrollments_count?: number;
    revenue?: number;
}

export interface CourseProgressSummary {
    enrollment_id: string;
    course_id: string;
    progress_percentage: number;
    completed_lessons: number;
    total_lessons: number;
    completed_at: string | null;
}

// ============================================================================
// USER ACTIVITY TYPES
// ============================================================================

export interface UserActivity {
    id: string;
    user_id: string;
    activity_type: string;
    entity_type: string | null;
    entity_id: string | null;
    metadata: Json;
    created_at: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface CreateCourseInput {
    title: string;
    description?: string;
    short_description?: string;
    price: number;
    category_id?: string;
    level?: CourseLevel;
    language?: string;
    requirements?: string[];
    learning_objectives?: string[];
    tags?: string[];
}

export interface UpdateCourseInput extends Partial<CreateCourseInput> {
    id: string;
    status?: CourseStatus;
    thumbnail_url?: string;
    preview_video_url?: string;
}

export interface CreateModuleInput {
    course_id: string;
    title: string;
    description?: string;
    position?: number;
}

export interface CreateLessonInput {
    module_id: string;
    title: string;
    description?: string;
    lesson_type?: LessonType;
    position?: number;
    duration_minutes?: number;
    is_free_preview?: boolean;
}

export interface UpdateLessonAssetInput {
    lesson_id: string;
    video_path?: string;
    video_duration_seconds?: number;
    markdown_content?: string;
    resources?: LessonResource[];
    attachments?: string[];
}

export interface CreateTransactionInput {
    course_id: string;
    coupon_code?: string;
    payment_provider: string;
}

export interface CreateReviewInput {
    course_id: string;
    rating: number;
    review_text?: string;
}
