# Safe User Deletion and Role Change Handling

This document describes the implementation of safe user deletion and role change handling for the LMS where teachers can own courses.

## Overview

The system implements soft-delete for users, ensuring that:
1. Users are never hard-deleted from the database
2. Courses owned by instructors are never orphaned
3. Role changes validate course ownership before execution
4. All actions are logged to an audit trail

---

## Database Changes

### New Columns on `public.users`

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `is_deleted` | `boolean` | `false` | Soft-delete flag |
| `deleted_at` | `timestamptz` | `null` | Timestamp of deletion |
| `is_banned` | `boolean` | `false` | Ban status (set on deletion) |

### Helper Functions

| Function | Purpose |
|----------|---------|
| `is_active_user(p_user_id uuid)` | Check if user is not deleted/banned |
| `is_instructor_of_course(p_course_id uuid)` | Check if current user owns a course |
| `user_owns_courses(p_user_id uuid)` | Check if user owns any courses |
| `get_user_course_count(p_user_id uuid)` | Get count of courses owned by user |

### Admin RPC Functions

All RPC functions are SECURITY DEFINER and verify the caller is an admin.

| Function | Parameters | Returns |
|----------|------------|---------|
| `admin_soft_delete_user` | `p_user_id uuid` | `{ success, error?, message?, course_count? }` |
| `admin_reassign_instructor` | `p_from_user uuid, p_to_user uuid` | `{ success, error?, message?, reassigned_count? }` |
| `admin_assign_role` | `p_user_id uuid, p_new_role user_role, p_reassign_to uuid?` | `{ success, error?, message?, course_count?, requires_reassignment?, old_role?, new_role? }` |
| `admin_restore_user` | `p_user_id uuid` | `{ success, error?, message? }` |

---

## API Routes

### POST `/api/admin/users/delete`

Soft-deletes a user.

**Request Body:**
```json
{
  "userId": "uuid-string"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User user@example.com has been soft-deleted"
}
```

**Error Response (400) - User owns courses:**
```json
{
  "success": false,
  "error": "User owns 3 courses. Reassign courses before deletion using admin_reassign_instructor.",
  "course_count": 3
}
```

---

### POST `/api/admin/users/role`

Assigns a new role to a user with course ownership validation.

**Request Body:**
```json
{
  "userId": "uuid-string",
  "newRole": "student" | "teacher" | "moderator" | "admin",
  "reassignTo": "uuid-string"  // Optional: auto-reassign courses when demoting teacher
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Role updated from teacher to student for user user@example.com",
  "old_role": "teacher",
  "new_role": "student"
}
```

**Error Response (400) - Requires reassignment:**
```json
{
  "success": false,
  "error": "Reassign courses first. User owns 5 courses. Provide p_reassign_to parameter or call admin_reassign_instructor.",
  "course_count": 5,
  "requires_reassignment": true
}
```

---

### POST `/api/admin/courses/reassign-instructor`

Reassigns all courses from one instructor to another.

**Request Body:**
```json
{
  "fromUserId": "uuid-string",
  "toUserId": "uuid-string"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "3 courses reassigned from old@example.com to new@example.com",
  "reassigned_count": 3
}
```

---

### POST `/api/admin/users/restore`

Restores a soft-deleted user.

**Request Body:**
```json
{
  "userId": "uuid-string"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User user@example.com has been restored"
}
```

---

## RLS Policy Updates

### Access Control Logic

All write operations on course-related tables now enforce:
- Caller must be an **active user** (`is_deleted = false AND is_banned = false`)
- Caller must be either:
  - The **course instructor** (via `is_instructor_of_course()`)
  - An **admin** (via `is_admin()`)

### Affected Tables

| Table | Read Policy | Write Policy |
|-------|-------------|--------------|
| `courses` | Published courses public, own/admin all | Owner instructor or admin |
| `modules` | Via course visibility | Via course ownership |
| `lessons` | Via module → course visibility | Via course ownership |
| `lesson_assets` | Via lesson → course visibility | Via course ownership |
| `users` | Own profile (non-deleted) or admin | Own profile (active) or admin |

---

