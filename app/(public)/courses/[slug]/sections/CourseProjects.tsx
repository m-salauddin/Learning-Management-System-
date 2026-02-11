"use client";

import Image from "next/image";
import { FolderKanban, Rocket, ExternalLink, Github } from "lucide-react";
import { CourseProject } from "@/types/course-page";

interface CourseProjectsProps {
    projects: CourseProject[];
}

export default function CourseProjects({ projects }: CourseProjectsProps) {
    if (!projects || projects.length === 0) return null;

    return (
        <div className="mt-12 sm:mt-16 space-y-10">
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                    <FolderKanban className="w-3.5 h-3.5" />
                    Active Learning
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white">Practical Mastery</h2>
                <p className="text-slate-400 text-sm sm:text-base max-w-xl">
                    Build professional-grade applications to solidify your skills and build a portfolio that stands out.
                </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                {projects.map((project, i) => (
                    <div key={i} className="group flex flex-col rounded-[2.5rem] bg-slate-900/20 border border-white/5 hover:border-white/10 transition-all duration-500 overflow-hidden">
                        <div className="aspect-video relative overflow-hidden p-2">
                            <div className="w-full h-full rounded-[1.75rem] overflow-hidden relative">
                                <Image
                                    src={project.thumbnail_url || '/placeholder-project.jpg'}
                                    alt={project.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-60" />
                                <div className="absolute top-4 right-4 flex gap-2">
                                    {project.demo_url && (
                                        <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:scale-110 transition-all">
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                    {project.github_url && (
                                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-zinc-800 hover:scale-110 transition-all">
                                            <Github className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-8 space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Rocket className="w-4 h-4 text-primary" />
                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Featured Project</span>
                                </div>
                                <h3 className="text-xl font-black text-white group-hover:text-primary transition-colors">{project.title}</h3>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                                {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {project.technologies?.map((tech, tIdx) => (
                                    <span key={tIdx} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-slate-500">{tech}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
