import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Coupon } from "@/types/lms";
import { TableState, createInitialTableState } from "@/lib/store/utils/tableState";

// ============================================================================
// STATE
// ============================================================================

interface CouponsState extends TableState<Coupon> { }

const initialState: CouponsState = createInitialTableState<Coupon>('usage_count');

// ============================================================================
// THUNKS
// ============================================================================

import { createClient } from "@/lib/supabase/client";

export const fetchCoupons = createAsyncThunk(
    'admin/coupons/fetchCoupons',
    async (_, { rejectWithValue }) => {
        try {
            const supabase = createClient();

            // Allow time for loading state to be visible (optional)
            // await new Promise(resolve => setTimeout(resolve, 500));

            const { data, error } = await supabase
                .from('coupon_codes')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            return data as Coupon[];
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch coupons');
        }
    }
);

// ============================================================================
// SLICE
// ============================================================================

const couponsSlice = createSlice({
    name: 'coupons',
    initialState,
    reducers: {
        setFilters(state, action: PayloadAction<Partial<CouponsState['filters']>>) {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters(state) {
            state.filters = { search: '', status: 'all', dateRange: null };
            state.pagination.page = 1;
        },
        setSort(state, action: PayloadAction<CouponsState['sort']>) {
            state.sort = action.payload;
        },
        setPage(state, action: PayloadAction<number>) {
            state.pagination.page = action.payload;
        },
        setPageSize(state, action: PayloadAction<number>) {
            state.pagination.pageSize = action.payload;
            state.pagination.page = 1; // Reset to page 1 on size change
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCoupons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCoupons.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.initialized = true;
                state.pagination.total = action.payload.length; // Client-side total
            })
            .addCase(fetchCoupons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.initialized = true;
            });
    }
});

export const { setFilters, resetFilters, setSort, setPage, setPageSize } = couponsSlice.actions;
export default couponsSlice.reducer;
