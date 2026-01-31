// ============================================================================
// COURSES REDUX SLICE
// ============================================================================
// State management for courses, modules, lessons
// ============================================================================

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
    CourseWithDetails, CourseWithModules, Category, CourseStatus
} from "@/types/lms";
import * as courseActions from "@/lib/actions/courses";

// ============================================================================
// STATE INTERFACE
// ============================================================================

interface CoursesState {
    // Course list
    courses: CourseWithDetails[];
    totalCourses: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    
    // Filters
    filters: {
        status?: CourseStatus | 'all';
        category?: string;
        level?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    };
    
    // Single course (for editing/viewing)
    currentCourse: CourseWithModules | null;
    
    // Instructor's courses
    instructorCourses: CourseWithDetails[];
    
    // Categories
    categories: Category[];
    
    // Loading states
    loading: {
        list: boolean;
        single: boolean;
        create: boolean;
        update: boolean;
        delete: boolean;
        categories: boolean;
    };
    
    // Error states
    errors: {
        list: string | null;
        single: string | null;
        create: string | null;
        update: string | null;
        delete: string | null;
    };
}

const initialState: CoursesState = {
    courses: [],
    totalCourses: 0,
    currentPage: 1,
    pageSize: 12,
    totalPages: 0,
    filters: {},
    currentCourse: null,
    instructorCourses: [],
    categories: [],
    loading: {
        list: false,
        single: false,
        create: false,
        update: false,
        delete: false,
        categories: false
    },
    errors: {
        list: null,
        single: null,
        create: null,
        update: null,
        delete: null
    }
};

// ============================================================================
// ASYNC THUNKS
// ============================================================================

export const fetchCourses = createAsyncThunk(
    'courses/fetchCourses',
    async (params: {
        page?: number;
        pageSize?: number;
        status?: CourseStatus | 'all';
        category?: string;
        level?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }, { rejectWithValue }) => {
        try {
            const result = await courseActions.getCourses(params);
            return result;
        } catch {
            return rejectWithValue('Failed to fetch courses');
        }
    }
);

export const fetchCourseBySlug = createAsyncThunk(
    'courses/fetchBySlug',
    async (slug: string, { rejectWithValue }) => {
        try {
            const result = await courseActions.getCourseBySlug(slug);
            if (!result.success) {
                return rejectWithValue(result.error);
            }
            return result.data;
        } catch {
            return rejectWithValue('Failed to fetch course');
        }
    }
);

export const fetchCourseById = createAsyncThunk(
    'courses/fetchById',
    async (id: string, { rejectWithValue }) => {
        try {
            const result = await courseActions.getCourseById(id);
            if (!result.success) {
                return rejectWithValue(result.error);
            }
            return result.data;
        } catch {
            return rejectWithValue('Failed to fetch course');
        }
    }
);

export const fetchInstructorCourses = createAsyncThunk(
    'courses/fetchInstructorCourses',
    async (_, { rejectWithValue }) => {
        try {
            const result = await courseActions.getInstructorCourses();
            return result;
        } catch {
            return rejectWithValue('Failed to fetch instructor courses');
        }
    }
);

export const fetchCategories = createAsyncThunk(
    'courses/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const result = await courseActions.getCategories();
            return result;
        } catch {
            return rejectWithValue('Failed to fetch categories');
        }
    }
);

export const createCourse = createAsyncThunk(
    'courses/create',
    async (input: Parameters<typeof courseActions.createCourse>[0], { rejectWithValue }) => {
        try {
            const result = await courseActions.createCourse(input);
            if (!result.success) {
                return rejectWithValue(result.error);
            }
            return result.data;
        } catch {
            return rejectWithValue('Failed to create course');
        }
    }
);

export const updateCourse = createAsyncThunk(
    'courses/update',
    async (input: Parameters<typeof courseActions.updateCourse>[0], { rejectWithValue }) => {
        try {
            const result = await courseActions.updateCourse(input);
            if (!result.success) {
                return rejectWithValue(result.error);
            }
            return result.data;
        } catch {
            return rejectWithValue('Failed to update course');
        }
    }
);

export const deleteCourse = createAsyncThunk(
    'courses/delete',
    async (courseId: string, { rejectWithValue }) => {
        try {
            const result = await courseActions.deleteCourse(courseId);
            if (!result.success) {
                return rejectWithValue(result.error);
            }
            return courseId;
        } catch {
            return rejectWithValue('Failed to delete course');
        }
    }
);

export const publishCourse = createAsyncThunk(
    'courses/publish',
    async (courseId: string, { rejectWithValue }) => {
        try {
            const result = await courseActions.publishCourse(courseId);
            if (!result.success) {
                return rejectWithValue(result.error);
            }
            return result.data;
        } catch {
            return rejectWithValue('Failed to publish course');
        }
    }
);

export const unpublishCourse = createAsyncThunk(
    'courses/unpublish',
    async (courseId: string, { rejectWithValue }) => {
        try {
            const result = await courseActions.unpublishCourse(courseId);
            if (!result.success) {
                return rejectWithValue(result.error);
            }
            return result.data;
        } catch {
            return rejectWithValue('Failed to unpublish course');
        }
    }
);

