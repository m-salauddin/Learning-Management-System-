import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import coursesReducer from './features/courses/coursesSlice';
import enrollmentsReducer from './features/enrollments/enrollmentsSlice';
import adminReducer from './features/admin/adminSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        courses: coursesReducer,
        enrollments: enrollmentsReducer,
        admin: adminReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
