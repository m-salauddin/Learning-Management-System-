'use server';

// ============================================================================
// COURSE PAGE SERVER ACTIONS
// ============================================================================
// Server-side actions for the comprehensive course detail page
// ============================================================================

import { createClient } from '@/lib/supabase/server';
import {
    CoursePageData,
    CourseDetails,
    CourseProject,
    CourseResource,
    CourseFAQ,
    InstructorInfo,
    ModuleWithLessonsPreview,
    ReviewWithUser,
    RatingBreakdown,
    CreateLeadInput,
    SubmitReviewInput,
    ValidateCouponResponse,
} from '@/types/course-page';
import { Course, Category } from '@/types/lms';

// ============================================================================
// GET COMPLETE COURSE PAGE DATA
// ============================================================================

export async function getCoursePageData(slug: string): Promise<{
    success: boolean;
    data?: CoursePageData;
    error?: string;
}> {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        // 1. Fetch the course by slug
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select(`
                *,
                categories:category_id (
                    id,
                    name,
                    slug,
                    description,
                    icon,
                    course_count
                )
            `)
            .eq('slug', slug)
            .single();

        if (courseError || !course) {
            return { success: false, error: 'Course not found' };
        }

        // Type assertion for course
        const courseData = course as Course & { categories: Category | null };

        // 2. Fetch course details
        const { data: details } = await supabase
            .from('course_details')
            .select('*')
            .eq('course_id', course.id)
            .single();

        // 3. Fetch instructor info with profile
        const { data: instructorData } = await supabase
            .from('users')
            .select(`
                id,
                name,
                email,
                avatar_url,
                bio
            `)
            .eq('id', course.instructor_id)
            .single();

        // Fetch instructor profile
        const { data: instructorProfile } = await supabase
            .from('instructor_profiles')
            .select('*')
            .eq('id', course.instructor_id)
            .single();

        const instructor: InstructorInfo = {
            id: instructorData?.id || course.instructor_id,
            name: instructorData?.name || 'Unknown',
            email: instructorData?.email || '',
            avatar_url: instructorData?.avatar_url || '',
            bio: instructorData?.bio || instructorProfile?.bio || null,
            expertise: instructorProfile?.expertise || [],
            social_links: instructorProfile?.social_links || {},
            total_courses: instructorProfile?.total_courses || 0,
            total_students: instructorProfile?.total_students || 0,
            rating: instructorProfile?.rating || 0,
        };

        // 4. Fetch modules with lessons
        const { data: modulesData } = await supabase
            .from('modules')
            .select(`
                id,
                course_id,
                title,
                description,
                position,
                is_published,
                lessons (
                    id,
                    title,
                    description,
                    lesson_type,
                    position,
                    duration_minutes,
                    is_free_preview,
                    is_published
                )
            `)
            .eq('course_id', course.id)
            .eq('is_published', true)
            .order('position', { ascending: true });

        // Process modules and calculate totals
        let totalLessons = 0;
        let totalDuration = 0;

        const modules: ModuleWithLessonsPreview[] = (modulesData || []).map((mod) => {
            const lessons = ((mod.lessons as unknown[] || []) as {
                id: string;
                title: string;
                description: string;
                lesson_type: string;
                position: number;
                duration_minutes: number;
                is_free_preview: boolean;
                is_published: boolean;
            }[])
                .filter(l => l.is_published)
                .sort((a, b) => a.position - b.position);

            const moduleDuration = lessons.reduce((sum, l) => sum + (l.duration_minutes || 0), 0);
            totalLessons += lessons.length;
            totalDuration += moduleDuration;

            return {
                id: mod.id,
                course_id: mod.course_id,
                title: mod.title,
                description: mod.description || '',
                position: mod.position,
                is_published: mod.is_published,
                lessons,
                total_duration_minutes: moduleDuration,
                lesson_count: lessons.length,
            };
        });

        // 5. Fetch projects
        const { data: projects } = await supabase
            .from('course_projects')
            .select('*')
            .eq('course_id', course.id)
            .order('order_index', { ascending: true });

        // 6. Fetch resources (filtered by access)
        const { data: resources } = await supabase
            .from('course_resources')
            .select('*')
            .eq('course_id', course.id)
            .order('order_index', { ascending: true });

        // 7. Fetch FAQ
        const { data: faq } = await supabase
            .from('course_faq')
            .select('*')
            .eq('course_id', course.id)
            .eq('is_published', true)
            .order('order_index', { ascending: true });

        // 8. Fetch reviews with user info
        const { data: reviewsData } = await supabase
            .from('course_reviews')
            .select(`
                *,
                user:user_id (
                    id,
                    name,
                    avatar_url
                )
            `)
            .eq('course_id', course.id)
            .eq('is_hidden', false)
            .order('created_at', { ascending: false })
            .limit(20);

        const reviews: ReviewWithUser[] = (reviewsData || []).map((r) => ({
            ...r,
            user: r.user as { id: string; name: string; avatar_url: string },
        }));

        // Calculate rating breakdown
        const ratingBreakdown = calculateRatingBreakdown(reviews);

        // 9. Fetch related courses
        const { data: relatedCourses } = await supabase
            .from('courses')
            .select('*')
            .eq('published', true)
            .neq('id', course.id)
            .eq('category_id', course.category_id)
            .limit(4);

        // 10. Check enrollment status
        let isEnrolled = false;
        let enrollmentId: string | null = null;
        let userProgress = 0;

        if (user) {
            const { data: enrollment } = await supabase
                .from('enrollments')
                .select('id, progress_percentage')
                .eq('user_id', user.id)
                .eq('course_id', course.id)
                .maybeSingle();

            if (enrollment) {
                isEnrolled = true;
                enrollmentId = enrollment.id;
                userProgress = enrollment.progress_percentage || 0;
            }
        }

        return {
            success: true,
            data: {
                course: courseData,
                details: details as CourseDetails | null,
                instructor,
                modules,
                totalLessons,
                totalDuration,
                projects: (projects as CourseProject[]) || [],
                resources: (resources as CourseResource[]) || [],
                faq: (faq as CourseFAQ[]) || [],
                reviews,
                ratingBreakdown,
                relatedCourses: (relatedCourses as Course[]) || [],
                category: courseData.categories,
                isEnrolled,
                enrollmentId,
                userProgress,
            },
        };
    } catch (error) {
        console.error('Error fetching course page data:', error);
        return { success: false, error: 'Failed to fetch course data' };
    }
}