// ============================================================================
// SLICE
// ============================================================================

const coursesSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        setFilters(state, action: PayloadAction<CoursesState['filters']>) {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters(state) {
            state.filters = {};
        },
        setCurrentPage(state, action: PayloadAction<number>) {
            state.currentPage = action.payload;
        },
        clearCurrentCourse(state) {
            state.currentCourse = null;
        },
        clearErrors(state) {
            state.errors = {
                list: null,
                single: null,
                create: null,
                update: null,
                delete: null
            };
        }
    },
    extraReducers: (builder) => {
        // Fetch courses
        builder
            .addCase(fetchCourses.pending, (state) => {
                state.loading.list = true;
                state.errors.list = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.loading.list = false;
                state.courses = action.payload.data;
                state.totalCourses = action.payload.total;
                state.currentPage = action.payload.page;
                state.pageSize = action.payload.pageSize;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.loading.list = false;
                state.errors.list = action.payload as string;
            });
        
        // Fetch course by slug
        builder
            .addCase(fetchCourseBySlug.pending, (state) => {
                state.loading.single = true;
                state.errors.single = null;
            })
            .addCase(fetchCourseBySlug.fulfilled, (state, action) => {
                state.loading.single = false;
                state.currentCourse = action.payload as CourseWithModules;
            })
            .addCase(fetchCourseBySlug.rejected, (state, action) => {
                state.loading.single = false;
                state.errors.single = action.payload as string;
            });
        
        // Fetch course by ID
        builder
            .addCase(fetchCourseById.pending, (state) => {
                state.loading.single = true;
                state.errors.single = null;
            })
            .addCase(fetchCourseById.fulfilled, (state, action) => {
                state.loading.single = false;
                state.currentCourse = action.payload as CourseWithModules;
            })
            .addCase(fetchCourseById.rejected, (state, action) => {
                state.loading.single = false;
                state.errors.single = action.payload as string;
            });
        
        // Fetch instructor courses
        builder
            .addCase(fetchInstructorCourses.pending, (state) => {
                state.loading.list = true;
            })
            .addCase(fetchInstructorCourses.fulfilled, (state, action) => {
                state.loading.list = false;
                state.instructorCourses = (action.payload.data || []) as CourseWithDetails[];
            })
            .addCase(fetchInstructorCourses.rejected, (state) => {
                state.loading.list = false;
            });
        
        // Fetch categories
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading.categories = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading.categories = false;
                if (action.payload.success && action.payload.data) {
                    state.categories = action.payload.data as Category[];
                }
            })
            .addCase(fetchCategories.rejected, (state) => {
                state.loading.categories = false;
            });
        
        // Create course
        builder
            .addCase(createCourse.pending, (state) => {
                state.loading.create = true;
                state.errors.create = null;
            })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.loading.create = false;
                if (action.payload) {
                    state.instructorCourses.unshift(action.payload as CourseWithDetails);
                }
            })
            .addCase(createCourse.rejected, (state, action) => {
                state.loading.create = false;
                state.errors.create = action.payload as string;
            });
        
        // Update course
        builder
            .addCase(updateCourse.pending, (state) => {
                state.loading.update = true;
                state.errors.update = null;
            })
            .addCase(updateCourse.fulfilled, (state, action) => {
                state.loading.update = false;
                if (action.payload && state.currentCourse) {
                    state.currentCourse = { ...state.currentCourse, ...action.payload };
                }
                // Update in instructor courses list
                const index = state.instructorCourses.findIndex(c => c.id === action.payload?.id);
                if (index !== -1 && action.payload) {
                    state.instructorCourses[index] = { ...state.instructorCourses[index], ...action.payload };
                }
            })
            .addCase(updateCourse.rejected, (state, action) => {
                state.loading.update = false;
                state.errors.update = action.payload as string;
            });
        
        // Delete course
        builder
            .addCase(deleteCourse.pending, (state) => {
                state.loading.delete = true;
                state.errors.delete = null;
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.loading.delete = false;
                state.instructorCourses = state.instructorCourses.filter(c => c.id !== action.payload);
                state.courses = state.courses.filter(c => c.id !== action.payload);
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.loading.delete = false;
                state.errors.delete = action.payload as string;
            });
        
        // Publish/Unpublish
        builder
            .addCase(publishCourse.fulfilled, (state, action) => {
                if (action.payload && state.currentCourse?.id === action.payload.id) {
                    state.currentCourse.status = 'published';
                }
            })
            .addCase(unpublishCourse.fulfilled, (state, action) => {
                if (action.payload && state.currentCourse?.id === action.payload.id) {
                    state.currentCourse.status = 'draft';
                }
            });
    }
});

export const {
    setFilters,
    clearFilters,
    setCurrentPage,
    clearCurrentCourse,
    clearErrors
} = coursesSlice.actions;

export default coursesSlice.reducer;
