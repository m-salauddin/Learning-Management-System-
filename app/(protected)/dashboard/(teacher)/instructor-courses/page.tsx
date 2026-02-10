import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { GraduationCap } from "lucide-react";

export default function InstructorCoursesPage() {
    return (
        <div className="space-y-6">
            <Breadcrumbs
                items={[{ label: "Instructor Courses", icon: GraduationCap }]}
                showHomeIcon={true}
                rootLabel="Dashboard"
                rootHref="/dashboard"
                className="mb-8"
            />
            <h1 className="text-2xl font-bold">Instructor Courses</h1>
            <p className="text-muted-foreground">Manage your courses here.</p>
        </div>
    );
}
