"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Play, Github, Linkedin, Award } from "lucide-react";
import { MappedCourse, Instructor } from "@/types/mapped-course";
import { cn } from "@/lib/utils";
import { Dialog, DialogBody, DialogClose, DialogHeader, DialogTitle } from "@/components/ui/Dialog";

interface CourseInstructorProps {
    course: MappedCourse;
}

export default function CourseInstructor({ course }: CourseInstructorProps) {
    const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);


    const rawInstructors = course.instructors && course.instructors.length > 0 
        ? course.instructors 
        : [course.instructor];


    const uniqueInstructors = rawInstructors.filter((v, i, a) => v && a.findIndex(t => t?.id === v?.id) === i);


    const sortedInstructors = [...uniqueInstructors].sort((a, b) => {
        const roleA = a.role === 'main' ? 0 : 1;
        const roleB = b.role === 'main' ? 0 : 1;
        return roleA - roleB;
    });

    if (sortedInstructors.length === 0) return null;

    return (
        <section id="instructors" className="mt-12 sm:mt-16 space-y-12">
             <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest">
                    <Award className="w-3.5 h-3.5" />
                    Expert Mentors
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white transition-colors">Learn from the Best</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl transition-colors font-medium">
                    Our curriculum is crafted and delivered by industry veterans who have built and scaled systems used by millions.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedInstructors.map((inst, index) => (
                    <button
                        key={inst.id || index}
                        onClick={() => setSelectedInstructor(inst)}
                        className="group relative aspect-4/5 rounded-[2.5rem] overflow-hidden bg-slate-900 border border-white/5 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-accent/10 cursor-pointer"
                    >

                        <div className="absolute inset-0 bg-linear-to-b from-teal-900/40 via-transparent to-slate-950 z-0" />
                        

                        <div className="absolute inset-0 z-10">
                            {inst.avatar ? (
                                <Image 
                                    src={inst.avatar} 
                                    alt={inst.name} 
                                    fill 
                                    className="object-cover object-top grayscale-20 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-black text-6xl text-white/10 bg-slate-800 uppercase">{inst.name.charAt(0)}</div>
                            )}
                        </div>


                        <div className="absolute inset-0 z-20 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />


                        <div className="absolute bottom-0 left-0 right-0 p-8 z-30 text-left space-y-1.5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="text-xl font-black text-white leading-tight group-hover:text-accent transition-colors">{inst.name}</h3>
                            <div className="space-y-0.5">
                                <p className="text-accent text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                                    {inst.role === 'main' ? "Lead Instructor" : "Support Mentor"}
                                </p>
                                <p className="text-white/60 text-[10px] font-medium truncate max-w-[90%]">
                                    {inst.title || "Industry Specialist"}
                                </p>
                            </div>
                        </div>


                        <div className="absolute top-6 right-6 z-40 w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                             <Play className="w-4 h-4 text-accent fill-accent ml-1" />
                        </div>
                    </button>
                ))}
            </div>

            <Dialog open={!!selectedInstructor} onClose={() => setSelectedInstructor(null)} size="md">
                {selectedInstructor && (
                    <>
                        <DialogHeader className="relative pr-12 border-none! pt-10 pb-4">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-3xl overflow-hidden relative shrink-0 ring-4 ring-accent/5">
                                    {selectedInstructor.avatar ? (
                                        <Image src={selectedInstructor.avatar} alt={selectedInstructor.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-black text-2xl text-white bg-slate-800 uppercase">{selectedInstructor.name.charAt(0)}</div>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <DialogTitle className="text-2xl font-black">{selectedInstructor.name}</DialogTitle>
                                    <div className="flex items-center gap-2">
                                        <p className="text-accent text-xs font-bold uppercase tracking-widest">{selectedInstructor.title}</p>
                                        {selectedInstructor.role === 'support' && (
                                            <span className="px-2 py-0.5 text-[8px] font-black uppercase tracking-normal rounded-full bg-accent/10 text-accent border border-accent/10 whitespace-nowrap">Support Mentor</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <DialogClose onClose={() => setSelectedInstructor(null)} />
                        </DialogHeader>
                        <DialogBody className="space-y-8 pb-10 pt-4">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Professional Background</h4>
                                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                    {selectedInstructor.bio || "Senior professional dedicated to delivering high-quality education and practical insights to the next generation of engineers."}
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-8 py-8 border-y border-slate-200 dark:border-white/5">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-2">Total Students</p>
                                    <p className="text-xl font-black text-slate-900 dark:text-white">
                                        {selectedInstructor.total_students ? `${(selectedInstructor.total_students / 1000).toFixed(1)}k+` : "1.5k+"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-2">Mentor Rating</p>
                                    <p className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                                        {selectedInstructor.rating || "4.9"}
                                        <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-2">Published Courses</p>
                                    <p className="text-xl font-black text-slate-900 dark:text-white">
                                        {selectedInstructor.total_courses || "12+"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Social Presence</h4>
                                <div className="flex items-center gap-3">
                                    {[
                                        { icon: Play, link: selectedInstructor.social_links?.youtube, color: 'hover:text-red-500' },
                                        { icon: Github, link: selectedInstructor.social_links?.github, color: 'hover:text-white' },
                                        { icon: Linkedin, link: selectedInstructor.social_links?.linkedin, color: 'hover:text-blue-500' }
                                    ].filter(s => s.link).map((social, i) => (
                                        <a key={i} href={social.link} target="_blank" rel="noopener noreferrer" className={cn("text-slate-400 transition-all p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 hover:scale-110", social.color)}>
                                            <social.icon className="w-5 h-5" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </DialogBody>
                    </>
                )}
            </Dialog>
        </section>
    );
}
