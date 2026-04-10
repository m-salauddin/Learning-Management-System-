"use client";
import Image from "next/image";
import { Eye, Image as ImageIcon, Users, BookOpen, FolderKanban } from "lucide-react";
import { CreateCourseInput } from "@/types/lms";
interface CoursePreviewProps {
    formData: CreateCourseInput;
    thumbnailPreview: string | null;
}
export const CoursePreview = ({ formData, thumbnailPreview }: CoursePreviewProps) => {
    return (
        <div className="sticky top-24 hidden xl:block">
            <div className="p-4 rounded-[2rem] border border-border/50 bg-card/50 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
                {}
                <div className="flex items-center gap-2 mb-4 px-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live Content Preview</span>
                </div>
                <div className="relative flex flex-col bg-card border border-border/50 rounded-2xl overflow-hidden shadow-xl">
                    {}
                    <div className="relative p-3">
                        <div className="relative h-48 rounded-xl overflow-hidden bg-muted">
                            {(thumbnailPreview || formData.thumbnail_url) ? (
                                <Image
                                    src={thumbnailPreview || formData.thumbnail_url || ""}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/20">
                                    <ImageIcon className="w-12 h-12 stroke-1" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest mt-2">No Visual Asset</p>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/10">
                                <Users className="w-3 h-3 text-emerald-400" />
                                <span>0 students</span>
                            </div>
                        </div>
                    </div>
                    {}
                    <div className="px-4 pb-5 flex flex-col">
                        {(formData.level || formData.language) && (
                            <div className="flex items-center gap-2 mb-3">
                                {formData.level && (
                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                                        {formData.level}
                                    </span>
                                )}
                                {formData.language && (
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/50 border border-border/50 px-2 py-0.5 rounded-full">
                                        {formData.language}
                                    </span>
                                )}
                            </div>
                        )}
                        <h3 className="text-base font-bold leading-tight mb-2 text-foreground line-clamp-2 min-h-10">
                            {formData.title || "Untiled Amazing Course"}
                        </h3>
                        <p className="text-muted-foreground text-[11px] leading-relaxed mb-4 line-clamp-2">
                            {formData.short_description || "A captivating course description that sells the dream of mastery and excellence."}
                        </p>
                        <div className="flex items-center justify-center gap-3 py-2 px-3 mb-4 rounded-lg bg-muted/30 border border-border/50">
                            <div className="flex items-center gap-1.5">
                                <Users className="w-3 h-3 text-emerald-400" />
                                <span className="text-[10px] font-medium text-foreground">0</span>
                            </div>
                            <div className="w-px h-3 bg-border/50" />
                            <div className="flex items-center gap-1.5">
                                <BookOpen className="w-3 h-3 text-violet-400" />
                                <span className="text-[10px] font-medium text-foreground">
                                    {(formData.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0)} lessons
                                </span>
                            </div>
                            <div className="w-px h-3 bg-border/50" />
                            <div className="flex items-center gap-1.5">
                                <FolderKanban className="w-3 h-3 text-orange-400" />
                                <span className="text-[10px] font-medium text-foreground">
                                    {(formData.projects?.length || 0)} projects
                                </span>
                            </div>
                        </div>
                        <div className="flex items-end justify-between pt-4 border-t border-border/50">
                            <div className="flex flex-col">
                                {formData.discount_price ? (
                                    <>
                                        <span className="text-[10px] font-bold text-orange-500 mb-0.5">SALE</span>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-xl font-black text-foreground">৳{formData.discount_price}</span>
                                            <span className="text-[11px] font-medium text-muted-foreground line-through">৳{formData.price}</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">Price</span>
                                        <span className="text-xl font-black text-foreground">৳{formData.price}</span>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-2 pl-4 pr-1.5 py-1.5 bg-primary rounded-full opacity-50 grayscale cursor-not-allowed">
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Draft</span>
                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-primary">
                                    <Eye className="w-3 h-3" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {}
                <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                        <p className="text-[9px] font-bold text-emerald-500/50 uppercase tracking-widest mb-1">Status</p>
                        <p className="text-[11px] font-black text-emerald-500">READY</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                        <p className="text-[9px] font-bold text-blue-500/50 uppercase tracking-widest mb-1">Visibility</p>
                        <p className="text-[11px] font-black text-blue-500">PUBLIC</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
