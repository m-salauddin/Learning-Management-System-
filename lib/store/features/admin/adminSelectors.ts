import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store/store";
import { createTableSelectors } from "@/lib/store/utils/tableState";
const selectCouponsRoot = (state: RootState) => state.coupons;
export const couponsSelectors = createTableSelectors(
    selectCouponsRoot,
    false,
    ['code', 'description']
);
const selectAdmin = (state: RootState) => state.admin;
const selectUsersData = (state: RootState) => state.admin.users;
const selectUsersLoading = (state: RootState) => state.admin.loading.users;
const selectUsersTotal = (state: RootState) => state.admin.totalUsers;
const selectUsersHasData = createSelector(
    [selectUsersTotal, selectUsersLoading],
    (total, loading) => {
        return total > 0;
    }
);
const selectUsersFiltersActive = createSelector(
    [selectAdmin],
    (admin) => {
        const f = admin.usersFilters;
        return !!(f.search || (f.role && f.role !== 'all'));
    }
);
const selectUsersEmptyStateType = createSelector(
    [selectUsersLoading, selectUsersTotal, selectUsersFiltersActive, selectUsersData],
    (loading, total, filtersActive, data) => {
        if (loading && data.length === 0) return 'LOADING';
        if (total === 0) {
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
    selectHasData: selectUsersHasData,
    selectEmptyStateType: selectUsersEmptyStateType,
    selectDisplayedRows: selectUsersData
};
