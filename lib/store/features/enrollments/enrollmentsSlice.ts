// ============================================================================
// ENROLLMENTS REDUX SLICE
// ============================================================================
// State management for enrollments and progress tracking
// ============================================================================

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
    EnrollmentWithCourse, EnrollmentWithProgress, LessonProgress
} from "@/types/lms";
import * as enrollmentActions from "@/lib/actions/enrollments";

// ============================================================================
// STATE INTERFACE
// ============================================================================

interface CourseProgressSummary {
    enrollment_id: string;
    course_id: string;
    progress_percentage: number;
    completed_lessons: number;
    total_lessons: number;
    completed_at: string | null;
}

interface EnrollmentsState {
    // User's enrollments
    enrollments: EnrollmentWithCourse[];
    totalEnrollments: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    
    // Current enrollment (for course player)
    currentEnrollment: EnrollmentWithProgress | null;
    
    // Lesson progress map (lessonId -> progress)
    lessonProgress: Record<string, LessonProgress>;
    
    // Course progress summary
    courseProgress: CourseProgressSummary | null;
    
    // Resume lesson
    resumeLesson: {
        lesson_id: string;
        lesson_title: string;
        module_title: string;
        watched_seconds: number;
    } | null;
    
    // Enrollment check cache
    enrollmentCache: Record<string, boolean>;
    
    // Loading states
    loading: {
        list: boolean;
        single: boolean;
        progress: boolean;
        update: boolean;
    };
    
    // Error states
    errors: {
        list: string | null;
        single: string | null;
        progress: string | null;
        update: string | null;
    };
}

const initialState: EnrollmentsState = {
    enrollments: [],
    totalEnrollments: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 0,
    currentEnrollment: null,
    lessonProgress: {},
    courseProgress: null,
    resumeLesson: null,
    enrollmentCache: {},
    loading: {
        list: false,
        single: false,
        progress: false,
        update: false
    },
    errors: {
        list: null,
        single: null,
        progress: null,
        update: null
    }
};

// ============================================================================
// ASYNC THUNKS
// ============================================================================

export const fetchMyEnrollments = createAsyncThunk(
    'enrollments/fetchMy',
    async (params: {
        page?: number;
        pageSize?: number;
        status?: 'active' | 'completed' | 'all';
    } = {}, { rejectWithValue }) => {
        try {
            const result = await enrollmentActions.getMyEnrollments(params);
            return result;
        } catch {
            return rejectWithValue('Failed to fetch enrollments');
        }
    }
);

export const fetchEnrollment = createAsyncThunk(
    'enrollments/fetchOne',
    async (courseId: string, { rejectWithValue }) => {
        try {
            const result = await enrollmentActions.getEnrollment(courseId);
            if (!result.success) {
                return rejectWithValue(result.error);
            }
            return result.data;
        } catch {
            return rejectWithValue('Failed to fetch enrollment');
        }
    }
);

export const checkEnrollment = createAsyncThunk(
    'enrollments/check',
    async (courseId: string, { rejectWithValue }) => {
        try {
            const result = await enrollmentActions.checkEnrollment(courseId);
            return { courseId, isEnrolled: result };
        } catch {
            return rejectWithValue('Failed to check enrollment');
        }
    }
);

export const fetchCourseProgress = createAsyncThunk(
    'enrollments/fetchProgress',
    async (courseId: string, { rejectWithValue }) => {
        try {
            const result = await enrollmentActions.getCourseProgress(courseId);
            if (!result.success) {
                return rejectWithValue(result.error);
            }
            return result.data;
        } catch {
            return rejectWithValue('Failed to fetch course progress');
        }
    }
);

export const fetchResumeLesson = createAsyncThunk(
    'enrollments/fetchResumeLesson',
    async (courseId: string, { rejectWithValue }) => {
        try {
            const result = await enrollmentActions.getResumeLesson(courseId);
            if (!result.success) {
                return rejectWithValue(result.error);
            }
            return result.data;
        } catch {
            return rejectWithValue('Failed to get resume lesson');
        }
    }
);

export const updateLessonProgress = createAsyncThunk(
    'enrollments/updateProgress',
    async (params: {
        lessonId: string;
        watchedSeconds: number;
        isCompleted?: boolean;
    }, { rejectWithValue }) => {
        try {
            const result = await enrollmentActions.updateLessonProgress(
                params.lessonId,
                params.watchedSeconds,
                params.isCompleted
            );
            if (!result.success) {
                return rejectWithValue(result.error);
            }
            return { ...result.data, lessonId: params.lessonId };
        } catch {
            return rejectWithValue('Failed to update progress');
        }
    }
);

export const markLessonComplete = createAsyncThunk(
    'enrollments/markComplete',
    async (lessonId: string, { rejectWithValue }) => {
        try {
            const result = await enrollmentActions.markLessonComplete(lessonId);
            if (!result.success) {
                return rejectWithValue(result.error);
            }
            return { lessonId };
        } catch {
            return rejectWithValue('Failed to mark lesson complete');
        }
    }
);

