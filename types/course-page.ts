// ============================================================================
// COURSE PAGE TYPES
// ============================================================================
// Types for the comprehensive course detail page
// ============================================================================

import { User, Course, CourseReview, Module, Lesson, Category } from './lms';

// ============================================================================
// COURSE DETAILS (Extended Marketing Content)
// ============================================================================

export interface CourseDetails {
    course_id: string;
    description_long: string;
    learning_outcomes: string[];
    requirements: string[];
    target_audience: string[];
    curriculum_overview: string;
    language: string;
    last_updated_at: string;
    trailer_lesson_id: string | null;
    seo_title: string | null;
    seo_description: string | null;
    seo_keywords: string[];
    created_at: string;
    updated_at: string;
}

// ============================================================================
// COURSE PROJECTS
// ============================================================================

export interface CourseProject {
    id: string;
    course_id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    technologies: string[];
    order_index: number;
    is_public: boolean;
    created_at: string;
    updated_at: string;
}

// ============================================================================
// COURSE RESOURCES
// ============================================================================

export type ResourceType = 'file' | 'link' | 'pdf' | 'code' | 'video';

export interface CourseResource {
    id: string;
    course_id: string;
    title: string;
    description: string;
    resource_type: ResourceType;
    storage_path: string | null;
    external_url: string | null;
    file_size_bytes: number | null;
    is_public: boolean;
    order_index: number;
    created_at: string;
    updated_at: string;
}

// ============================================================================
// COURSE FAQ
// ============================================================================

export interface CourseFAQ {
    id: string;
    course_id: string;
    question: string;
    answer: string;
    order_index: number;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

// ============================================================================
// COURSE LEADS (Contact Form)
// ============================================================================

export interface CourseLead {
    id: string;
    course_id: string | null;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    source: string;
    is_read: boolean;
    is_processed: boolean;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateLeadInput {
    course_id?: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    source?: string;
}

// ============================================================================
// INSTRUCTOR WITH PROFILE
// ============================================================================

export interface InstructorInfo {
    id: string;
    name: string;
    email: string;
    avatar_url: string;
    bio: string | null;
    expertise: string[];
    social_links: {
        twitter?: string;
        linkedin?: string;
        youtube?: string;
        website?: string;
        github?: string;
    };
    total_courses: number;
    total_students: number;
    rating: number;
}

// ============================================================================
// RATING BREAKDOWN
// ============================================================================

export interface RatingBreakdown {
    average: number;
    total: number;
    distribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
}

// ============================================================================
// REVIEW WITH USER
// ============================================================================

export interface ReviewWithUser extends CourseReview {
    user: {
        id: string;
        name: string;
        avatar_url: string;
    };
}

// ============================================================================
// MODULE WITH LESSONS (For Curriculum Display)
// ============================================================================

export interface LessonPreview {
    id: string;
    title: string;
    description: string;
    lesson_type: string;
    position: number;
    duration_minutes: number;
    is_free_preview: boolean;
    is_published: boolean;
}

export interface ModuleWithLessonsPreview {
    id: string;
    course_id: string;
    title: string;
    description: string;
    position: number;
    is_published: boolean;
    lessons: LessonPreview[];
    total_duration_minutes: number;
    lesson_count: number;
}

// ============================================================================
// COURSE PAGE DATA (Complete Page Payload)
// ============================================================================

export interface CoursePageData {
    // Core course info
    course: Course;
    details: CourseDetails | null;

    // Instructor
    instructor: InstructorInfo;

    // Curriculum
    modules: ModuleWithLessonsPreview[];
    totalLessons: number;
    totalDuration: number;

    // Sections
    projects: CourseProject[];
    resources: CourseResource[];
    faq: CourseFAQ[];

    // Reviews
    reviews: ReviewWithUser[];
    ratingBreakdown: RatingBreakdown;

    // Related
    relatedCourses: Course[];

    // Category
    category: Category | null;

    // User-specific (only if logged in)
    isEnrolled: boolean;
    enrollmentId: string | null;
    userProgress: number;
}

// ============================================================================
// ENROLLMENT BOX STATE
// ============================================================================

export interface EnrollmentBoxState {
    isEnrolled: boolean;
    isPurchasing: boolean;
    couponCode: string;
    appliedCoupon: {
        code: string;
        discount_type: 'percentage' | 'fixed';
        discount_value: number;
        discount_amount: number;
        final_price: number;
    } | null;
    error: string | null;
}

// ============================================================================
// LESSON PLAYER STATE
// ============================================================================

export interface LessonPlayerState {
    currentLessonId: string | null;
    lessonContent: {
        markdown: string;
        resources: Array<{
            title: string;
            url: string;
            type: string;
        }>;
    } | null;
    signedVideoUrl: string | null;
    videoExpiry: Date | null;
    progress: {
        watchedSeconds: number;
        totalSeconds: number;
        isCompleted: boolean;
    };
    loading: boolean;
    error: string | null;
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface SignedVideoResponse {
    url: string;
    expires_at: string;
}

export interface ValidateCouponResponse {
    valid: boolean;
    error?: string;
    coupon_id?: string;
    discount_type?: 'percentage' | 'fixed';
    discount_value?: number;
    discount_amount?: number;
    final_price?: number;
}

export interface EnrollCourseResponse {
    success: boolean;
    enrollment_id?: string;
    error?: string;
    transaction_id?: string;
}

// ============================================================================
// SUBMIT REVIEW INPUT
// ============================================================================

export interface SubmitReviewInput {
    course_id: string;
    rating: number;
    review_text: string;
}
