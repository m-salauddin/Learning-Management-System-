import { User, Course, CourseReview, Module, Lesson, Category } from './lms';
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
export interface CourseProject {
    id: string;
    course_id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    technologies: string[];
    demo_url?: string;
    github_url?: string;
    order_index: number;
    is_public: boolean;
    created_at: string;
    updated_at: string;
}
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
export type OutlineTopicType = 'video' | 'text' | 'quiz' | 'assignment' | 'live';
export interface CourseOutlineTopic {
    id: string;
    module_id: string;
    course_id: string;
    title: string;
    description: string | null;
    position: number;
    topic_type: OutlineTopicType;
    duration_minutes: number;
    is_free_preview: boolean;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}
export interface CourseOutlineModule {
    id: string;
    course_id: string;
    title: string;
    description: string | null;
    position: number;
    is_published: boolean;
    estimated_duration_minutes: number;
    created_at: string;
    updated_at: string;
    topics: CourseOutlineTopic[];
}
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
    role?: 'main' | 'support';
}
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
export interface ReviewWithUser extends CourseReview {
    user: {
        id: string;
        name: string;
        avatar_url: string;
    };
}
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
export interface CoursePageData {
    course: Course;
    details: CourseDetails | null;
    instructor: InstructorInfo;
    instructors?: InstructorInfo[];
    modules: ModuleWithLessonsPreview[];
    totalLessons: number;
    totalDuration: number;
    courseOutline: CourseOutlineModule[];
    projects: CourseProject[];
    resources: CourseResource[];
    faq: CourseFAQ[];
    reviews: ReviewWithUser[];
    ratingBreakdown: RatingBreakdown;
    relatedCourses: Course[];
    category: Category | null;
    isEnrolled: boolean;
    enrollmentId: string | null;
    userProgress: number;
    batches: CourseBatch[];
}
export interface CourseBatch {
    id: string;
    course_id: string;
    batch_name: string;
    start_date: string;
    end_date: string | null;
    seats_total: number;
    seats_remaining: number;
    class_schedule: string;
    is_active: boolean;
}
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
export interface SubmitReviewInput {
    course_id: string;
    rating: number;
    review_text: string;
}
