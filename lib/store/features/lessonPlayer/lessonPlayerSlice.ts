import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { LessonPlayerState } from '@/types/course-page';
import * as coursePageActions from '@/lib/actions/course-page';
import * as enrollmentActions from '@/lib/actions/enrollments';
interface LessonPlayerSliceState extends LessonPlayerState {
    courseId: string | null;
    modules: Array<{
        id: string;
        title: string;
        lessons: Array<{
            id: string;
            title: string;
            duration_minutes: number;
            is_free_preview: boolean;
            is_completed: boolean;
        }>;
    }>;
    lastSavedAt: string | null;
    isDirty: boolean;
    videoState: {
        isPlaying: boolean;
        currentTime: number;
        duration: number;
        volume: number;
        playbackRate: number;
        isFullscreen: boolean;
    };
}
const initialState: LessonPlayerSliceState = {
    currentLessonId: null,
    courseId: null,
    lessonContent: null,
    signedVideoUrl: null,
    videoExpiry: null,
    progress: {
        watchedSeconds: 0,
        totalSeconds: 0,
        isCompleted: false,
    },
    loading: false,
    error: null,
    modules: [],
    lastSavedAt: null,
    isDirty: false,
    videoState: {
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume: 1,
        playbackRate: 1,
        isFullscreen: false,
    },
};
export const fetchLessonContent = createAsyncThunk(
    'lessonPlayer/fetchContent',
    async (lessonId: string, { rejectWithValue }) => {
        const result = await coursePageActions.getLessonContent(lessonId);
        if (!result.success) {
            return rejectWithValue(result.error);
        }
        return { lessonId, ...result.data };
    }
);
export const fetchSignedVideoUrl = createAsyncThunk(
    'lessonPlayer/fetchVideoUrl',
    async (lessonId: string, { rejectWithValue }) => {
        const result = await coursePageActions.getSignedVideoUrl(lessonId);
        if (!result.success) {
            return rejectWithValue(result.error);
        }
        return result;
    }
);
export const saveProgress = createAsyncThunk(
    'lessonPlayer/saveProgress',
    async (
        { lessonId, watchedSeconds, isCompleted }:
            { lessonId: string; watchedSeconds: number; isCompleted?: boolean },
        { rejectWithValue }
    ) => {
        const result = await enrollmentActions.updateLessonProgress(
            lessonId,
            watchedSeconds,
            isCompleted
        );
        if (!result.success) {
            return rejectWithValue(result.error);
        }
        return { lessonId, watchedSeconds, isCompleted };
    }
);
export const markComplete = createAsyncThunk(
    'lessonPlayer/markComplete',
    async (lessonId: string, { rejectWithValue }) => {
        const result = await enrollmentActions.markLessonComplete(lessonId);
        if (!result.success) {
            return rejectWithValue(result.error);
        }
        return { lessonId };
    }
);
const lessonPlayerSlice = createSlice({
    name: 'lessonPlayer',
    initialState,
    reducers: {
        setCurrentLesson(state, action: PayloadAction<string>) {
            state.currentLessonId = action.payload;
            state.lessonContent = null;
            state.signedVideoUrl = null;
            state.error = null;
        },
        setCourseContext(state, action: PayloadAction<{
            courseId: string;
            modules: LessonPlayerSliceState['modules'];
        }>) {
            state.courseId = action.payload.courseId;
            state.modules = action.payload.modules;
        },
        updateVideoState(state, action: PayloadAction<Partial<LessonPlayerSliceState['videoState']>>) {
            state.videoState = { ...state.videoState, ...action.payload };
        },
        updateLocalProgress(state, action: PayloadAction<{
            watchedSeconds: number;
            totalSeconds?: number;
        }>) {
            state.progress.watchedSeconds = action.payload.watchedSeconds;
            if (action.payload.totalSeconds !== undefined) {
                state.progress.totalSeconds = action.payload.totalSeconds;
            }
            state.isDirty = true;
        },
        markProgressSynced(state) {
            state.isDirty = false;
            state.lastSavedAt = new Date().toISOString();
        },
        updateLessonCompletion(state, action: PayloadAction<{ lessonId: string; isCompleted: boolean }>) {
            const { lessonId, isCompleted } = action.payload;
            state.modules.forEach((mod) => {
                const lesson = mod.lessons.find((l) => l.id === lessonId);
                if (lesson) {
                    lesson.is_completed = isCompleted;
                }
            });
            if (state.currentLessonId === lessonId) {
                state.progress.isCompleted = isCompleted;
            }
        },
        clearVideoUrl(state) {
            state.signedVideoUrl = null;
            state.videoExpiry = null;
        },
        resetPlayer(state) {
            return initialState;
        },
        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLessonContent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLessonContent.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload.content) {
                    state.currentLessonId = action.payload.lessonId;
                    state.lessonContent = {
                        markdown: action.payload.content.markdown,
                        resources: action.payload.content.resources,
                    };
                }
            })
            .addCase(fetchLessonContent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        builder
            .addCase(fetchSignedVideoUrl.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSignedVideoUrl.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.signedVideoUrl = action.payload.url || null;
                    state.videoExpiry = action.payload.expires_at
                        ? new Date(action.payload.expires_at)
                        : null;
                }
            })
            .addCase(fetchSignedVideoUrl.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        builder
            .addCase(saveProgress.fulfilled, (state, action) => {
                state.isDirty = false;
                state.lastSavedAt = new Date().toISOString();
                if (action.payload.isCompleted) {
                    state.progress.isCompleted = true;
                }
            });
        builder
            .addCase(markComplete.fulfilled, (state, action) => {
                state.progress.isCompleted = true;
                state.modules.forEach((mod) => {
                    const lesson = mod.lessons.find((l) => l.id === action.payload.lessonId);
                    if (lesson) {
                        lesson.is_completed = true;
                    }
                });
            });
    },
});
export const {
    setCurrentLesson,
    setCourseContext,
    updateVideoState,
    updateLocalProgress,
    markProgressSynced,
    updateLessonCompletion,
    clearVideoUrl,
    resetPlayer,
    setError,
    clearError,
} = lessonPlayerSlice.actions;
export const selectCurrentLesson = (state: { lessonPlayer: LessonPlayerSliceState }) =>
    state.lessonPlayer.currentLessonId;