// ============================================================================
// HELPER: Calculate Rating Breakdown
// ============================================================================

function calculateRatingBreakdown(reviews: ReviewWithUser[]): RatingBreakdown {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let total = 0;
    let sum = 0;

    reviews.forEach((review) => {
        if (review.rating >= 1 && review.rating <= 5) {
            distribution[review.rating as 1 | 2 | 3 | 4 | 5]++;
            sum += review.rating;
            total++;
        }
    });

    return {
        average: total > 0 ? Math.round((sum / total) * 10) / 10 : 0,
        total,
        distribution,
    };
}

// ============================================================================
// VALIDATE COUPON
// ============================================================================

export async function validateCoupon(
    courseId: string,
    couponCode: string
): Promise<ValidateCouponResponse> {
    try {
        const supabase = await createClient();

        // Get the course price
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('price, discount_price')
            .eq('id', courseId)
            .single();

        if (courseError || !course) {
            return { valid: false, error: 'Course not found' };
        }

        const originalPrice = course.discount_price || course.price;

        // Get the coupon
        const { data: coupon, error: couponError } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', couponCode.toUpperCase())
            .eq('is_active', true)
            .single();

        if (couponError || !coupon) {
            return { valid: false, error: 'Invalid coupon code' };
        }

        // Check expiry
        if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
            return { valid: false, error: 'Coupon has expired' };
        }

        // Check usage limit
        if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
            return { valid: false, error: 'Coupon usage limit reached' };
        }

        // Calculate discount
        let discountAmount: number;
        if (coupon.discount_type === 'percentage') {
            discountAmount = Math.round(originalPrice * (coupon.discount_value / 100));
        } else {
            discountAmount = Math.min(coupon.discount_value, originalPrice);
        }

        // Apply max discount if set
        if (coupon.max_discount_amount) {
            discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
        }

        const finalPrice = Math.max(0, originalPrice - discountAmount);

        return {
            valid: true,
            coupon_id: coupon.id,
            discount_type: coupon.discount_type,
            discount_value: coupon.discount_value,
            discount_amount: discountAmount,
            final_price: finalPrice,
        };
    } catch (error) {
        console.error('Error validating coupon:', error);
        return { valid: false, error: 'Failed to validate coupon' };
    }
}

