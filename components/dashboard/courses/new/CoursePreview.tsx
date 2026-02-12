"use client";

import Image from "next/image";
import { Eye, Image as ImageIcon, Users } from "lucide-react";
import { CreateCourseInput } from "@/types/lms";

interface CoursePreviewProps {
    formData: CreateCourseInput;
    thumbnailPreview: string | null;
}

export const CoursePreview = ({ formData, thumbnailPreview }: CoursePreviewProps) => (
    <div className="sticky top-24 hidden xl:block">
        <div className="p-8 rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-50" />

            {/* Visual Label */}
            <div className="absolute top-6 right-6 z-20">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                    <Eye className="w-3.5 h-3.5" />
                    Live Preview
                </span>
            </div>

            <div className="relative z-10 space-y-6">
                {/* Fake Course Card Image */}
                <div className="aspect-video w-full rounded-2xl bg-slate-950/50 overflow-hidden relative border border-white/10 shadow-inner group/thumb">
                    {(thumbnailPreview || formData.thumbnail_url) ? (
                        <Image
                            src={thumbnailPreview || formData.thumbnail_url || ""}
                            alt="Preview"
                            fill
                            className="object-cover transition-transform group-hover:scale-105 duration-1000"
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 space-y-3">
                            <ImageIcon className="w-12 h-12 stroke-[1.5]" />
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Visual Asset Pending</p>
                        </div>
                    )}
                    <div className="absolute bottom-4 left-4 flex gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-wider border border-white/10">
                            {formData.level}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[9px] font-black text-white uppercase tracking-wider border border-white/10">
                            {formData.language}
                        </span>
                    </div>
                </div>

                <div className="space-y-5 px-1">
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold leading-tight tracking-tight text-white line-clamp-2">
                            {formData.title || "Untiled Amazing Course"}
                        </h3>
                        <p className="text-xs text-white/40 line-clamp-2 font-medium">
                            {formData.short_description || "A captivating course description that sells the dream of mastery and excellence."}
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 overflow-hidden">
                                <div className="w-full h-full bg-linear-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                                    <Users className="w-4 h-4 text-primary" />
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-white/60 tracking-wider">M. SALAUDDIN</span>
                        </div>
                        <div className="flex flex-col items-end">
                            {formData.discount_price && (
                                <span className="text-[10px] font-bold text-white/30 line-through tracking-wider">৳{formData.price}</span>
                            )}
                            <span className="text-lg font-black text-white tracking-tight">৳{formData.discount_price || formData.price}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
