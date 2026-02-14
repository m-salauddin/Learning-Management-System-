import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Category, ApiResponse } from "@/types/lms";
import * as categoryActions from "@/lib/actions/categories";

interface CategoriesState {
    categories: Category[];
    isLoading: boolean;
    error: string | null;
}

const initialState: CategoriesState = {
    categories: [],
    isLoading: false,
    error: null,
};

export const fetchAdminCategories = createAsyncThunk(
    "adminCategories/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const result = await categoryActions.getCategoriesAdmin();
            if (!result.success) return rejectWithValue(result.error);
            return result.data;
        } catch (error) {
            return rejectWithValue("Failed to fetch categories");
        }
    }
);

export const reorderCategories = createAsyncThunk(
    "adminCategories/reorder",
    async (newOrder: Category[], { dispatch, rejectWithValue }) => {
        try {
            // Recalculate serial numbers for the new order
            const updatedCategories = newOrder.map((cat, index) => ({
                ...cat,
                serial_number: index + 1
            }));

            // First update local state for immediate feedback with CORRECT serials
            dispatch(setCategoriesLocally(updatedCategories));

            // Prepare updates for backend
            const updates = updatedCategories.map((cat) => ({
                id: cat.id,
                serial_number: cat.serial_number
            }));

            const result = await categoryActions.updateCategoryOrder(updates);
            if (!result.success) return rejectWithValue(result.error);
            return result;
        } catch (error) {
            return rejectWithValue("Failed to sync order");
        }
    }
);

const categoriesSlice = createSlice({
    name: "adminCategories",
    initialState,
    reducers: {
        setCategoriesLocally(state, action: PayloadAction<Category[]>) {
            state.categories = action.payload;
        },
        updateCategoryOrderLocally(state, action: PayloadAction<{ id: string, serial_number: number }[]>) {
            // This could be used for more granular updates if needed
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminCategories.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAdminCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = action.payload || [];
            })
            .addCase(fetchAdminCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(reorderCategories.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { setCategoriesLocally } = categoriesSlice.actions;
export default categoriesSlice.reducer;
