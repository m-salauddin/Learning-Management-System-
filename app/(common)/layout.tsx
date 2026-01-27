import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Suspense } from "react";

export default function CommonLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main>{children}</main>
            <Footer />
        </div>
    );
}
