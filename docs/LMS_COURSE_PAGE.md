# LMS Course Page - Implementation Documentation

## Table of Contents
1. [Database Schema & Relationships](#database-schema--relationships)
2. [Security & RLS Policies](#security--rls-policies)
3. [Next.js Folder Structure](#nextjs-folder-structure)
4. [API Routes](#api-routes)
5. [Redux Slices & Thunks](#redux-slices--thunks)
6. [UI Wiring Checklist](#ui-wiring-checklist)

---

## Database Schema & Relationships

### Entity Relationship Diagram (Conceptual)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             PUBLIC CATALOG                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐      ┌──────────────────┐      ┌─────────────────┐        │
│  │   users     │──────│ instructor_      │      │   categories    │        │
│  │             │      │ profiles         │      │                 │        │
│  └─────────────┘      └──────────────────┘      └─────────────────┘        │
│        │                      │                        │                    │
│        │                      │                        │                    │
│        ▼                      ▼                        ▼                    │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │                         courses                                  │       │
│  │  (id, title, slug, description, price, instructor_id, etc.)     │       │
│  └─────────────────────────────────────────────────────────────────┘       │
│        │                                                                    │
│        ├──────────────────────────┬─────────────────────────────────────┐  │
│        ▼                          ▼                                     ▼  │
│  ┌─────────────┐     ┌─────────────────┐     ┌──────────────────────┐     │
│  │   modules   │     │ course_details  │     │    course_projects   │     │
│  └─────────────┘     └─────────────────┘     └──────────────────────┘     │
│        │                                                                    │
│        ▼                                                                    │
│  ┌─────────────┐     ┌─────────────────┐     ┌──────────────────────┐     │
│  │   lessons   │     │   course_faq    │     │   course_resources   │     │
│  │ (metadata)  │     └─────────────────┘     └──────────────────────┘     │
│  └─────────────┘                                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            GATED CONTENT                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐        ┌──────────────────┐                          │
│  │  lesson_assets   │        │  enrollments     │                          │
│  │ (video_path,     │        │ (user_id,        │                          │
│  │  markdown,       │        │  course_id,      │                          │
│  │  attachments)    │        │  expires_at)     │                          │
│  └──────────────────┘        └──────────────────┘                          │
│                                      │                                       │
│                                      ▼                                       │
│  ┌──────────────────┐        ┌──────────────────┐                          │
│  │ course_reviews   │        │ lesson_progress  │                          │
│  │ (enrolled only)  │        └──────────────────┘                          │
│  └──────────────────┘                                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              COMMERCE                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐        ┌──────────────────┐                          │
│  │    coupons       │        │   transactions   │                          │
│  │ (discount coupons)│────────│ (purchase records)│                         │
│  └──────────────────┘        └──────────────────┘                          │
│                                      │                                       │
│                                      │ (trigger on success)                  │
│                                      ▼                                       │
│                              ┌──────────────────┐                           │
│                              │   enrollments    │                           │
│                              └──────────────────┘                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              LEADS                                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────┐                                                       │
│  │  course_leads    │  ← Anyone can INSERT, Admin can READ                 │
│  │ (contact form)   │                                                       │
│  └──────────────────┘                                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Table Definitions

#### A) Public Catalog / Marketing Tables

| Table | Purpose | Public Read? |
|-------|---------|--------------|
| `courses` | Core course info (title, slug, price, status) | ✅ when published |
| `course_details` | Extended marketing (long description, outcomes) | ✅ when course published |
| `modules` | Chapter/section metadata | ✅ when course published |
| `lessons` | Lesson metadata (title, duration, free preview flag) | ✅ when course published |
| `course_projects` | Portfolio/showcase projects | ✅ public ones when published |
| `course_faq` | FAQ accordion items | ✅ when course published |
| `course_reviews` | Student reviews | ✅ when course published (non-hidden) |

#### B) Gated Content Tables

| Table | Purpose | Access Control |
|-------|---------|----------------|
| `lesson_assets` | Video paths, markdown content | Enrolled + Free Preview + Instructor/Admin |
| `enrollments` | User-course relationship | Own rows only + Admin |
| `lesson_progress` | Watch position, completion | Own rows only |

#### C) Commerce Tables

| Table | Purpose | Access Control |
|-------|---------|----------------|
| `coupons` | Discount codes | Admin only |
| `transactions` | Payment records | Own rows + Admin |

#### D) Lead Capture

| Table | Purpose | Access Control |
|-------|---------|----------------|
| `course_leads` | Contact form submissions | Anyone INSERT, Admin READ |

---

## Security & RLS Policies

### Helper Functions

```sql
-- Check if current user is admin
public.is_admin() → BOOLEAN

-- Check if current user is instructor of a course
public.is_instructor_of_course(course_id UUID) → BOOLEAN

-- Check if current user is enrolled (not expired)
public.is_enrolled(course_id UUID) → BOOLEAN

-- Check if current user is teacher
public.is_teacher() → BOOLEAN

-- Check if user can access lesson content
public.can_access_lesson_asset(lesson_id UUID) → BOOLEAN
  -- TRUE if: free_preview OR enrolled OR instructor OR admin

-- Check if user has any course access
public.has_course_access(course_id UUID) → BOOLEAN
```

### RLS Policy Summary

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| **courses** | published OR instructor OR admin | instructor | instructor OR admin | admin |
| **course_details** | published OR instructor OR admin | instructor | instructor OR admin | instructor OR admin |
| **modules** | published OR instructor OR admin | instructor | instructor OR admin | instructor OR admin |
| **lessons** | published OR instructor OR admin | instructor | instructor OR admin | instructor OR admin |
| **lesson_assets** | can_access_lesson_asset() | instructor | instructor OR admin | instructor OR admin |
| **course_projects** | public OR enrolled | instructor | instructor OR admin | instructor OR admin |
| **course_resources** | public OR enrolled | instructor | instructor OR admin | instructor OR admin |
| **course_faq** | published | instructor | instructor OR admin | instructor OR admin |
| **course_reviews** | published + not hidden | enrolled only | own + admin | admin |
| **enrollments** | own OR admin | server only | server/admin | admin |
| **lesson_progress** | own | own | own | - |
| **transactions** | own OR admin | server only | server only | - |
| **coupons** | - | admin | admin | admin |
| **course_leads** | admin only | anyone | admin | admin |

### Video Security

1. Videos stored in **private bucket**: `course-videos`
2. **No direct public access** to bucket
3. Signed URLs generated **server-side only** via:
   - API Route: `GET /api/lessons/[lessonId]/video`
   - Server Action: `getSignedVideoUrl(lessonId)`
4. URL expiry: **5 minutes** (300 seconds)
5. Access check performed before signing

---

## Next.js Folder Structure

```
app/
├── (public)/
│   ├── courses/
│   │   ├── page.tsx                    # Course listing
│   │   └── [slug]/
│   │       ├── page.tsx                # Course detail (SSR)
│   │       └── components/
│   │           ├── CourseHero.tsx
│   │           ├── EnrollmentBox.tsx
│   │           ├── InstructorSection.tsx
│   │           ├── CurriculumAccordion.tsx
│   │           ├── ProjectsGrid.tsx
│   │           ├── ResourcesList.tsx
│   │           ├── ReviewsSection.tsx
│   │           ├── FAQAccordion.tsx
│   │           ├── ContactForm.tsx
│   │           └── RelatedCourses.tsx
│   └── layout.tsx
│
├── (protected)/
│   ├── dashboard/
│   │   ├── (student)/
│   │   │   ├── courses/
│   │   │   │   └── [courseId]/
│   │   │   │       └── lessons/
│   │   │   │           └── [lessonId]/
│   │   │   │               ├── page.tsx    # Lesson player
│   │   │   │               └── components/
│   │   │   │                   ├── VideoPlayer.tsx
│   │   │   │                   ├── LessonContent.tsx
│   │   │   │                   └── LessonNavigation.tsx
│   │   │   └── page.tsx
│   │   ├── (teacher)/
│   │   │   └── courses/
│   │   │       ├── page.tsx               # My courses
│   │   │       ├── new/
│   │   │       │   └── page.tsx
│   │   │       └── [courseId]/
│   │   │           ├── page.tsx           # Course editor
│   │   │           ├── curriculum/
│   │   │           ├── projects/
│   │   │           ├── resources/
│   │   │           └── faq/
│   │   └── (admin)/
│   │       ├── courses/
│   │       ├── users/
│   │       ├── transactions/
│   │       └── leads/
│   └── layout.tsx
│
├── api/
│   ├── lessons/
│   │   └── [lessonId]/
│   │       └── video/
│   │           └── route.ts           # Signed URL endpoint
│   ├── enroll/
│   │   └── route.ts                   # Enrollment endpoint
│   ├── courses/
│   │   └── route.ts
│   └── admin/
│       └── route.ts
│
└── layout.tsx

lib/
├── actions/
│   ├── course-page.ts                 # Course page server actions
│   ├── courses.ts
│   ├── enrollments.ts
│   ├── lessons.ts
│   └── payments.ts
│
├── store/
│   ├── store.ts
│   ├── hooks.ts
│   └── features/
│       ├── auth/
│       │   └── authSlice.ts
│       ├── courses/
│       │   └── coursesSlice.ts
│       ├── enrollments/
│       │   └── enrollmentsSlice.ts
│       ├── coursePage/
│       │   └── coursePageSlice.ts     # NEW
│       └── lessonPlayer/
│           └── lessonPlayerSlice.ts   # NEW
│
└── supabase/
    ├── client.ts
    ├── server.ts
    └── middleware.ts

types/
├── course-page.ts                     # NEW - Course page types
├── lms.ts
├── supabase.ts
└── user.ts
```

---

## API Routes

### GET /api/lessons/[lessonId]/video

**Purpose**: Generate signed URL for protected video content

**Authentication**: Required

**Access Control**:
- Free preview lesson → Allow
- Enrolled user → Allow
- Instructor of course → Allow
- Admin → Allow
- Otherwise → 403 Forbidden

**Response**:
```typescript
{
  url: string;          // Signed URL
  expires_at: string;   // ISO timestamp
}
```

### POST /api/enroll

**Purpose**: Enroll user in a course (free or after payment)

**Request**:
```typescript
{
  course_id: string;
  coupon_code?: string;
  payment_intent_id?: string;  // For paid courses
}
```

**Response**:
```typescript
{
  success: boolean;
  enrollment_id?: string;
  error?: string;
}
```

---

## Redux Slices & Thunks

### coursePageSlice

**State**:
```typescript
interface CoursePageState {
  pageData: CoursePageData | null;
  loading: { page, enroll, review, lead };
  errors: { page, enroll, review, lead };
  enrollment: EnrollmentBoxState;
  reviewForm: { rating, text, isSubmitting, submitted };
  contactForm: { isSubmitting, submitted };
  expandedModules: Record<string, boolean>;
}
```

**Thunks**:
- `fetchCoursePageData(slug)` - SSR prefetch or client fetch
- `validateCoupon({ courseId, couponCode })`
- `submitLead(input)`
- `submitReview(input)`

**Actions**:
- `toggleModule(moduleId)`
- `setCouponCode(code)`
- `clearCoupon()`
- `setReviewRating(rating)`
- `setReviewText(text)`
- `setEnrollmentStatus(isEnrolled)`

### lessonPlayerSlice

**State**:
```typescript
interface LessonPlayerSliceState {
  currentLessonId: string | null;
  courseId: string | null;
  lessonContent: { markdown, resources } | null;
  signedVideoUrl: string | null;
  videoExpiry: Date | null;
  progress: { watchedSeconds, totalSeconds, isCompleted };
  modules: Module[];  // For navigation
  videoState: { isPlaying, currentTime, duration, ... };
  loading, error, isDirty, lastSavedAt;
}
```

**Thunks**:
- `fetchLessonContent(lessonId)`
- `fetchSignedVideoUrl(lessonId)`
- `saveProgress({ lessonId, watchedSeconds, isCompleted })`
- `markComplete(lessonId)`

**Actions**:
- `setCurrentLesson(lessonId)`
- `setCourseContext({ courseId, modules })`
- `updateVideoState(partial)`
- `updateLocalProgress({ watchedSeconds })`
- `clearVideoUrl()` - For expiry handling

---

## UI Wiring Checklist

### Course Detail Page Sections

| UI Section | Tables Read | Tables Write | API/Thunk | Roles |
|------------|-------------|--------------|-----------|-------|
| **Hero/Intro** | `courses`, `course_details` | - | `fetchCoursePageData` | Public |
| **Pricing/Enroll Box** | `courses`, `enrollments` | `transactions`, `enrollments` | `validateCoupon`, `/api/enroll` | Public (view), Auth (action) |
| **Instructor** | `users`, `instructor_profiles` | - | `fetchCoursePageData` | Public |
| **Curriculum Accordion** | `modules`, `lessons` | - | `fetchCoursePageData` | Public (metadata only) |
| **Projects Grid** | `course_projects` | - | `fetchCoursePageData` | Public (is_public), Enrolled (all) |
| **Resources** | `course_resources` | - | `fetchCoursePageData` | Public (is_public), Enrolled (all) |
| **What You'll Learn** | `course_details.learning_outcomes` | - | `fetchCoursePageData` | Public |
| **Requirements** | `course_details.requirements` | - | `fetchCoursePageData` | Public |
| **Reviews** | `course_reviews`, `users` | `course_reviews` | `fetchCoursePageData`, `submitReview` | Public (read), Enrolled (write) |
| **FAQ** | `course_faq` | - | `fetchCoursePageData` | Public |
| **Related Courses** | `courses` | - | `fetchCoursePageData` | Public |
| **Contact Form** | - | `course_leads` | `submitLead` | Anyone |

### Lesson Player Page Sections

| UI Section | Tables Read | Tables Write | API/Thunk | Roles |
|------------|-------------|--------------|-----------|-------|
| **Video Player** | `lesson_assets` | `lesson_progress` | `/api/lessons/[id]/video`, `saveProgress` | Enrolled/Preview |
| **Lesson Content** | `lesson_assets` | - | `fetchLessonContent` | Enrolled/Preview |
| **Navigation Sidebar** | `modules`, `lessons`, `lesson_progress` | - | `setCourseContext` | Enrolled |
| **Progress Tracking** | `lesson_progress` | `lesson_progress` | `updateLessonProgress`, `markComplete` | Enrolled |

### Admin Dashboard Sections

| UI Section | Tables Read | Tables Write | API/Thunk | Roles |
|------------|-------------|--------------|-----------|-------|
| **Course Management** | `courses` | `courses` | Admin CRUD | Admin |
| **User Management** | `users` | `users` | Admin actions | Admin |
| **Transaction List** | `transactions` | - | Fetch all | Admin |
| **Lead Management** | `course_leads` | `course_leads` | Fetch/Update | Admin |
| **Coupon Management** | `coupons` | `coupons` | CRUD | Admin |

### Teacher Dashboard Sections

| UI Section | Tables Read | Tables Write | API/Thunk | Roles |
|------------|-------------|--------------|-----------|-------|
| **My Courses** | `courses` (own) | `courses` | `fetchInstructorCourses` | Teacher |
| **Course Editor** | `courses`, `course_details` | Multiple tables | `updateCourse` | Teacher (own) |
| **Curriculum Builder** | `modules`, `lessons`, `lesson_assets` | Same | Module/Lesson CRUD | Teacher (own) |
| **Analytics** | `enrollments`, `lesson_progress` | - | Stats queries | Teacher (own) |

---

## Data Flow Examples

### 1. Public User Views Course Page

```
Browser → SSR (app/courses/[slug]/page.tsx)
         ↓
         getCoursePageData(slug)
         ↓
    ┌────┴────┐
    │ Supabase│ (RLS: is_published = true)
    └────┬────┘
         ↓
    Return: course + details + modules + lessons (metadata) 
            + instructor + projects + resources + faq + reviews
         ↓
    Render server component with initial data
```

### 2. Enrolled User Watches Video

```
Browser → Click lesson → lessonPlayerSlice.setCurrentLesson(id)
         ↓
         fetchLessonContent(lessonId) → Server Action
         ↓
    ┌────┴────┐
    │ Supabase│ (RLS: can_access_lesson_asset)
    └────┬────┘
         ↓
    Return: markdown content, resources list
         ↓
         fetchSignedVideoUrl(lessonId) → API Route
         ↓
    ┌────┴────┐
    │ Supabase│ (RLS check + Storage signed URL)
    └────┬────┘
         ↓
    Return: { url: "https://...signed...", expires_at: "..." }
         ↓
    Video player loads URL
         ↓
    Every 30s: saveProgress({ lessonId, watchedSeconds })
```

### 3. User Applies Coupon and Enrolls

```
Browser → Enter coupon code → setCouponCode(code)
         ↓
         validateCoupon({ courseId, code }) → Server Action
         ↓
    ┌────┴────┐
    │ Supabase│ (check coupon validity)
    └────┬────┘
         ↓
    Return: { valid: true, discount_amount, final_price }
         ↓
    UI updates to show discount
         ↓
    Click "Enroll" → POST /api/enroll
         ↓
    Server creates transaction (or processes payment)
         ↓
    Transaction success trigger → Creates enrollment
         ↓
    Return: { success: true, enrollment_id }
         ↓
    setEnrollmentStatus(true)
         ↓
    UI shows "Already Enrolled" state
```

---

## Security Checklist

- [ ] **RLS enabled** on all public.* tables
- [ ] **is_published check** on all public course queries
- [ ] **Enrollment expiry check** in is_enrolled() function
- [ ] **Video bucket is PRIVATE** (course-videos)
- [ ] **Signed URLs expire in 5 minutes**
- [ ] **Server-only video signing** (never expose video paths to client)
- [ ] **Enrolled check** before allowing reviews
- [ ] **Lead form rate limiting** (optional, via Edge Function or middleware)
- [ ] **Admin role validation** in all admin routes
- [ ] **Teacher can only access own courses** (instructor_id = auth.uid())
