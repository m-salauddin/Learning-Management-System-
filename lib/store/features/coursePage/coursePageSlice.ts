// ============================================================================
// COURSE PAGE REDUX SLICE
// ============================================================================
// State management for the public course detail page
// ============================================================================

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
    CoursePageData,
    ValidateCouponResponse,
    EnrollmentBoxState,
} from '@/types/course-page';
import * as coursePageActions from '@/lib/actions/course-page';

// ============================================================================
// STATE INTERFACE
// ============================================================================

interface CoursePageState {
    // Page data
    pageData: CoursePageData | null;

    // Loading states
    loading: {
        page: boolean;
        enroll: boolean;
        review: boolean;
        lead: boolean;
    };

    // Errors
    errors: {
        page: string | null;
        enroll: string | null;
        review: string | null;
        lead: string | null;
    };

    // Enrollment box state
    enrollment: EnrollmentBoxState;

    // Review form state
    reviewForm: {
        rating: number;
        text: string;
        isSubmitting: boolean;
        submitted: boolean;
    };

    // Contact form state
    contactForm: {
        isSubmitting: boolean;
        submitted: boolean;
    };

    // Curriculum accordion state
    expandedModules: Record<string, boolean>;
}

const initialState: CoursePageState = {
    pageData: null,
    loading: {
        page: false,
        enroll: false,
        review: false,
        lead: false,
    },
    errors: {
        page: null,
        enroll: null,
        review: null,
        lead: null,
    },
    enrollment: {
        isEnrolled: false,
        isPurchasing: false,
        couponCode: '',
        appliedCoupon: null,
        error: null,
    },
    reviewForm: {
        rating: 5,
        text: '',
        isSubmitting: false,
        submitted: false,
    },
    contactForm: {
        isSubmitting: false,
        submitted: false,
    },
    expandedModules: {},
};

// ============================================================================
// ASYNC THUNKS
// ============================================================================

export const fetchCoursePageData = createAsyncThunk(
    'coursePage/fetchData',
    async (slug: string, { rejectWithValue }) => {
        const result = await coursePageActions.getCoursePageData(slug);
        if (!result.success) {
            return rejectWithValue(result.error);
        }
        return result.data;
    }
);

export const validateCoupon = createAsyncThunk(
    'coursePage/validateCoupon',
    async ({ courseId, couponCode }: { courseId: string; couponCode: string }, { rejectWithValue }) => {
        const result = await coursePageActions.validateCoupon(courseId, couponCode);
        if (!result.valid) {
            return rejectWithValue(result.error);
        }
        return result;
    }
);

export const submitLead = createAsyncThunk(
    'coursePage/submitLead',
    async (input: Parameters<typeof coursePageActions.submitCourseLead>[0], { rejectWithValue }) => {
        const result = await coursePageActions.submitCourseLead(input);
        if (!result.success) {
            return rejectWithValue(result.error);
        }
        return result;
    }
);

export const submitReview = createAsyncThunk(
    'coursePage/submitReview',
    async (input: Parameters<typeof coursePageActions.submitCourseReview>[0], { rejectWithValue }) => {
        const result = await coursePageActions.submitCourseReview(input);
        if (!result.success) {
            return rejectWithValue(result.error);
        }
        return result;
    }
);

// ============================================================================
// SLICE
// ============================================================================

