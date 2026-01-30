import type { Metadata } from "next";
import InstructorsClient from "./InstructorsClient";

export const metadata: Metadata = {
    title: "Our Expert Instructors - Dokkhota IT",
    description: "Meet the world-class mentors at Dokkhota IT. Learn from industry veterans with experience from top tech giants.",
};

export default function InstructorsPage() {
    return (
        <main>
            <InstructorsClient />
        </main>
    );
}