// ============================================================================
// SUBMIT CONTACT LEAD
// ============================================================================

export async function submitCourseLead(input: CreateLeadInput): Promise<{
    success: boolean;
    error?: string;
}> {
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from('course_leads')
            .insert({
                course_id: input.course_id || null,
                name: input.name,
                email: input.email,
                phone: input.phone || null,
                message: input.message,
                source: input.source || 'course_page',
            });

        if (error) {
            console.error('Error submitting lead:', error);
            return { success: false, error: 'Failed to submit your message' };
        }

        return { success: true };
    } catch (error) {
        console.error('Error submitting lead:', error);
        return { success: false, error: 'Failed to submit your message' };
    }
}

// ============================================================================
// SUBMIT REVIEW
// ============================================================================

export async function submitCourseReview(input: SubmitReviewInput): Promise<{
    success: boolean;
    error?: string;
}> {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'You must be logged in to submit a review' };
        }

        // Check enrollment
        const { data: enrollment } = await supabase
            .from('enrollments')
            .select('id')
            .eq('user_id', user.id)
            .eq('course_id', input.course_id)
            .single();

        if (!enrollment) {
            return { success: false, error: 'You must be enrolled to review this course' };
        }

        // Check if user already reviewed
        const { data: existingReview } = await supabase
            .from('course_reviews')
            .select('id')
            .eq('user_id', user.id)
            .eq('course_id', input.course_id)
            .single();

        if (existingReview) {
            // Update existing review
            const { error } = await supabase
                .from('course_reviews')
                .update({
                    rating: input.rating,
                    review_text: input.review_text,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', existingReview.id);

            if (error) {
                console.error('Error updating review:', error);
                return { success: false, error: 'Failed to update review' };
            }
        } else {
            // Create new review
            const { error } = await supabase
                .from('course_reviews')
                .insert({
                    user_id: user.id,
                    course_id: input.course_id,
                    enrollment_id: enrollment.id,
                    rating: input.rating,
                    review_text: input.review_text,
                });

            if (error) {
                console.error('Error creating review:', error);
                return { success: false, error: 'Failed to submit review' };
            }
        }

        // Update course rating stats
        await updateCourseRating(input.course_id);

        return { success: true };
    } catch (error) {
        console.error('Error submitting review:', error);
        return { success: false, error: 'Failed to submit review' };
    }
}

// ============================================================================
// UPDATE COURSE RATING
// ============================================================================

async function updateCourseRating(courseId: string): Promise<void> {
    const supabase = await createClient();

    // Calculate new average rating
    const { data: reviews } = await supabase
        .from('course_reviews')
        .select('rating')
        .eq('course_id', courseId)
        .eq('is_hidden', false);

    if (!reviews || reviews.length === 0) return;

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Math.round((totalRating / reviews.length) * 10) / 10;

    await supabase
        .from('courses')
        .update({
            rating: avgRating,
            rating_count: reviews.length,
        })
        .eq('id', courseId);
}

// ============================================================================
// GET SIGNED VIDEO URL
// ============================================================================