const coursePageSlice = createSlice({
    name: 'coursePage',
    initialState,
    reducers: {
        // Reset page state
        resetCoursePage(state) {
            return initialState;
        },

        // Toggle module expansion
        toggleModule(state, action: PayloadAction<string>) {
            const moduleId = action.payload;
            state.expandedModules[moduleId] = !state.expandedModules[moduleId];
        },

        // Expand all modules
        expandAllModules(state) {
            if (state.pageData) {
                state.pageData.modules.forEach((mod) => {
                    state.expandedModules[mod.id] = true;
                });
            }
        },

        // Collapse all modules
        collapseAllModules(state) {
            state.expandedModules = {};
        },

        // Set coupon code
        setCouponCode(state, action: PayloadAction<string>) {
            state.enrollment.couponCode = action.payload;
            state.enrollment.appliedCoupon = null;
            state.enrollment.error = null;
        },

        // Clear coupon
        clearCoupon(state) {
            state.enrollment.couponCode = '';
            state.enrollment.appliedCoupon = null;
            state.enrollment.error = null;
        },

        // Set review rating
        setReviewRating(state, action: PayloadAction<number>) {
            state.reviewForm.rating = action.payload;
        },

        // Set review text
        setReviewText(state, action: PayloadAction<string>) {
            state.reviewForm.text = action.payload;
        },

        // Reset review form
        resetReviewForm(state) {
            state.reviewForm = {
                rating: 5,
                text: '',
                isSubmitting: false,
                submitted: false,
            };
        },

        // Reset contact form
        resetContactForm(state) {
            state.contactForm = {
                isSubmitting: false,
                submitted: false,
            };
        },

        // Set enrollment status (for SSR hydration)
        setEnrollmentStatus(state, action: PayloadAction<boolean>) {
            state.enrollment.isEnrolled = action.payload;
            if (state.pageData) {
                state.pageData.isEnrolled = action.payload;
            }
        },

        // Clear errors
        clearErrors(state) {
            state.errors = {
                page: null,
                enroll: null,
                review: null,
                lead: null,
            };
        },
    },
    extraReducers: (builder) => {
        // Fetch course page data
        builder
            .addCase(fetchCoursePageData.pending, (state) => {
                state.loading.page = true;
                state.errors.page = null;
            })
            .addCase(fetchCoursePageData.fulfilled, (state, action) => {
                state.loading.page = false;
                state.pageData = action.payload as CoursePageData;
                state.enrollment.isEnrolled = action.payload?.isEnrolled || false;

                // Auto-expand first module
                if (action.payload?.modules?.length) {
                    state.expandedModules[action.payload.modules[0].id] = true;
                }
            })
            .addCase(fetchCoursePageData.rejected, (state, action) => {
                state.loading.page = false;
                state.errors.page = action.payload as string;
            });

        // Validate coupon
        builder
            .addCase(validateCoupon.pending, (state) => {
                state.enrollment.error = null;
            })
            .addCase(validateCoupon.fulfilled, (state, action) => {
                const result = action.payload as ValidateCouponResponse;
                state.enrollment.appliedCoupon = {
                    code: state.enrollment.couponCode,
                    discount_type: result.discount_type!,
                    discount_value: result.discount_value!,
                    discount_amount: result.discount_amount!,
                    final_price: result.final_price!,
                };
                state.enrollment.error = null;
            })
            .addCase(validateCoupon.rejected, (state, action) => {
                state.enrollment.appliedCoupon = null;
                state.enrollment.error = action.payload as string;
            });

        // Submit lead
        builder
            .addCase(submitLead.pending, (state) => {
                state.loading.lead = true;
                state.contactForm.isSubmitting = true;
                state.errors.lead = null;
            })
            .addCase(submitLead.fulfilled, (state) => {
                state.loading.lead = false;
                state.contactForm.isSubmitting = false;
                state.contactForm.submitted = true;
            })
            .addCase(submitLead.rejected, (state, action) => {
                state.loading.lead = false;
                state.contactForm.isSubmitting = false;
                state.errors.lead = action.payload as string;
            });

        // Submit review
        builder
            .addCase(submitReview.pending, (state) => {
                state.loading.review = true;
                state.reviewForm.isSubmitting = true;
                state.errors.review = null;
            })
            .addCase(submitReview.fulfilled, (state) => {
                state.loading.review = false;
                state.reviewForm.isSubmitting = false;
                state.reviewForm.submitted = true;
            })
            .addCase(submitReview.rejected, (state, action) => {
                state.loading.review = false;
                state.reviewForm.isSubmitting = false;
                state.errors.review = action.payload as string;
            });
    },
});

// ============================================================================
// EXPORTS
// ============================================================================

export const {
    resetCoursePage,
    toggleModule,
    expandAllModules,
    collapseAllModules,
    setCouponCode,
    clearCoupon,
    setReviewRating,
    setReviewText,
    resetReviewForm,
    resetContactForm,
    setEnrollmentStatus,
    clearErrors,
} = coursePageSlice.actions;

// Selectors
export const selectCoursePageData = (state: { coursePage: CoursePageState }) =>
    state.coursePage.pageData;
export const selectCoursePageLoading = (state: { coursePage: CoursePageState }) =>
    state.coursePage.loading;
export const selectCoursePageErrors = (state: { coursePage: CoursePageState }) =>
    state.coursePage.errors;
export const selectEnrollmentBox = (state: { coursePage: CoursePageState }) =>
    state.coursePage.enrollment;
export const selectExpandedModules = (state: { coursePage: CoursePageState }) =>
    state.coursePage.expandedModules;
export const selectReviewForm = (state: { coursePage: CoursePageState }) =>
    state.coursePage.reviewForm;
export const selectContactForm = (state: { coursePage: CoursePageState }) =>
    state.coursePage.contactForm;

export default coursePageSlice.reducer;
