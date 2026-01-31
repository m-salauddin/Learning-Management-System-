# Dashboard UI → Backend Wiring Matrix

## Overview

This document maps every dashboard UI component to its corresponding backend functionality, data source, and Redux state management.

---

## 🎓 Student Dashboard (`StudentPanel.tsx`)

| UI Component | Data Source | Server Action | Redux Slice | State Key | Fetch Location |
|-------------|-------------|---------------|-------------|-----------|----------------|
| **Enrolled Courses Grid** | `enrollments` + `courses` | `getMyEnrollments()` | `enrollments` | `enrollments` | Server (RSC) |
| **Continue Learning Card** | `lesson_progress` | `getResumeLesson()` | `enrollments` | `resumeLesson` | Client (useEffect) |
| **Progress Bar** | `enrollments.progress_percent` | `getCourseProgress()` | `enrollments` | `courseProgress` | Server (RSC) |
| **Completed Courses Count** | `enrollments` | `getMyEnrollments({ status: 'completed' })` | `enrollments` | `enrollments.filter(e => e.completed)` | Server (RSC) |
| **Certificates List** | `certificates` | `getMyCertificates()` | - | Direct fetch | Server (RSC) |
| **Recent Activity** | `lesson_progress` | `getCourseProgress()` | `enrollments` | `lessonProgress` | Client (useEffect) |

### Student Dashboard Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                     StudentPanel.tsx (RSC)                        │
├──────────────────────────────────────────────────────────────────┤
│  1. Server fetches: getMyEnrollments()                           │
│  2. Server fetches: getMyCertificates()                          │
│  3. Passes data as props to client components                    │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│              CourseProgressCard.tsx (Client)                      │
├──────────────────────────────────────────────────────────────────┤
│  1. Receives enrollment data from parent                         │
│  2. Uses enrollmentsSlice for real-time progress updates         │
│  3. Dispatches: fetchResumeLesson() on mount                     │
└──────────────────────────────────────────────────────────────────┘
```

---

## 👨‍🏫 Teacher Dashboard (`TeacherPanel.tsx`)

| UI Component | Data Source | Server Action | Redux Slice | State Key | Fetch Location |
|-------------|-------------|---------------|-------------|-----------|----------------|
| **My Courses List** | `courses` | `getInstructorCourses()` | `courses` | `instructorCourses` | Server (RSC) |
| **Course Enrollments** | `enrollments` | `getAllEnrollments({ courseId })` | - | Direct fetch | Server (RSC) |
| **Revenue Stats** | `transactions` | `getInstructorDashboardStats()` (RPC) | - | Direct fetch | Server (RSC) |
| **Student Progress** | `lesson_progress` | `getCourseProgress()` | - | Direct fetch | Client |
| **Course Status Badge** | `courses.status` | - | `courses` | `instructorCourses[n].status` | Redux |
| **Ratings Display** | `course_reviews` | `getCourseBySlug()` | `courses` | `currentCourse.rating_avg` | Server |
| **Create Course Button** | - | `createCourse()` | `courses` | Dispatch action | Client |
| **Edit Course Modal** | `courses` | `updateCourse()` | `courses` | Dispatch action | Client |

### Teacher Dashboard Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                     TeacherPanel.tsx (RSC)                        │
├──────────────────────────────────────────────────────────────────┤
│  1. Server: getInstructorCourses()                               │
│  2. Server: RPC get_instructor_dashboard_stats()                 │
│  3. Props passed to client components                            │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│              CourseManagement.tsx (Client)                        │
├──────────────────────────────────────────────────────────────────┤
│  1. Uses coursesSlice for CRUD operations                        │
│  2. Dispatches: createCourse(), updateCourse(), deleteCourse()   │
│  3. Dispatches: publishCourse(), unpublishCourse()               │
└──────────────────────────────────────────────────────────────────┘
```

---

## 👮 Moderator Dashboard (`ModeratorPanel.tsx`)

| UI Component | Data Source | Server Action | Redux Slice | State Key | Fetch Location |
|-------------|-------------|---------------|-------------|-----------|----------------|
| **Pending Courses Queue** | `courses` (status='pending_review') | `getCourses({ status: 'pending_review' })` | `courses` | `courses` | Server (RSC) |
| **Approve/Reject Buttons** | - | `approveCourse()`, `rejectCourse()` | `admin` | Dispatch action | Client |
| **Flagged Reviews** | `course_reviews` | Custom query | - | Direct fetch | Server |
| **User Reports** | Custom table | Custom action | - | Direct fetch | Server |