export const selectLessonContent = (state: { lessonPlayer: LessonPlayerSliceState }) =>
    state.lessonPlayer.lessonContent;
export const selectVideoUrl = (state: { lessonPlayer: LessonPlayerSliceState }) =>
    state.lessonPlayer.signedVideoUrl;
export const selectVideoExpiry = (state: { lessonPlayer: LessonPlayerSliceState }) =>
    state.lessonPlayer.videoExpiry;
export const selectProgress = (state: { lessonPlayer: LessonPlayerSliceState }) =>
    state.lessonPlayer.progress;
export const selectModules = (state: { lessonPlayer: LessonPlayerSliceState }) =>
    state.lessonPlayer.modules;
export const selectVideoState = (state: { lessonPlayer: LessonPlayerSliceState }) =>
    state.lessonPlayer.videoState;
export const selectPlayerLoading = (state: { lessonPlayer: LessonPlayerSliceState }) =>
    state.lessonPlayer.loading;
export const selectPlayerError = (state: { lessonPlayer: LessonPlayerSliceState }) =>
    state.lessonPlayer.error;
export const selectNextLesson = (state: { lessonPlayer: LessonPlayerSliceState }) => {
    const { currentLessonId, modules } = state.lessonPlayer;
    if (!currentLessonId) return null;
    let foundCurrent = false;
    for (const mod of modules) {
        for (const lesson of mod.lessons) {
            if (foundCurrent) {
                return { moduleTitle: mod.title, ...lesson };
            }
            if (lesson.id === currentLessonId) {
                foundCurrent = true;
            }
        }
    }
    return null;
};
export const selectPrevLesson = (state: { lessonPlayer: LessonPlayerSliceState }) => {
    const { currentLessonId, modules } = state.lessonPlayer;
    if (!currentLessonId) return null;
    let prevLesson: { moduleTitle: string; id: string; title: string } | null = null;
    for (const mod of modules) {
        for (const lesson of mod.lessons) {
            if (lesson.id === currentLessonId) {
                return prevLesson;
            }
            prevLesson = { moduleTitle: mod.title, ...lesson };
        }
    }
    return null;
};
export default lessonPlayerSlice.reducer;
