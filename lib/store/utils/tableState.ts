import { createSelector } from "@reduxjs/toolkit";

// ============================================================================
// TYPES
// ============================================================================

export type SortOrder = 'asc' | 'desc';

export interface TableState<T> {
    items: T[];           // Raw data from backend
    filters: {
        search?: string;
        status?: string;
        dateRange?: { from: string; to: string } | null;
        [key: string]: any; // Allow custom filters
    };
    sort: {
        field: keyof T | string;
        order: SortOrder;
    };
    pagination: {
        page: number;
        pageSize: number;
        total: number; // For server-side, this matches API total. For client-side, derived.
    };
    loading: boolean;
    error: string | null;
    initialized: boolean; // To track if we've fetched at least once
}

export type EmptyStateType = 'LOADING' | 'EMPTY_DATA' | 'EMPTY_FILTER_RESULTS' | 'HAS_ROWS';

// ============================================================================
// INITIAL STATE FACTORY
// ============================================================================

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

// ============================================================================
// CLIENT-SIDE FILTERING UTILS
// ============================================================================

// Helper to filter/sort/paginate client-side
export function processTableData<T>(
    items: T[],
    filters: TableState<T>['filters'],
    sort: TableState<T>['sort'],
    pagination: TableState<T>['pagination'],
    searchFields: (keyof T)[] = ['name', 'title', 'email'] as any
): { rows: T[], totalFiltered: number } {

    // 1. Filter
    let filtered = items.filter(item => {
        // Search
        if (filters.search) {
            const query = filters.search.toLowerCase();
            const matchesSearch = searchFields.some(field => {
                const val = item[field];
                return String(val || '').toLowerCase().includes(query);
            });
            if (!matchesSearch) return false;
        }

        // Status
        if (filters.status && filters.status !== 'all') {
            // @ts-ignore - assuming item has status if filter is set
            if (item['status'] !== filters.status) return false;
        }

        // Date Range (assuming 'created_at' exists)
        if (filters.dateRange?.from && filters.dateRange?.to) {
            // @ts-ignore
            const date = new Date(item['created_at']);
            const from = new Date(filters.dateRange.from);
            const to = new Date(filters.dateRange.to);
            if (date < from || date > to) return false;
        }

        return true;
    });

    const totalFiltered = filtered.length;

    // 2. Sort
    if (sort.field) {
        filtered.sort((a, b) => {
            // @ts-ignore
            const valA = a[sort.field];
            // @ts-ignore
            const valB = b[sort.field];

            if (valA < valB) return sort.order === 'asc' ? -1 : 1;
            if (valA > valB) return sort.order === 'asc' ? 1 : -1;
            return 0;
        });
    }

    // 3. Paginate
    const { page, pageSize } = pagination;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const rows = filtered.slice(startIndex, endIndex);

    return { rows, totalFiltered };
}


// ============================================================================
// SELECTOR FACTORY
// ============================================================================

export function createTableSelectors<T>(
    selectState: (rootState: any) => TableState<T>,
    // Optional: Is this server-side filtered?
    isServerSide: boolean = false,
    // Optional: Fields to search on for Client-side
    searchFields: (keyof T)[] = []
) {
    const selectItems = (state: any) => selectState(state).items;
    const selectFilters = (state: any) => selectState(state).filters;
    const selectSort = (state: any) => selectState(state).sort;
    const selectPagination = (state: any) => selectState(state).pagination;
    const selectLoading = (state: any) => selectState(state).loading;
    const selectInitialized = (state: any) => selectState(state).initialized;
    const selectError = (state: any) => selectState(state).error;

    // Has Data: Checks if we have ANY data (raw)
    // For Server-side: this might check 'total' from API if items only has current page
    // But per requirement, we should rely on "dataset length". 
    // If Server-side, 'items' is current page. If page is empty and total is 0, then effectively no data.
    // However, usually for SS, we want to know if there is *any* data in DB.
    // The state.pagination.total should reflect TOTAL Items in DB if SS.
    const selectHasData = createSelector(
        [selectItems, selectPagination],
        (items, pagination) => {
            if (isServerSide) return pagination.total > 0;
            return items.length > 0;
        }
    );

    // Derived Rows (Display)
    const selectDisplayedRows = createSelector(
        [selectItems, selectFilters, selectSort, selectPagination, selectHasData],
        (items, filters, sort, pagination, hasData) => {
            // Requirement: "if items.length === 0 return [] immediately (NO filter/sort/paginate)"
            // But we actually reference 'hasData'.

            if (!hasData) return [];

            if (isServerSide) {
                // If server-side, 'items' IS the displayed rows (backend handled filtering)
                // We just return them. Sorting/Pagination/Filtering happened on server.
                return items;
            } else {
                // Client-side processing
                const { rows } = processTableData(items, filters, sort, pagination, searchFields);
                return rows;
            }
        }
    );

    // Filtered Count (for pagination calculation if client-side)
    const selectFilteredCount = createSelector(
        [selectItems, selectFilters, selectSort, selectPagination, selectHasData],
        (items, filters, sort, pagination, hasData) => {
            if (!hasData) return 0;
            if (isServerSide) return pagination.total; // From backend response

            // Client-side: Recalculate
            const { totalFiltered } = processTableData(items, filters, sort, pagination, searchFields);
            return totalFiltered;
        }
    );

    // Empty State Type
    const selectEmptyStateType = createSelector(
        [selectLoading, selectHasData, selectDisplayedRows, selectInitialized],
        (loading, hasData, displayedRows, initialized) => {
            if (loading && !initialized) return 'LOADING'; // Initial Load
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