export async function getSignedVideoUrl(lessonId: string): Promise<{
    success: boolean;
    url?: string;
    expires_at?: string;
    error?: string;
}> {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Authentication required' };
        }

        // Get lesson and verify access
        const { data: lesson, error: lessonError } = await supabase
            .from('lessons')
            .select(`
                id,
                is_free_preview,
                module:module_id (
                    course:course_id (
                        id,
                        instructor_id
                    )
                )
            `)
            .eq('id', lessonId)
            .single();

        if (lessonError || !lesson) {
            return { success: false, error: 'Lesson not found' };
        }

        const moduleData = lesson.module as unknown as { course: { id: string; instructor_id: string } };
        const courseId = moduleData?.course?.id;
        const instructorId = moduleData?.course?.instructor_id;

        // Check access
        const hasAccess =
            lesson.is_free_preview ||
            user.id === instructorId ||
            await checkIsEnrolled(user.id, courseId) ||
            await checkIsAdmin(user.id);

        if (!hasAccess) {
            return { success: false, error: 'Access denied' };
        }

        // Get the video path from lesson_assets
        const { data: asset, error: assetError } = await supabase
            .from('lesson_assets')
            .select('video_path')
            .eq('lesson_id', lessonId)
            .single();

        if (assetError || !asset?.video_path) {
            return { success: false, error: 'Video not found' };
        }

        // Generate signed URL (expires in 5 minutes)
        const { data: signedUrl, error: signError } = await supabase
            .storage
            .from('course-videos')
            .createSignedUrl(asset.video_path, 300); // 5 minutes

        if (signError || !signedUrl) {
            console.error('Error generating signed URL:', signError);
            return { success: false, error: 'Failed to generate video URL' };
        }

        const expiresAt = new Date(Date.now() + 300 * 1000).toISOString();

        return {
            success: true,
            url: signedUrl.signedUrl,
            expires_at: expiresAt,
        };
    } catch (error) {
        console.error('Error getting signed video URL:', error);
        return { success: false, error: 'Failed to get video URL' };
    }
}

// ============================================================================
// GET LESSON CONTENT
// ============================================================================

export async function getLessonContent(lessonId: string): Promise<{
    success: boolean;
    data?: {
        lesson: {
            id: string;
            title: string;
            description: string;
            lesson_type: string;
            duration_minutes: number;
        };
        content: {
            markdown: string;
            resources: Array<{ title: string; url: string; type: string }>;
        };
        hasVideo: boolean;
    };
    error?: string;
}> {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Authentication required' };
        }

        // Get lesson with asset (RLS will handle access check)
        const { data: lesson, error: lessonError } = await supabase
            .from('lessons')
            .select(`
                id,
                title,
                description,
                lesson_type,
                duration_minutes,
                is_free_preview,
                module:module_id (
                    course:course_id (
                        id,
                        instructor_id
                    )
                )
            `)
            .eq('id', lessonId)
            .single();

        if (lessonError || !lesson) {
            return { success: false, error: 'Lesson not found' };
        }

        const moduleData = lesson.module as unknown as { course: { id: string; instructor_id: string } };
        const courseId = moduleData?.course?.id;
        const instructorId = moduleData?.course?.instructor_id;

        // Check access
        const hasAccess =
            lesson.is_free_preview ||
            user.id === instructorId ||
            await checkIsEnrolled(user.id, courseId) ||
            await checkIsAdmin(user.id);

        if (!hasAccess) {
            return { success: false, error: 'Access denied' };
        }

        // Get lesson asset
        const { data: asset } = await supabase
            .from('lesson_assets')
            .select('markdown_content, resources, video_path')
            .eq('lesson_id', lessonId)
            .single();

        return {
            success: true,
            data: {
                lesson: {
                    id: lesson.id,
                    title: lesson.title,
                    description: lesson.description || '',
                    lesson_type: lesson.lesson_type || 'video',
                    duration_minutes: lesson.duration_minutes || 0,
                },
                content: {
                    markdown: asset?.markdown_content || '',
                    resources: (asset?.resources as Array<{ title: string; url: string; type: string }>) || [],
                },
                hasVideo: !!asset?.video_path,
            },
        };
    } catch (error) {
        console.error('Error getting lesson content:', error);
        return { success: false, error: 'Failed to get lesson content' };
    }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function checkIsEnrolled(userId: string, courseId: string): Promise<boolean> {
    const supabase = await createClient();

    const { data } = await supabase
        .from('enrollments')
        .select('id')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .maybeSingle();

    return !!data;
}

async function checkIsAdmin(userId: string): Promise<boolean> {
    const supabase = await createClient();

    const { data } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

    return data?.role === 'admin';
}

// ============================================================================
// GET RELATED COURSES
// ============================================================================

export async function getRelatedCourses(
    courseId: string,
    categoryId: string | null,
    limit: number = 4
): Promise<Course[]> {
    const supabase = await createClient();

    let query = supabase
        .from('courses')
        .select('*')
        .eq('published', true)
        .neq('id', courseId)
        .limit(limit);

    if (categoryId) {
        query = query.eq('category_id', categoryId);
    }

    const { data } = await query;

    return (data as Course[]) || [];
}
