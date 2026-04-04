import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
    CoursePageData,
    ValidateCouponResponse,
    EnrollmentBoxState,
} from '@/types/course-page';
import * as coursePageActions from '@/lib/actions/course-page';
interface CoursePageState {
    pageData: CoursePageData | null;
    loading: {
        page: boolean;
        enroll: boolean;
        review: boolean;
        lead: boolean;
    };
    errors: {
        page: string | null;
        enroll: string | null;
        review: string | null;
        lead: string | null;
    };
    enrollment: EnrollmentBoxState;
    reviewForm: {
        rating: number;
        text: string;
        isSubmitting: boolean;
        submitted: boolean;
    };
    contactForm: {
        isSubmitting: boolean;
        submitted: boolean;
    };
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
const coursePageSlice = createSlice({
    name: 'coursePage',
    initialState,
    reducers: {
        resetCoursePage(state) {
            return initialState;
        },
        toggleModule(state, action: PayloadAction<string>) {
            const moduleId = action.payload;
            state.expandedModules[moduleId] = !state.expandedModules[moduleId];
        },
        expandAllModules(state) {
            if (state.pageData) {
                state.pageData.modules.forEach((mod) => {
                    state.expandedModules[mod.id] = true;
                });
            }
        },
        collapseAllModules(state) {
            state.expandedModules = {};
        },
        setCouponCode(state, action: PayloadAction<string>) {
            state.enrollment.couponCode = action.payload;
            state.enrollment.appliedCoupon = null;
            state.enrollment.error = null;
        },
        clearCoupon(state) {
            state.enrollment.couponCode = '';
            state.enrollment.appliedCoupon = null;
            state.enrollment.error = null;
        },
        setReviewRating(state, action: PayloadAction<number>) {
            state.reviewForm.rating = action.payload;
        },
        setReviewText(state, action: PayloadAction<string>) {
            state.reviewForm.text = action.payload;
        },
        resetReviewForm(state) {
            state.reviewForm = {
                rating: 5,
                text: '',
                isSubmitting: false,
                submitted: false,
            };
        },
        resetContactForm(state) {
            state.contactForm = {
                isSubmitting: false,
                submitted: false,
            };
        },
        setEnrollmentStatus(state, action: PayloadAction<boolean>) {
            state.enrollment.isEnrolled = action.payload;
            if (state.pageData) {
                state.pageData.isEnrolled = action.payload;
            }
        },
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
        builder
            .addCase(fetchCoursePageData.pending, (state) => {
                state.loading.page = true;
                state.errors.page = null;
            })
            .addCase(fetchCoursePageData.fulfilled, (state, action) => {
                state.loading.page = false;
                state.pageData = action.payload as CoursePageData;
                state.enrollment.isEnrolled = action.payload?.isEnrolled || false;
                if (action.payload?.modules?.length) {
                    state.expandedModules[action.payload.modules[0].id] = true;
                }
            })
            .addCase(fetchCoursePageData.rejected, (state, action) => {
                state.loading.page = false;
                state.errors.page = action.payload as string;
            });
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
