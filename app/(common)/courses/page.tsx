import type { Metadata } from "next";
import CoursesClient from "./CoursesClient";

export const metadata: Metadata = {
    title: "Browse Courses - Dokkhota IT",
    description: "Explore our wide range of IT courses including Web Development, App Development, Cyber Security, and more. Start your learning journey today.",
};

export default function CoursesPage() {
    return (
        <main>
            <CoursesClient />
        </main>
    );
}
