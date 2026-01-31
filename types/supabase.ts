export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    name: string
                    email: string
                    avatar_url: string
                    courses_enrolled: string[]
                    role: 'student' | 'teacher' | 'moderator' | 'admin'
                    providers: ('google' | 'github' | 'password')[]
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    name?: string
                    email: string
                    avatar_url?: string
                    courses_enrolled?: string[]
                    role?: 'student' | 'teacher' | 'moderator' | 'admin'
                    providers?: ('google' | 'github' | 'password')[]
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    avatar_url?: string
                    courses_enrolled?: string[]
                    role?: 'student' | 'teacher' | 'moderator' | 'admin'
                    providers?: ('google' | 'github' | 'password')[]
                    created_at?: string
                    updated_at?: string
                }
            }
            role_requests: {
                Row: {
                    id: string
                    user_id: string
                    requested_role: 'student' | 'teacher' | 'moderator' | 'admin'
                    status: 'pending' | 'approved' | 'rejected'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    requested_role: 'student' | 'teacher' | 'moderator' | 'admin'
                    status?: 'pending' | 'approved' | 'rejected'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    requested_role?: 'student' | 'teacher' | 'moderator' | 'admin'
                    status?: 'pending' | 'approved' | 'rejected'
                    created_at?: string
                    updated_at?: string
                }
            }
            categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    description: string | null
                    icon: string | null
                    parent_id: string | null
                    course_count: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                    description?: string | null
                    icon?: string | null
                    parent_id?: string | null
                    course_count?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                    description?: string | null
                    icon?: string | null
                    parent_id?: string | null
                    course_count?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            courses: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    instructor_id: string
                    price: number
                    thumbnail_url: string | null
                    published: boolean
                    created_at: string
                    updated_at: string
                    // Extended columns
                    slug: string | null
                    short_description: string | null
                    preview_video_url: string | null
                    category_id: string | null
                    level: 'beginner' | 'intermediate' | 'advanced' | null
                    language: string | null
                    duration_hours: number | null
                    total_lessons: number | null
                    total_students: number | null
                    rating: number | null
                    rating_count: number | null
                    status: 'draft' | 'pending_review' | 'published' | 'archived' | null
                    requirements: string[] | null
                    learning_objectives: string[] | null
                    tags: string[] | null
                }
                Insert: {
                    id?: string
                    title: string
                    description?: string | null
                    instructor_id: string
                    price?: number
                    thumbnail_url?: string | null
                    published?: boolean
                    created_at?: string
                    updated_at?: string
                    slug?: string | null
                    short_description?: string | null
                    preview_video_url?: string | null
                    category_id?: string | null
                    level?: 'beginner' | 'intermediate' | 'advanced' | null
                    language?: string | null
                    duration_hours?: number | null
                    total_lessons?: number | null
                    total_students?: number | null
                    rating?: number | null
                    rating_count?: number | null
                    status?: 'draft' | 'pending_review' | 'published' | 'archived' | null
                    requirements?: string[] | null
                    learning_objectives?: string[] | null
                    tags?: string[] | null
                }
                Update: {
                    id?: string
                    title?: string
                    description?: string | null
                    instructor_id?: string
                    price?: number
                    thumbnail_url?: string | null
                    published?: boolean
                    created_at?: string
                    updated_at?: string
                    slug?: string | null
                    short_description?: string | null
                    preview_video_url?: string | null
                    category_id?: string | null
                    level?: 'beginner' | 'intermediate' | 'advanced' | null
                    language?: string | null
                    duration_hours?: number | null
                    total_lessons?: number | null
                    total_students?: number | null
                    rating?: number | null
                    rating_count?: number | null
                    status?: 'draft' | 'pending_review' | 'published' | 'archived' | null
                    requirements?: string[] | null
                    learning_objectives?: string[] | null
                    tags?: string[] | null
                }
            }
            modules: {
                Row: {
                    id: string
                    course_id: string
                    title: string
                    description: string | null
                    position: number
                    is_published: boolean | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    course_id: string
                    title: string
                    description?: string | null
                    position?: number
                    is_published?: boolean | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    course_id?: string
                    title?: string
                    description?: string | null
                    position?: number
                    is_published?: boolean | null
                    created_at?: string
                    updated_at?: string
                }
            }
            lessons: {
                Row: {
                    id: string
                    module_id: string
                    title: string
                    description: string | null
                    lesson_type: 'video' | 'text' | 'quiz' | 'assignment' | null
                    position: number
                    duration_minutes: number | null
                    is_free_preview: boolean | null
                    is_published: boolean | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    module_id: string
                    title: string
                    description?: string | null
                    lesson_type?: 'video' | 'text' | 'quiz' | 'assignment' | null
                    position?: number
                    duration_minutes?: number | null
                    is_free_preview?: boolean | null
                    is_published?: boolean | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    module_id?: string
                    title?: string
                    description?: string | null
                    lesson_type?: 'video' | 'text' | 'quiz' | 'assignment' | null
                    position?: number
                    duration_minutes?: number | null
                    is_free_preview?: boolean | null
                    is_published?: boolean | null
                    created_at?: string
                    updated_at?: string
                }
            }
            lesson_assets: {
                Row: {
                    id: string
                    lesson_id: string
                    video_path: string | null
                    video_duration_seconds: number | null
                    markdown_content: string | null
                    resources: Json | null
                    attachments: string[] | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    lesson_id: string
                    video_path?: string | null
                    video_duration_seconds?: number | null
                    markdown_content?: string | null
                    resources?: Json | null
                    attachments?: string[] | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    lesson_id?: string
                    video_path?: string | null
                    video_duration_seconds?: number | null
                    markdown_content?: string | null
                    resources?: Json | null
                    attachments?: string[] | null
                    created_at?: string
                    updated_at?: string
                }
            }
            enrollments: {
                Row: {
                    id: string
                    user_id: string
                    course_id: string
                    enrolled_at: string
                    expires_at: string | null
                    status: string | null // 'active' | 'expired' | 'cancelled' | 'refunded'
                    progress_percentage: number | null
                    completed_lessons: number | null
                    total_lessons: number | null
                    last_accessed_at: string | null
                    last_lesson_id: string | null
                    completed_at: string | null
                    certificate_issued: boolean | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    course_id: string
                    enrolled_at?: string
                    expires_at?: string | null
                    status?: string | null
                    progress_percentage?: number | null
                    completed_lessons?: number | null
                    total_lessons?: number | null
                    last_accessed_at?: string | null
                    last_lesson_id?: string | null
                    completed_at?: string | null
                    certificate_issued?: boolean | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    course_id?: string
                    enrolled_at?: string
                    expires_at?: string | null
                    status?: string | null
                    progress_percentage?: number | null
                    completed_lessons?: number | null
                    total_lessons?: number | null
                    last_accessed_at?: string | null
                    last_lesson_id?: string | null
                    completed_at?: string | null
                    certificate_issued?: boolean | null
                    created_at?: string
                    updated_at?: string
                }
            }
            lesson_progress: {
                Row: {
                    id: string
                    user_id: string
                    lesson_id: string
                    enrollment_id: string
                    watched_seconds: number | null
                    total_seconds: number | null
                    progress_percentage: number | null
                    is_completed: boolean | null
                    completed_at: string | null
                    started_at: string | null
                    last_watched_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    lesson_id: string
                    enrollment_id: string
                    watched_seconds?: number | null
                    total_seconds?: number | null
                    progress_percentage?: number | null
                    is_completed?: boolean | null
                    completed_at?: string | null
                    started_at?: string | null
                    last_watched_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    lesson_id?: string
                    enrollment_id?: string
                    watched_seconds?: number | null
                    total_seconds?: number | null
                    progress_percentage?: number | null
                    is_completed?: boolean | null
                    completed_at?: string | null
                    started_at?: string | null
                    last_watched_at?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            notifications: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    message: string
                    type: 'info' | 'success' | 'warning' | 'error' | 'system'
                    is_read: boolean
                    link: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    message: string
                    type: 'info' | 'success' | 'warning' | 'error' | 'system'
                    is_read?: boolean
                    link?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    message?: string
                    type?: 'info' | 'success' | 'warning' | 'error' | 'system'
                    is_read?: boolean
                    link?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            user_role: 'student' | 'teacher' | 'moderator' | 'admin'
            auth_provider: 'google' | 'github' | 'password'
            course_status: 'draft' | 'pending_review' | 'published' | 'archived'
            lesson_type: 'video' | 'text' | 'quiz' | 'assignment'
            transaction_status: 'pending' | 'completed' | 'failed' | 'refunded'
            coupon_type: 'percentage' | 'fixed'
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
