# Troubleshooting Guide: Notification Panel Loading State Issues

This document records the diagnosis and resolution of the issues with the notification panel's loading state. Reference this document if the notifications panel gets stuck in a loading state (`Skeleton` loader visible continuously) or experiences loading state flashing when opened.

---

## 1. Issue 1: The Infinite Render Loop (Stuck in Loading State)

### Root Cause
In React client components, declaring a Supabase client directly inside the component body causes it to be instantiated fresh on every single render:

```typescript
// ❌ BAD: Re-created on every render!
export function NotificationPanel() {
    const supabase = createClient();
    
    useEffect(() => {
        // ... set up Realtime subscription ...
    }, [supabase]); // ❌ triggers effect on every render!
}
```

Since the `supabase` instance was in the dependency array of the `useEffect`, every state update (e.g., setting the notifications, setting `isLoading` to `true`/`false`) triggered a re-render. A fresh render created a new `supabase` instance, re-triggering the `useEffect`, re-fetching the notifications, updating the state, and repeating the cycle infinitely.

### Solution
1. Wrap the Supabase client creation in a `useMemo` hook so its reference remains stable across all renders:
   ```typescript
   const supabase = useMemo(() => createClient(), []);
   ```
2. Split the `useEffect` concerns. Run the Realtime channel subscription exactly **once** on mount (with `supabase` as the only dependency):
   ```typescript
   useEffect(() => {
       const channel = supabase.channel('...').subscribe();
       return () => { supabase.removeChannel(channel); };
   }, [supabase]);
   ```

---

## 2. Issue 2: Unhandled Server Action Exceptions

### Root Cause
The async fetcher originally lacked a `try-catch` block:

```typescript
// ❌ BAD: Unhandled exceptions prevent setIsLoading(false) from running
const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    const result = await getNotifications(); // 💥 If this throws, execution aborts!
    if (result.success && result.data) {
        setNotifications(result.data);
    }
    setIsLoading(false); // ❌ Never reached if an error occurs!
}, []);
```

If the Server Action (`getNotifications()`) fails due to a database connection error, auth session issues, or timeout, it throws an unhandled exception on the client. As a result, the code execution never reaches `setIsLoading(false)`, trapping the dropdown in a perpetual loading state.

### Solution
Wrap the async fetch in a `try...catch...finally` block, ensuring that `setIsLoading(false)` is **always executed** within the `finally` block:

```typescript
//  GOOD: Guaranteed resolution of loading state
const fetchNotifications = useCallback(async (showLoader = true) => {
    if (showLoader) {
        setIsLoading(true);
    }
    try {
        const result = await getNotifications();
        if (result.success && result.data) {
            setNotifications(result.data);
        } else {
            console.error("Failed to fetch notifications:", result?.error);
        }
    } catch (error) {
        console.error("Error fetching notifications:", error);
    } finally {
        setIsLoading(false); //  Always runs!
    }
}, []);
```

---

## 3. Issue 3: Jarring Skeleton Flashing (Premium UX Solution)

### Root Cause
Every time the panel opened, `fetchNotifications()` was called, resetting `isLoading` to `true` and showing the skeleton loader. Even if the network call was fast (e.g., 100ms), it created a jarring visual flash.

### Solution (Silent Refreshing)
Implement a silent background refresh when opening the panel. Only show the skeleton loader if there are absolutely no notifications loaded yet:

```typescript
//  Initial fetch on mount (shows loader)
useEffect(() => {
    fetchNotifications(true);
}, [fetchNotifications]);

//  Fresh fetch when dropdown opens (silent background refresh if cache exists)
useEffect(() => {
    if (isOpen) {
        // Only show loading skeletons if we have no cached notifications yet
        fetchNotifications(notifications.length === 0);
    }
}, [isOpen, fetchNotifications, notifications.length]);
```

---

## Summary Checklist for Developer Reference

- [ ] Wrap Supabase/realtime clients in `useMemo` or declare them outside of component scope.
- [ ] Always wrap Next.js Server Action invocations in `try...catch...finally` blocks to guarantee loader cleanup in `finally`.
- [ ] Implement silent background refreshes by checking cache length (`items.length === 0`) before displaying full page/dropdown skeletons.
