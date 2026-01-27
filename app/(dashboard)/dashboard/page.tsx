export default function DashboardPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Welcome back, User!</h2>
                <p className="text-muted-foreground mt-1">Here's what's happening with your learning today.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-sm font-medium text-muted-foreground">Courses in Progress</div>
                    <div className="text-2xl font-bold mt-2">4</div>
                </div>
                <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-sm font-medium text-muted-foreground">Completed</div>
                    <div className="text-2xl font-bold mt-2">12</div>
                </div>
                <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-sm font-medium text-muted-foreground">Certificates</div>
                    <div className="text-2xl font-bold mt-2">3</div>
                </div>
                <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-sm font-medium text-muted-foreground">Learning Hours</div>
                    <div className="text-2xl font-bold mt-2">48h</div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm">
                    <h3 className="font-semibold mb-4 text-lg">Continue Learning</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-muted/40 hover:bg-muted transition-colors cursor-pointer">
                                <div className="w-12 h-12 rounded-lg bg-primary/20 shrink-0" />
                                <div>
                                    <div className="font-medium text-sm">Fullstack Web Development</div>
                                    <div className="text-xs text-muted-foreground mt-1">Lesson {i}: React Hooks</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-6 rounded-2xl border bg-card text-card-foreground shadow-sm">
                    <h3 className="font-semibold mb-4 text-lg">Recommended Paths</h3>
                    <div className="flex items-center justify-center h-48 text-muted-foreground border-2 border-dashed rounded-xl border-muted">
                        Coming Soon
                    </div>
                </div>
            </div>
        </div>
    );
}
