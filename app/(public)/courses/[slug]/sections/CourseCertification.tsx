"use client";

import { useRef, useEffect, useState } from "react";
import { Award, ShieldCheck, Share2 } from "lucide-react";
import { MappedCourse } from "@/types/mapped-course";

interface CourseCertificationProps {
    course: MappedCourse;
}

// Fixed design dimensions for the certificate (like a real certificate page)
const CERT_WIDTH = 900;
const CERT_HEIGHT = 620;

export default function CourseCertification({ course }: CourseCertificationProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const updateScale = () => {
            const containerWidth = container.offsetWidth;
            setScale(Math.min(containerWidth / CERT_WIDTH, 1));
        };

        updateScale();

        const observer = new ResizeObserver(updateScale);
        observer.observe(container);

        return () => observer.disconnect();
    }, []);

    return (
        <div className="mt-12 sm:mt-16 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest">
                        <Award className="w-3.5 h-3.5" />
                        Professional Credentials
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white transition-colors">Earn Your Certificate</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl transition-colors">
                        Validate your skills and boost your LinkedIn profile with our industry-recognized certification.
                    </p>
                </div>
            </div>

            {/* Scalable Certificate Container */}
            <div
                ref={containerRef}
                className="w-full relative overflow-hidden"
                style={{ height: CERT_HEIGHT * scale }}
            >
                <div
                    className="absolute top-0 left-0 origin-top-left"
                    style={{
                        width: CERT_WIDTH,
                        height: CERT_HEIGHT,
                        transform: `scale(${scale})`,
                    }}
                >
                    {/* Certificate Card */}
                    <div className="relative w-full h-full bg-white rounded-3xl shadow-2xl shadow-primary/10 border border-slate-100 flex flex-col overflow-hidden">
                        {/* Visual Layer: Modern Background Accents */}
                        <div className="absolute inset-0 pointer-events-none">
                            {/* Dot Grid Pattern */}
                            <div className="absolute inset-0 opacity-[0.03]"
                                style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                            {/* Gradient Orbs */}
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-bl from-primary/5 via-transparent to-transparent" />
                            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/2 rounded-full blur-[100px]" />

                            {/* Floating Geometric Shapes */}
                            <div className="absolute top-20 right-[15%] w-32 h-32 border border-primary/10 rounded-full rotate-12" />
                            <div className="absolute bottom-[20%] left-[10%] w-24 h-24 border border-accent/10 rounded-xl -rotate-12" />

                            {/* Watermark Logo */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] scale-[3] select-none">
                                <Award className="w-64 h-64 text-slate-900" />
                            </div>
                        </div>

                        {/* Left Accent Bar */}
                        <div className="absolute top-0 left-0 w-2.5 h-full bg-linear-to-b from-primary via-accent to-primary/40 z-20" />

                        {/* Top Content: Branding & Logo */}
                        <div className="p-12 flex justify-between items-start relative z-10 font-sans">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                        <Award className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="font-black text-xl tracking-tighter text-slate-900">DOKKHO<span className="text-primary">IT</span></span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">Academic Excellence</p>
                            </div>
                            <div className="text-right">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/50 text-[9px] font-bold text-primary uppercase tracking-wider">
                                    <ShieldCheck className="w-3 h-3 text-primary" />
                                    Verified Achievement
                                </div>
                            </div>
                        </div>

                        {/* Center Content: Student & Achievement */}
                        <div className="flex-1 flex flex-col items-center justify-center px-12 text-center relative z-10">
                            <div className="space-y-2 mb-8">
                                <h5 className="text-xs font-black text-primary uppercase tracking-[0.3em]">Certificate of Completion</h5>
                                <p className="text-slate-500 text-sm">This honor is officially presented to</p>
                            </div>

                            <div className="relative mb-10">
                                <h3 className="text-6xl font-black text-slate-900 tracking-tight whitespace-nowrap">Student Name</h3>
                                <div className="absolute -bottom-4 left-0 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="w-24 h-full bg-primary rounded-full" />
                                </div>
                            </div>

                            <div className="space-y-4 max-w-2xl px-8">
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    for successfully demonstrating professional mastery and fulfilling all requirements for
                                </p>
                                <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                                    {course.title}
                                </h4>
                            </div>
                        </div>

                        {/* Bottom Content: Verification & Signatures */}
                        <div className="p-12 grid grid-cols-3 items-end relative z-10">
                            {/* Issued By */}
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Issue Date</p>
                                    <p className="text-xs font-black text-slate-900 uppercase transition-colors">October 24, 2023</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Certificate ID</p>
                                    <p className="text-xs font-black text-slate-900 uppercase transition-colors">DK-8293-XP02</p>
                                </div>
                            </div>

                            {/* Digital Badge Center */}
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl" />
                                    <div className="relative w-24 h-24 rounded-2xl bg-primary/5 border border-primary/10 shadow-xl flex flex-col items-center justify-center p-3 text-center transition-colors">
                                        <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center mb-2 shadow-lg shadow-primary/20">
                                            <Award className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="text-[8px] font-black text-slate-900 leading-tight uppercase tracking-tighter">Certified Professional</span>
                                    </div>
                                </div>
                            </div>

                            {/* Verification QR / Signature */}
                            <div className="flex flex-col items-end gap-6">
                                <div className="text-right space-y-3">
                                    <div className="w-32 h-px bg-slate-200 ml-auto" />
                                    <div>
                                        <p className="text-xs font-black text-slate-900">Dr. M. S. Rahman</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Academic Director</p>
                                    </div>
                                </div>
                                {/* Mock QR Area */}
                                <div className="w-12 h-12 border border-slate-100 rounded-lg bg-slate-50 flex items-center justify-center p-1 opacity-50">
                                    <Share2 className="w-6 h-6 text-slate-300" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