---

## 👑 Admin Dashboard (`AdminPanel.tsx`)

| UI Component | Data Source | Server Action | Redux Slice | State Key | Fetch Location |
|-------------|-------------|---------------|-------------|-----------|----------------|
| **Total Users Stat** | `users` count | `getPlatformMetrics()` | `admin` | `platformMetrics.totalUsers` | Server (RSC) |
| **Active Users Stat** | `user_activity` | `getDailyActiveUsers()` | `admin` | `dailyActiveUsers` | Server (RSC) |
| **Total Revenue Stat** | `transactions` | `getRevenueMetrics()` | `admin` | `revenueMetrics.total` | Server (RSC) |
| **Total Courses Stat** | `courses` count | `getPlatformMetrics()` | `admin` | `platformMetrics.totalCourses` | Server (RSC) |
| **Revenue Chart** | `transactions` | `getRevenueMetrics()` | `admin` | `revenueMetrics.byPeriod` | Client |
| **Enrollment Trend Chart** | `enrollments` | `getEnrollmentTrends()` | `admin` | `enrollmentTrends` | Client |
| **User Distribution Chart** | `users` by role | `getAllUsers()` | `admin` | Computed from `users` | Client |
| **Popular Courses Table** | `courses` + `enrollments` | `getPopularCourses()` | `admin` | `popularCourses` | Server |
| **Users Table** | `users` | `getAllUsers()` | `admin` | `users` | Server + Client pagination |
| **Audit Log Table** | `audit_log` | `getAuditLog()` | `admin` | `auditLog` | Server |
| **User Role Dropdown** | - | `updateUserRole()` | `admin` | Dispatch action | Client |

### Admin Dashboard Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                      AdminPanel.tsx (RSC)                         │
├──────────────────────────────────────────────────────────────────┤
│  1. Server: getAdminDashboardStats() - RPC function              │
│  2. Server: getPlatformMetrics()                                 │
│  3. Server: getPopularCourses()                                  │
│  4. Props passed to chart/table components                       │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│               RevenueChart.tsx (Client)                           │
├──────────────────────────────────────────────────────────────────┤
│  1. Uses adminSlice for date range filtering                     │
│  2. Dispatches: fetchRevenueMetrics({ startDate, endDate })      │
│  3. Renders chart from admin.revenueMetrics                      │
└──────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│               UsersTable.tsx (Client)                             │
├──────────────────────────────────────────────────────────────────┤
│  1. Uses adminSlice for pagination & filtering                   │
│  2. Dispatches: fetchUsers({ page, role, search })               │
│  3. Dispatches: updateUserRole({ userId, newRole })              │
│  4. Renders from admin.users                                     │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📊 Chart Components Mapping

| Chart Component | Server Action | Redux Slice | State Key | Update Frequency |
|----------------|---------------|-------------|-----------|------------------|
| `RevenueChart.tsx` | `getRevenueMetrics()` | `admin` | `revenueMetrics` | On date range change |
| `EnrollmentTrendChart.tsx` | `getEnrollmentTrends()` | `admin` | `enrollmentTrends` | On mount + interval |
| `UserDistributionChart.tsx` | `getAllUsers()` | `admin` | Computed | On mount |
| `CoursePerformanceChart.tsx` | `getPopularCourses()` | `admin` | `popularCourses` | On mount |
| `ActivityHeatmap.tsx` | `user_activity` query | - | Direct fetch | On mount |
| `PlatformHealthChart.tsx` | `getPlatformMetrics()` | `admin` | `platformMetrics` | On mount |
| `RevenueBreakdownChart.tsx` | `getRevenueMetrics()` | `admin` | `revenueMetrics.byCourse` | On mount |

---

## 🔐 RLS Policy Matrix

