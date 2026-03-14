import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Filter, Search, LayoutGrid, Grip, AlignJustify } from "lucide-react";

export default function CoursesLoading() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
                <div className="mb-8 space-y-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Skeleton className="h-4 w-24" />
                        <span className="text-muted-foreground">/</span>
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-10 w-64 mb-2" />
                    <Skeleton className="h-5 w-full max-w-2xl" />
                </div>

                <div className="sticky top-24 z-30 mb-8">
                    <div className="bg-card dark:bg-[#030712] border border-border p-2 rounded-2xl shadow-xl flex flex-col xl:flex-row gap-4 items-center">
                        <div className="w-full xl:w-auto flex-1 flex gap-2 p-1 overflow-hidden">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="h-10 w-28 shrink-0 rounded-lg" />
                            ))}
                        </div>
                        <div className="hidden xl:block w-px h-8 bg-border mx-2" />
                        <div className="flex items-center gap-3 w-full xl:w-auto shrink-0">
                            <Skeleton className="w-full sm:w-64 h-11 rounded-xl" />
                            <div className="hidden lg:flex gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-border">
                                <div className="p-2"><AlignJustify className="w-4 h-4 text-muted-foreground/30" /></div>
                                <div className="p-2"><LayoutGrid className="w-4 h-4 text-muted-foreground/30" /></div>
                                <div className="p-2"><Grip className="w-4 h-4 text-muted-foreground/30" /></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <aside className="hidden lg:block lg:w-64 lg:shrink-0 space-y-8 pr-4">
                        {[1, 2, 3].map((section) => (
                            <div key={section} className="space-y-3">
                                <Skeleton className="h-4 w-20 mb-4" />
                                {[1, 2, 3, 4].map((item) => (
                                    <div key={item} className="flex items-center gap-3">
                                        <Skeleton className="h-5 w-5 rounded-md" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </aside>

                    <div className="grow w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="bg-card/80 border border-border rounded-2xl overflow-hidden p-3 space-y-4">
                                    <Skeleton className="h-48 w-full rounded-xl" />
                                    <div className="px-1 space-y-4">
                                        <div className="flex gap-2">
                                            <Skeleton className="h-6 w-20 rounded-full" />
                                            <Skeleton className="h-6 w-20 rounded-full" />
                                        </div>
                                        <Skeleton className="h-7 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                        <div className="flex justify-between items-center pt-4 border-t border-border/50">
                                            <div className="space-y-2">
                                                <Skeleton className="h-3 w-12" />
                                                <Skeleton className="h-6 w-20" />
                                            </div>
                                            <Skeleton className="h-9 w-24 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
