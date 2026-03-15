"use client";

import Image from "next/image";
import { FolderKanban, Rocket, ExternalLink, Github, Eye } from "lucide-react";
import { CourseProject } from "@/types/course-page";
import { useState } from "react";
import { Dialog, DialogBody, DialogClose, DialogHeader, DialogTitle } from "@/components/ui/Dialog";

interface CourseProjectsProps {
    projects: CourseProject[];
}

export default function CourseProjects({ projects }: CourseProjectsProps) {
    const [selectedProject, setSelectedProject] = useState<CourseProject | null>(null);

    if (!projects || projects.length === 0) return null;

    return (
        <div className="mt-12 sm:mt-16 space-y-10">
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                    <FolderKanban className="w-3.5 h-3.5" />
                    Active Learning
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Practical Mastery</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl">
                    Build professional-grade applications to solidify your skills and build a portfolio that stands out.
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {projects.map((project, i) => (
                    <div 
                        key={i} 
                        onClick={() => setSelectedProject(project)}
                        className="group cursor-pointer flex flex-col rounded-3xl bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 hover:border-primary/30 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
                    >
                        <div className="aspect-4/3 relative overflow-hidden p-1.5">
                            <div className="w-full h-full rounded-2xl overflow-hidden relative">
                                <Image
                                    src={project.thumbnail_url || '/placeholder-project.jpg'}
                                    alt={project.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    unoptimized
                                />
                                <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center scale-50 group-hover:scale-100 transition-all duration-300 shadow-2xl">
                                        <Eye className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-4 py-3 pb-4">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 group-hover:text-primary transition-colors line-clamp-1">
                                {project.title}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog 
                open={!!selectedProject} 
                onClose={() => setSelectedProject(null)} 
                size="md"
                className="bg-white dark:bg-slate-950 border-slate-200 dark:border-white/10"
            >
                <DialogHeader className="border-none pb-0 pt-6 px-6">
                    <div className="flex items-center gap-2 mb-1">
                        <Rocket className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest">Featured Project</span>
                    </div>
                    <DialogTitle className="text-xl font-black text-slate-900 dark:text-white">{selectedProject?.title}</DialogTitle>
                    <DialogClose onClose={() => setSelectedProject(null)} />
                </DialogHeader>

                <DialogBody className="space-y-4 pt-4 pb-6 px-6">
                    <div className="aspect-video max-h-[220px] relative rounded-xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-xl">
                        {selectedProject && (
                            <Image
                                src={selectedProject.thumbnail_url || '/placeholder-project.jpg'}
                                alt={selectedProject.title}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 to-transparent" />
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">About Project</h4>
                            <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                                {selectedProject?.description}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Technologies Used</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {selectedProject?.technologies?.map((tech, tIdx) => (
                                    <span key={tIdx} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2.5 pt-1">
                            {selectedProject?.demo_url && (
                                <a 
                                    href={selectedProject.demo_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:-translate-y-px transition-all active:scale-95 shadow-lg shadow-primary/10"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Live Demo
                                </a>
                            )}
                            {selectedProject?.github_url && (
                                <a 
                                    href={selectedProject.github_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 font-bold text-xs hover:bg-slate-200 dark:hover:bg-white/10 hover:-translate-y-px transition-all active:scale-95"
                                >
                                    <Github className="w-3.5 h-3.5" />
                                    Source
                                </a>
                            )}
                        </div>
                    </div>
                </DialogBody>
            </Dialog>
        </div>
    );
}