// ============================================================================
// SLICE
// ============================================================================

const enrollmentsSlice = createSlice({
    name: 'enrollments',
    initialState,
    reducers: {
        setCurrentPage(state, action: PayloadAction<number>) {
            state.currentPage = action.payload;
        },
        clearCurrentEnrollment(state) {
            state.currentEnrollment = null;
            state.lessonProgress = {};
            state.courseProgress = null;
            state.resumeLesson = null;
        },
        updateLocalProgress(state, action: PayloadAction<{
            lessonId: string;
            watchedSeconds: number;
            progress: number;
        }>) {
            const { lessonId, watchedSeconds, progress } = action.payload;
            if (state.lessonProgress[lessonId]) {
                state.lessonProgress[lessonId].watched_seconds = watchedSeconds;
                state.lessonProgress[lessonId].progress_percentage = progress;
            } else {
                state.lessonProgress[lessonId] = {
                    id: '',
                    user_id: '',
                    enrollment_id: state.currentEnrollment?.id || '',
                    lesson_id: lessonId,
                    watched_seconds: watchedSeconds,
                    total_seconds: 0,
                    progress_percentage: progress,
                    is_completed: progress >= 100,
                    completed_at: null,
                    started_at: new Date().toISOString(),
                    last_watched_at: new Date().toISOString(),
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
            }
        },
        clearErrors(state) {
            state.errors = {
                list: null,
                single: null,
                progress: null,
                update: null
            };
        }
    },
    extraReducers: (builder) => {
        // Fetch my enrollments
        builder
            .addCase(fetchMyEnrollments.pending, (state) => {
                state.loading.list = true;
                state.errors.list = null;
            })
            .addCase(fetchMyEnrollments.fulfilled, (state, action) => {
                state.loading.list = false;
                state.enrollments = action.payload.data;
                state.totalEnrollments = action.payload.total;
                state.currentPage = action.payload.page;
                state.pageSize = action.payload.pageSize;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchMyEnrollments.rejected, (state, action) => {
                state.loading.list = false;
                state.errors.list = action.payload as string;
            });
        
        // Fetch single enrollment
        builder
            .addCase(fetchEnrollment.pending, (state) => {
                state.loading.single = true;
                state.errors.single = null;
            })
            .addCase(fetchEnrollment.fulfilled, (state, action) => {
                state.loading.single = false;
                state.currentEnrollment = action.payload as EnrollmentWithProgress;
                
                // Build lesson progress map
                const enrollment = action.payload as any;
                if (enrollment?.lesson_progress) {
                    state.lessonProgress = {};
                    enrollment.lesson_progress.forEach((lp: LessonProgress) => {
                        state.lessonProgress[lp.lesson_id] = lp;
                    });
                }
            })
            .addCase(fetchEnrollment.rejected, (state, action) => {
                state.loading.single = false;
                state.errors.single = action.payload as string;
            });
        
        // Check enrollment
        builder
            .addCase(checkEnrollment.fulfilled, (state, action) => {
                state.enrollmentCache[action.payload.courseId] = action.payload.isEnrolled;
            });
        
        // Fetch course progress
        builder
            .addCase(fetchCourseProgress.pending, (state) => {
                state.loading.progress = true;
            })
            .addCase(fetchCourseProgress.fulfilled, (state, action) => {
                state.loading.progress = false;
                state.courseProgress = action.payload as CourseProgressSummary;
            })
            .addCase(fetchCourseProgress.rejected, (state, action) => {
                state.loading.progress = false;
                state.errors.progress = action.payload as string;
            });
        
        // Fetch resume lesson
        builder
            .addCase(fetchResumeLesson.fulfilled, (state, action) => {
                state.resumeLesson = action.payload as any;
            });
        
        // Update lesson progress
        builder
            .addCase(updateLessonProgress.pending, (state) => {
                state.loading.update = true;
            })
            .addCase(updateLessonProgress.fulfilled, (state, action) => {
                state.loading.update = false;
                const data = action.payload as any;
                if (data?.lesson_id) {
                    state.lessonProgress[data.lesson_id] = data;
                }
            })
            .addCase(updateLessonProgress.rejected, (state, action) => {
                state.loading.update = false;
                state.errors.update = action.payload as string;
            });
        
        // Mark lesson complete
        builder
            .addCase(markLessonComplete.fulfilled, (state, action) => {
                const { lessonId } = action.payload;
                if (lessonId && state.lessonProgress[lessonId]) {
                    state.lessonProgress[lessonId].is_completed = true;
                    state.lessonProgress[lessonId].completed_at = new Date().toISOString();
                    state.lessonProgress[lessonId].progress_percentage = 100;
                }
            });
    }
});

export const {
    setCurrentPage,
    clearCurrentEnrollment,
    updateLocalProgress,
    clearErrors
} = enrollmentsSlice.actions;

export default enrollmentsSlice.reducer;