| Table | Student | Teacher | Moderator | Admin |
|-------|---------|---------|-----------|-------|
| `courses` (published) | ✅ Read | ✅ Read | ✅ Read | ✅ All |
| `courses` (draft) | ❌ | ✅ Own only | ❌ | ✅ All |
| `courses` (pending_review) | ❌ | ✅ Own only | ✅ Read | ✅ All |
| `modules` | ✅ Published courses | ✅ Own courses | ✅ Read | ✅ All |
| `lessons` | ✅ Published courses | ✅ Own courses | ✅ Read | ✅ All |
| `lesson_assets` | ✅ If enrolled/preview | ✅ Own courses | ❌ | ✅ All |
| `enrollments` (own) | ✅ Own only | ✅ Own courses | ❌ | ✅ All |
| `lesson_progress` | ✅ Own only | ✅ Own courses | ❌ | ✅ All |
| `transactions` | ✅ Own only | ✅ Own courses | ❌ | ✅ All |
| `certificates` | ✅ Own only | ✅ Own courses | ❌ | ✅ All |
| `coupons` | ❌ | ❌ | ❌ | ✅ All |
| `audit_log` | ❌ | ❌ | ❌ | ✅ All |
| `users` | ✅ Own profile | ✅ Own profile | ✅ Read | ✅ All |

---

## 🚀 Video Access Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Video Player Component                           │
├─────────────────────────────────────────────────────────────────────┤
│  1. Component mounts with lessonId                                   │
│  2. Calls: getSignedVideoUrl(lessonId)                              │
│  3. Server validates: enrollment OR free_preview OR instructor       │
│  4. If valid: Supabase generates signed URL (1 hour expiry)         │
│  5. Video player receives signed URL                                 │
│  6. On progress: updateLessonProgress() every 10 seconds            │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                     Supabase Storage (Private)                       │
├─────────────────────────────────────────────────────────────────────┤
│  Bucket: course_videos (PRIVATE)                                    │
│  Path: {course_id}/{lesson_id}/video.mp4                            │
│  Access: Signed URLs only (generated server-side)                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure Summary

```
lib/
├── actions/
│   ├── courses.ts          # Course CRUD, publish, categories
│   ├── lessons.ts          # Module/Lesson CRUD, reorder, assets
│   ├── enrollments.ts      # Enrollment, progress tracking
│   ├── payments.ts         # Transactions, coupons, validation
│   ├── admin.ts            # Admin stats, user mgmt, audit log
│   └── certificates.ts     # Certificate generation, verification
├── store/
│   ├── store.ts            # Redux store configuration
│   ├── hooks.ts            # Typed useAppDispatch, useAppSelector
│   └── features/
│       ├── auth/
│       │   └── authSlice.ts
│       ├── courses/
│       │   └── coursesSlice.ts
│       ├── enrollments/
│       │   └── enrollmentsSlice.ts
│       └── admin/
│           └── adminSlice.ts
└── supabase/
    ├── client.ts           # Browser Supabase client
    └── server.ts           # Server Supabase client

supabase/
├── schema.sql              # Existing auth schema
└── migrations/
    └── 001_lms_complete_schema.sql  # Full LMS schema

types/
├── supabase.ts             # Generated Supabase types
├── lms.ts                  # LMS-specific types
└── dashboard.ts            # Dashboard-specific types
```

---

## 🔄 State Synchronization Pattern

### Pattern 1: Server-First Fetch (RSC)
```typescript
// page.tsx (Server Component)
export default async function DashboardPage() {
    const enrollments = await getMyEnrollments();
    const certificates = await getMyCertificates();
    
    return (
        <StudentPanel 
            initialEnrollments={enrollments}
            initialCertificates={certificates}
        />
    );
}
```

### Pattern 2: Client-Side Redux Hydration
```typescript
// StudentPanel.tsx (Client Component)
'use client';

export function StudentPanel({ initialEnrollments }) {
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        // Hydrate Redux with server data
        dispatch(hydrateEnrollments(initialEnrollments));
    }, []);
    
    // Real-time updates via Redux
    const enrollments = useAppSelector(state => state.enrollments.enrollments);
}
```

### Pattern 3: Optimistic Updates
```typescript
// Progress update with optimistic UI
const handleProgress = (seconds: number) => {
    // Immediate UI update
    dispatch(updateLocalProgress({ lessonId, watchedSeconds: seconds }));
    
    // Debounced server sync
    debouncedUpdate(seconds);
};
```

---

## ⚡ Performance Considerations

1. **Server-Side Fetching**: All initial data fetched on server for fast LCP
2. **Redux Caching**: Avoid re-fetching already loaded data
3. **Debounced Progress**: Video progress synced every 10 seconds, not per-frame
4. **Pagination**: All lists paginated (10-20 items per page)
5. **Signed URL Caching**: 1-hour expiry, refresh only when expired
6. **Selective Hydration**: Only hydrate Redux state that needs real-time updates