## Frontend Error Handling

### Role Change Blocked Due to Course Ownership

When attempting to demote a teacher who owns courses:

```typescript
const result = await assignUserRole(userId, 'student');

if (!result.success && result.requiresReassignment) {
  // Show dialog to select new instructor
  const teachers = await getTeachers();
  
  // Option 1: Let admin select a target instructor
  const targetTeacher = await showTeacherSelectionDialog(teachers);
  
  // Option 2: Retry with reassignment target
  const retryResult = await assignUserRole(userId, 'student', targetTeacher.id);
}
```

### Deletion Blocked Due to Course Ownership

```typescript
const result = await deleteUser(userId);

if (!result.success && result.courseCount) {
  // Show error with course count
  toast.error(`Cannot delete user. They own ${result.courseCount} courses.`);
  
  // Option: Show reassignment UI first
  showReassignmentDialog(userId, result.courseCount);
}
```

### Example React Hook

```tsx
function useUserDeletion() {
  const [showReassignDialog, setShowReassignDialog] = useState(false);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [courseCount, setCourseCount] = useState(0);

  const handleDelete = async (userId: string) => {
    const result = await deleteUser(userId);
    
    if (!result.success) {
      if (result.courseCount && result.courseCount > 0) {
        // User owns courses - need to reassign first
        setPendingUserId(userId);
        setCourseCount(result.courseCount);
        setShowReassignDialog(true);
      } else {
        toast.error(result.error);
      }
      return;
    }
    
    toast.success('User deleted successfully');
    refetchUsers();
  };

  const handleReassignAndDelete = async (targetInstructorId: string) => {
    if (!pendingUserId) return;
    
    // First reassign courses
    const reassignResult = await reassignInstructor(pendingUserId, targetInstructorId);
    if (!reassignResult.success) {
      toast.error(reassignResult.error);
      return;
    }
    
    // Then delete user
    const deleteResult = await deleteUser(pendingUserId);
    if (!deleteResult.success) {
      toast.error(deleteResult.error);
      return;
    }
    
    toast.success(`Reassigned ${reassignResult.reassignedCount} courses and deleted user`);
    setShowReassignDialog(false);
    setPendingUserId(null);
    refetchUsers();
  };

  return { handleDelete, handleReassignAndDelete, showReassignDialog, courseCount };
}
```

---

## Server Action Functions

The following server actions are available in `lib/actions/users.ts`:

| Function | Parameters | Description |
|----------|------------|-------------|
| `deleteUser(userId)` | `string` | Soft-delete a user |
| `bulkDeleteUsers(userIds)` | `string[]` | Bulk soft-delete users |
| `restoreUser(userId)` | `string` | Restore a soft-deleted user |
| `assignUserRole(userId, newRole, reassignTo?)` | `string, UserRole, string?` | Assign role with validation |
| `reassignInstructor(fromUserId, toUserId)` | `string, string` | Transfer course ownership |
| `getUserCourseCount(userId)` | `string` | Get user's course count |

---

## Audit Trail

All admin actions are logged to `public.audit_log` with:
- `user_id`: Admin who performed the action
- `action`: Action type (`soft_delete_user`, `assign_role`, `reassign_instructor`, `restore_user`)
- `entity_type`: Target entity type (`user`, `courses`)
- `entity_id`: Target entity ID
- `old_values`: Previous state (JSONB)
- `new_values`: New state (JSONB)
- `created_at`: Timestamp

---

## Security Notes

1. **RLS Enforcement**: All RPC functions are `SECURITY DEFINER` but still check `is_admin()` internally
2. **Active User Check**: Deleted/banned users cannot perform any write operations
3. **Course Protection**: FK constraint `ON DELETE RESTRICT` prevents orphaning courses
4. **Double Verification**: API routes verify admin status server-side before calling RPCs
5. **No Service Role on Client**: All client-facing API routes use authenticated Supabase client

---

## Migration Applied

Migration name: `safe_user_deletion_and_role_management`
Applied automatically to project: `ixbhljtotgsqkzbkucuc`

To apply to other environments, run the migration SQL from the Supabase dashboard or CLI.
