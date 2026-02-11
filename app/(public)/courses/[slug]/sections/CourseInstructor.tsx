"use client";

import Image from "next/image";
import { Award, Play, Github, Linkedin, Star } from "lucide-react";
import { MappedCourse } from "@/types/mapped-course";
import { InstructorInfo } from "@/types/course-page";
import { cn } from "@/lib/utils";

interface CourseInstructorProps {
    course: MappedCourse;
    instructorInfo?: InstructorInfo;
}

export default function CourseInstructor({ course, instructorInfo }: CourseInstructorProps) {
    return (
        <div className="mt-12 sm:mt-16 space-y-10">
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-widest">
                    <Award className="w-3.5 h-3.5" />
                    Expert Mentor
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white transition-colors">Learn from the Best</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl transition-colors">
                    Our instructors are seasoned professionals with a passion for sharing their deep industry knowledge.
                </p>
            </div>

            <div className="p-8 sm:p-10 rounded-[2.5rem] bg-card/60 dark:bg-slate-900/30 border border-slate-200 dark:border-white/5 relative overflow-hidden group shadow-sm dark:shadow-none transition-all duration-500">
                {/* Background Decoration */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <div className="relative z-10 flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start text-center md:text-left">
                    <div className="shrink-0 space-y-6">
                        <div className="w-40 h-40 rounded-[2.5rem] p-1.5 bg-linear-to-br from-accent/30 to-transparent ring-1 ring-white/10 group-hover:ring-accent/30 transition-all duration-500">
                            <div className="w-full h-full rounded-[2.2rem] bg-slate-800 overflow-hidden relative">
                                {course.instructor.avatar ? (
                                    <Image src={course.instructor.avatar} alt={course.instructor.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center font-black text-4xl text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 transition-colors">{course.instructor.name.charAt(0)}</div>
                                )}
                            </div>
                        </div>

                        {/* Desktop Socials */}
                        <div className="hidden md:flex items-center justify-center gap-4">
                            {[
                                { icon: Play, link: instructorInfo?.social_links?.youtube, color: 'hover:text-red-500' },
                                { icon: Github, link: instructorInfo?.social_links?.github, color: 'hover:text-white' },
                                { icon: Linkedin, link: instructorInfo?.social_links?.linkedin, color: 'hover:text-blue-500' }
                            ].filter(s => s.link).map((social, i) => (
                                <a key={i} href={social.link} target="_blank" rel="noopener noreferrer" className={cn("text-slate-500 transition-colors p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10", social.color)}>
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white transition-colors">{course.instructor.name}</h3>
                            <p className="text-accent text-xs font-bold uppercase tracking-widest">{course.instructor.title}</p>
                            <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
                                {instructorInfo?.expertise?.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 text-[10px] font-bold rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 capitalize transition-colors">{skill}</span>
                                ))}
                            </div>
                        </div>

                        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl transition-colors">
                            {instructorInfo?.bio || course.instructor.bio || "Senior professional dedicated to delivering high-quality education and practical insights to the next generation of engineers."}
                        </p>

                        <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200 dark:border-white/5">
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase">Students</p>
                                <p className="text-xl font-black text-slate-900 dark:text-white transition-colors">{instructorInfo?.total_students || course.students}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase">Rating</p>
                                <p className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-1.5 transition-colors">
                                    {instructorInfo?.rating || course.rating}
                                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase">Courses</p>
                                <p className="text-xl font-black text-slate-900 dark:text-white transition-colors">{instructorInfo?.total_courses || 6}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
