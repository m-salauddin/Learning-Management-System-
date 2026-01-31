// ============================================================================
// SERVER ACTIONS INDEX
// ============================================================================
// Centralized exports for all server actions
// ============================================================================

// Course Actions
export {
    getCourses,
    getCourseBySlug,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    publishCourse,
    unpublishCourse,
    getInstructorCourses,
    getCategories
} from './courses';

// Module & Lesson Actions
export {
    createModule,
    updateModule,
    deleteModule,
    reorderModules,
    createLesson,
    updateLesson,
    deleteLesson,
    reorderLessons,
    getLessonWithAsset,
    updateLessonAsset,
    getSignedVideoUrl
} from './lessons';

// Enrollment Actions
export {
    getMyEnrollments,
    getEnrollment,
    checkEnrollment,
    updateLessonProgress,
    markLessonComplete,
    getResumeLesson,
    getCourseProgress,
    getAllEnrollments
} from './enrollments';

// Payment Actions
export {
    validateCoupon,
    createTransaction,
    confirmPayment,
    getMyTransactions,
    getAllTransactions,
    createCoupon,
    updateCoupon,
    getCoupons
} from './payments';

// Admin Actions
export {
    getAdminDashboardStats,
    getRevenueMetrics,
    getDailyActiveUsers,
    getPopularCourses,
    getAllUsers,
    updateUserRole,
    suspendUser,
    getAuditLog,
    createAuditLog,
    approveCourse,
    rejectCourse,
    getPlatformMetrics,
    getEnrollmentTrends
} from './admin';

// Certificate Actions
export {
    getMyCertificates,
    getCertificate,
    verifyCertificate,
    getCertificateByEnrollment,
    issueCertificate,
    getCertificatesForCourse,
    getCertificateDownloadUrl
} from './certificates';

// Dashboard Actions
export {
    getInstructorDashboardStats,
    getInstructorRevenue,
    getCourseStudents,
    getCourseReviews,
    submitCourseReview,
    getStudentDashboardStats
} from './dashboard';

// Types re-export for convenience
export type {
    InstructorDashboardStats,
    StudentDashboardStats
} from './dashboard';
