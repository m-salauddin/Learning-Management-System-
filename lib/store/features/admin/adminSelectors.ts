import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store/store";
import { createTableSelectors } from "@/lib/store/utils/tableState";

// ============================================================================
// COUPONS SELECTORS (Standard Pattern)
// ============================================================================

const selectCouponsRoot = (state: RootState) => state.coupons;

// Create standard selectors
export const couponsSelectors = createTableSelectors(
    selectCouponsRoot,
    false, // Client-side filtering
    ['code', 'description'] // Search fields
);

// ============================================================================
// USERS SELECTORS (Custom Mapping for Existing Slice)
// ============================================================================

const selectAdmin = (state: RootState) => state.admin;

// Map Admin Slice "Users" state to TableState shape CONCEPTUALLY
// We implement individual selectors to match the pattern

const selectUsersData = (state: RootState) => state.admin.users;
const selectUsersLoading = (state: RootState) => state.admin.loading.users;
const selectUsersTotal = (state: RootState) => state.admin.totalUsers;

// Has Data: Since fetching is server-side, "No Data" means Total DB Count is 0.
// adminSlice stores specific `totalUsers` from the API response.
// If API returns total=0, then we have NO users.
const selectUsersHasData = createSelector(
    [selectUsersTotal, selectUsersLoading],
    (total, loading) => {
        // If loading, assume we might have data. 
        // If loaded and total is 0, then we have no data.
        // Wait, if we have a filter applied (e.g. search "xyz"), totalUsers might be 0 (results).
        // Does the API return "total matching filter" or "total in DB"?
        // Usually 'count' in Supabase query returns count matching query.
        // So for "No Data Yet" vs "No Results", we technically need "Unfiltered Total".
        // Current adminSlice doesn't seem to store "Unfiltered Total".
        // HOWEVER, the user requirement says: "If the dataset length is 0...". 
        // For Server-side, dataset length usually means 'count'.
        // If we can't distinguish, we might default to "No Results" except on very first load?
        // Actually, for Server-side, the "Client must skip passing filter params when items length is 0".
        // I will assume for now that if totalUsers is 0 AND no filters are active, it's EMPTY_DATA.
        // If filters are active, it's EMPTY_FILTER_RESULTS.
        return total > 0;
    }
);

// We need to know if filters are active
const selectUsersFiltersActive = createSelector(
    [selectAdmin],
    (admin) => {
        const f = admin.usersFilters;
        // Check if any filter is set
        return !!(f.search || (f.role && f.role !== 'all'));
    }
);

/*
 * Implementation Detail:
 * For Server-side tables like Users, 'selectDisplayedRows' is just the current 'users' array
 * because backend does the filtering.
 * BUT 'EmptyStateType' logic depends on whether we have ANY data vs Filtered data.
 */

const selectUsersEmptyStateType = createSelector(
    [selectUsersLoading, selectUsersTotal, selectUsersFiltersActive, selectUsersData],
    (loading, total, filtersActive, data) => {
        if (loading && data.length === 0) return 'LOADING';

        if (total === 0) {
            // If total is 0, checking if it's due to filters
            if (filtersActive) return 'EMPTY_FILTER_RESULTS';
            return 'EMPTY_DATA';
        }

        return 'HAS_ROWS';
    }
);

export const usersTableSelectors = {
    selectItems: selectUsersData,
    selectLoading: selectUsersLoading,
    selectTotal: selectUsersTotal,
    selectFilters: (state: RootState) => state.admin.usersFilters,
    selectHasData: selectUsersHasData, // This is approximations for server side
    selectEmptyStateType: selectUsersEmptyStateType,
    selectDisplayedRows: selectUsersData // Server-side already filtered
};
