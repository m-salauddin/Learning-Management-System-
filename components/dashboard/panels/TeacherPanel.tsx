import { createSupabaseServerClient } from '@/lib/supabase/server';
import { BookOpen, Users, DollarSign, TrendingUp } from 'lucide-react';

export default async function TeacherPanel() {
    const supabase = await createSupabaseServerClient();

    const { data: courses } = await supabase
        .from('courses')
        .select('*');

    const totalCourses = courses?.length ?? 0;

    return (
        <div className="space-y-8 pb-10">
            {/* Welcome Section */}
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Instructor Dashboard 🎓
                </h1>
                <p className="text-muted-foreground">
                    Manage your courses, track performance, and grow your audience.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 bg-card border border-border rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-primary/10 text-primary">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Courses</p>
                            <p className="text-2xl font-bold">{totalCourses}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-card border border-border rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Students</p>
                            <p className="text-2xl font-bold">0</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-card border border-border rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Earnings</p>
                            <p className="text-2xl font-bold">৳0</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-card border border-border rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Avg. Rating</p>
                            <p className="text-2xl font-bold">—</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition-colors cursor-pointer">
                        <h4 className="font-semibold mb-2">Create New Course</h4>
                        <p className="text-sm text-muted-foreground">Start building your next course and share your knowledge.</p>
                    </div>
                    <div className="p-6 bg-card border border-border rounded-2xl hover:border-primary/50 transition-colors cursor-pointer">
                        <h4 className="font-semibold mb-2">View Analytics</h4>
                        <p className="text-sm text-muted-foreground">Track your course performance and student engagement.</p>
                    </div>
                </div>
            </div>

            {/* My Courses */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold">My Courses</h3>
                {totalCourses === 0 ? (
                    <div className="p-10 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center bg-card/30">
                        <div className="p-4 bg-muted rounded-full mb-4">
                            <BookOpen className="w-8 h-8 text-muted-foreground opacity-50" />
                        </div>
                        <h4 className="text-lg font-semibold">No courses yet</h4>
                        <p className="text-muted-foreground mb-6 max-w-sm text-sm">
                            Create your first course and start sharing your expertise with learners.
                        </p>
                        <button className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                            Create Course
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses?.map((course) => (
                            <div key={course.id} className="p-4 bg-card border border-border rounded-2xl">
                                <h4 className="font-semibold">{course.title || 'Untitled Course'}</h4>
                                <p className="text-sm text-muted-foreground mt-1">0 students enrolled</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
