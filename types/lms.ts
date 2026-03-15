

import { Json } from './supabase';



export type UserRole = 'student' | 'teacher' | 'moderator' | 'admin';
export type AuthProvider = 'google' | 'github' | 'password';
export type CourseStatus = 'draft' | 'pending_review' | 'published' | 'archived';
export type LessonType = 'video' | 'text' | 'quiz' | 'assignment';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type CouponType = 'percentage' | 'fixed';
export type EnrollmentStatus = 'active' | 'expired' | 'cancelled' | 'refunded';
export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseType = 'recorded' | 'live' | 'hybrid';



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



export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    color: string;
    serial_number: number;
    parent_id: string | null;
    course_count: number;
    created_at: string;
    updated_at: string;
}



export interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    short_description: string;
    thumbnail_url: string;
    preview_video_url: string;
    instructor_id: string; // Deprecated, keep for now
    instructor_ids: string[];
    support_instructor_ids: string[];
    category_id: string | null;
    price: number;
    discount_price: number | null;
    discount_expires_at: string | null;
    level: CourseLevel;
    course_type: CourseType;
    language: string;
    duration_hours: number;
    total_lessons: number;
    total_students: number;
    rating: number;
    rating_count: number;
    status: CourseStatus;
    published: boolean;
    requirements: string[];
    tags: string[];
    batch_no: number | null;
    serial_number: number;
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



export interface UserActivity {
    id: string;
    user_id: string;
    activity_type: string;
    entity_type: string | null;
    entity_id: string | null;
    metadata: Json;
    created_at: string;
}



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



export interface CreateCourseInput {
    title: string;
    slug?: string;
    description?: string;
    short_description?: string;
    price: number;
    discount_price?: number | null;
    discount_expires_at?: string | null;
    category_id?: string;
    instructor_id?: string; // Primary/Single legacy
    instructor_ids?: string[];
    support_instructor_ids?: string[];
    level?: CourseLevel;
    course_type?: CourseType;
    language?: string;
    thumbnail_url?: string;
    preview_video_url?: string;
    requirements?: string[];
    target_audience?: string[];
    tags?: string[];
    batch_no?: number;
    faqs?: { question: string; answer: string }[];
    projects?: { title: string; description: string; image_url?: string }[];
    resources?: { title: string; type: string; url: string }[];
    modules?: { title: string; lessons: { title: string; video_url: string }[] }[];
    coupon_code?: string;
}

export interface UpdateCourseInput extends Partial<CreateCourseInput> {
    id: string;
    status?: CourseStatus;
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
