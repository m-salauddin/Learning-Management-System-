import { createSelector } from "@reduxjs/toolkit";
export type SortOrder = 'asc' | 'desc';
export interface TableState<T> {
    items: T[];
    filters: {
        search?: string;
        status?: string;
        dateRange?: { from: string; to: string } | null;
        [key: string]: any;
    };
    sort: {
        field: keyof T | string;
        order: SortOrder;
    };
    pagination: {
        page: number;
        pageSize: number;
        total: number;
    };
    loading: boolean;
    error: string | null;
    initialized: boolean;
}
export type EmptyStateType = 'LOADING' | 'EMPTY_DATA' | 'EMPTY_FILTER_RESULTS' | 'HAS_ROWS';
export function createInitialTableState<T>(defaultSortField: keyof T | string = 'created_at'): TableState<T> {
    return {
        items: [],
        filters: {
            search: '',
            status: 'all',
            dateRange: null
        },
        sort: {
            field: defaultSortField,
            order: 'desc'
        },
        pagination: {
            page: 1,
            pageSize: 10,
            total: 0
        },
        loading: false,
        error: null,
        initialized: false
    };
}
export function processTableData<T>(
    items: T[],
    filters: TableState<T>['filters'],
    sort: TableState<T>['sort'],
    pagination: TableState<T>['pagination'],
    searchFields: (keyof T)[] = ['name', 'title', 'email'] as any
): { rows: T[], totalFiltered: number } {
    let filtered = items.filter(item => {
        if (filters.search) {
            const query = filters.search.toLowerCase();
            const matchesSearch = searchFields.some(field => {
                const val = item[field];
                return String(val || '').toLowerCase().includes(query);
            });
            if (!matchesSearch) return false;
        }
        if (filters.status && filters.status !== 'all') {
            if ((item as Record<string, unknown>)['status'] !== filters.status) return false;
        }
        if (filters.dateRange?.from && filters.dateRange?.to) {
            const date = new Date((item as Record<string, unknown>)['created_at'] as string);
            const from = new Date(filters.dateRange.from);
            const to = new Date(filters.dateRange.to);
            if (date < from || date > to) return false;
        }
        return true;
    });
    const totalFiltered = filtered.length;
    if (sort.field) {
        filtered.sort((a, b) => {
            
            const valA = (a as Record<string, any>)[sort.field as string];
            
            const valB = (b as Record<string, any>)[sort.field as string];
            if (valA < valB) return sort.order === 'asc' ? -1 : 1;
            if (valA > valB) return sort.order === 'asc' ? 1 : -1;
            return 0;
        });
    }
    const { page, pageSize } = pagination;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const rows = filtered.slice(startIndex, endIndex);
    return { rows, totalFiltered };
}
export function createTableSelectors<T>(
    selectState: (rootState: any) => TableState<T>,
    isServerSide: boolean = false,
    searchFields: (keyof T)[] = []
) {
    const selectItems = (state: any) => selectState(state).items;
    const selectFilters = (state: any) => selectState(state).filters;
    const selectSort = (state: any) => selectState(state).sort;
    const selectPagination = (state: any) => selectState(state).pagination;
    const selectLoading = (state: any) => selectState(state).loading;
    const selectInitialized = (state: any) => selectState(state).initialized;
    const selectError = (state: any) => selectState(state).error;
    const selectHasData = createSelector(
        [selectItems, selectPagination],
        (items, pagination) => {
            if (isServerSide) return pagination.total > 0;
            return items.length > 0;
        }
    );
    const selectDisplayedRows = createSelector(
        [selectItems, selectFilters, selectSort, selectPagination, selectHasData],
        (items, filters, sort, pagination, hasData) => {
            if (!hasData) return [];
            if (isServerSide) {
                return items;
            } else {
                const { rows } = processTableData(items, filters, sort, pagination, searchFields);
                return rows;
            }
        }
    );
    const selectFilteredCount = createSelector(
        [selectItems, selectFilters, selectSort, selectPagination, selectHasData],
        (items, filters, sort, pagination, hasData) => {
            if (!hasData) return 0;
            if (isServerSide) return pagination.total;
            const { totalFiltered } = processTableData(items, filters, sort, pagination, searchFields);
            return totalFiltered;
        }
    );
    const selectEmptyStateType = createSelector(
        [selectLoading, selectHasData, selectDisplayedRows, selectInitialized],
        (loading, hasData, displayedRows, initialized) => {
            if (loading && !initialized) return 'LOADING';
            if (!hasData) return 'EMPTY_DATA';
            if (displayedRows.length === 0) return 'EMPTY_FILTER_RESULTS';
            return 'HAS_ROWS';
        }
    );
    return {
        selectItems,
        selectFilters,
        selectSort,
        selectPagination,
        selectLoading,
        selectError,
        selectHasData,
        selectDisplayedRows,
        selectFilteredCount,
        selectEmptyStateType
    };
}
