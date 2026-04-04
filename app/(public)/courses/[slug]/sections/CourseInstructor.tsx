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
                        className="group relative h-[280px] rounded-[2rem] overflow-hidden bg-slate-950 border border-white/5 transition-all duration-500 hover:scale-[1.02] hover:border-accent/30 shadow-2xl cursor-pointer"
                    >
                        {}
                        <div className="absolute inset-0 z-10 overflow-hidden h-full w-full">
                            {inst.avatar ? (
                                <Image
                                    src={inst.avatar}
                                    alt={inst.name}
                                    fill
                                    className="object-cover object-top group-hover:scale-110 transition-transform duration-700"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center font-black text-6xl text-white/5 bg-slate-900 uppercase transition-colors duration-500">
                                    {inst.name.charAt(0)}
                                </div>
                            )}
                            {}
                            <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent z-20" />
                        </div>
                        {}
                        <div className="absolute inset-0 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                            <div className="px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest scale-50 group-hover:scale-100 transition-all duration-300 flex items-center gap-2 shadow-2xl">
                                View Profile
                                <Play className="w-2.5 h-2.5 fill-white" />
                            </div>
                        </div>
                        {}
                        <div className="absolute inset-x-0 bottom-0 p-6 z-30 flex flex-col items-start text-left space-y-2.5">
                            {}
                            <div className="px-2.5 py-1 rounded-full bg-accent/20 backdrop-blur-md border border-accent/30 text-accent text-[8px] font-black uppercase tracking-widest shadow-sm ring-1 ring-accent/10">
                                {inst.role === 'main' ? "Lead Instructor" : "Support Mentor"}
                            </div>
                            <div className="space-y-0.5">
                                <h3 className="text-xl font-black text-white leading-tight group-hover:text-accent transition-colors duration-300 drop-shadow-md">
                                    {inst.name}
                                </h3>
                                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest truncate max-w-full drop-shadow-sm">
                                    {inst.title || "Industry Specialist"}
                                </p>
                            </div>
                        </div>
                        {}
                        <div className="absolute inset-0 border-2 border-accent/0 group-hover:border-accent/20 rounded-[2rem] transition-all duration-500 z-50 pointer-events-none" />
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
