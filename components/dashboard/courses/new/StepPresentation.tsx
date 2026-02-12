"use client";

import { motion } from "motion/react";
import { DollarSign, Video, Image as ImageIcon, Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { inputClasses, labelClasses } from "./constants";
import { CreateCourseInput } from "@/types/lms";

interface StepPresentationProps {
    formData: CreateCourseInput;
    setFormData: React.Dispatch<React.SetStateAction<CreateCourseInput>>;
    thumbnailPreview: string | null;
    isDragging: boolean;
    isUploadingThumbnail: boolean;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleDragOver: (e: React.DragEvent) => void;
    handleDragLeave: (e: React.DragEvent) => void;
    handleDrop: (e: React.DragEvent) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    removeThumbnail: () => void;
}

export const StepPresentation = ({
    formData,
    setFormData,
    thumbnailPreview,
    isDragging,
    isUploadingThumbnail,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    removeThumbnail
}: StepPresentationProps) => {
    return (
        <motion.div
            key="step3"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
        >
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group overflow-hidden p-10 rounded-[2.5rem] border border-white/10 bg-slate-900/40 backdrop-blur-3xl shadow-2xl"
            >
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[100px] -mr-40 -mt-40 rounded-full" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,1)]" />
                            Phase 03
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            The <span className="text-amber-500">Presentation</span>
                        </h2>
                        <p className="text-white/40 text-sm md:text-base max-w-lg font-medium leading-relaxed">
                            Set the value and visual identity. Excellence in presentation determines the perceived value of your knowledge.
                        </p>
                    </div>
                    <div className="w-20 h-20 rounded-[2rem] bg-linear-to-br from-amber-500/20 to-amber-500/5 border border-white/10 flex items-center justify-center text-amber-500 shadow-2xl backdrop-blur-md">
                        <DollarSign className="w-10 h-10" />
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Pricing Card */}
                <div className="md:col-span-12 xl:col-span-5 p-10 rounded-[2.5rem] border border-white/10 bg-slate-950/40 backdrop-blur-3xl shadow-xl space-y-8 group">
                    <div className="space-y-4">
                        <label className={labelClasses}>
                            <DollarSign className="w-4 h-4 text-amber-500" /> Investment Structure
                        </label>
                        <div className="space-y-4">
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-amber-500 transition-colors">
                                    <span className="font-black text-lg">$</span>
                                </div>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                                    placeholder="Standard Price"
                                    className={cn(inputClasses, "pl-14")}
                                />
                            </div>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-white/20 group-focus-within/input:text-amber-500 transition-colors">
                                    <span className="font-black text-lg">$</span>
                                </div>
                                <input
                                    type="number"
                                    value={formData.discount_price || ""}
                                    onChange={(e) => setFormData(prev => ({ ...prev, discount_price: e.target.value ? parseInt(e.target.value) : null }))}
                                    placeholder="Discount Price (Optional)"
                                    className={cn(inputClasses, "pl-14")}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 group/input">
                        <label className={labelClasses}>
                            <Video className="w-4 h-4 text-amber-500" /> Preview Artifact
                        </label>
                        <input
                            type="url"
                            value={formData.preview_video_url}
                            onChange={(e) => setFormData(prev => ({ ...prev, preview_video_url: e.target.value }))}
                            placeholder="Vimeo / YouTube URL"
                            className={inputClasses}
                        />
                    </div>
                </div>

                {/* Thumbnail Card */}
                <div className="md:col-span-12 xl:col-span-7 p-10 rounded-[2.5rem] border border-white/10 bg-slate-950/40 backdrop-blur-3xl shadow-xl space-y-6 group">
                    <label className={labelClasses}>
                        <ImageIcon className="w-4 h-4 text-amber-500" /> Visual Identity
                    </label>

                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={cn(
                            "relative aspect-video rounded-3xl overflow-hidden border-2 border-dashed transition-all duration-700 group cursor-pointer",
                            isDragging ? "border-amber-500 bg-amber-500/10" : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                        )}
                    >
                        {(formData.thumbnail_url || thumbnailPreview) ? (
                            <>
                                <Image src={thumbnailPreview || formData.thumbnail_url || ""} alt="Thumbnail" fill className="object-cover" />
                                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-6">
                                    <div className="p-5 rounded-2xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all shadow-2xl"><Upload className="w-7 h-7" /></div>
                                    <div onClick={(e) => { e.stopPropagation(); removeThumbnail(); }} className="p-5 rounded-2xl bg-red-500/20 border border-red-500/20 text-red-500 hover:bg-red-500/30 transition-all shadow-2xl"><X className="w-7 h-7" /></div>
                                </div>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-5">
                                <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-inner">
                                    <Upload className="w-10 h-10" strokeWidth={1.5} />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-black text-white/80">Drop visual asset here</p>
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-2">PNG, JPG, WEBP • Max 5MB</p>
                                </div>
                            </div>
                        )}
                        {isUploadingThumbnail && (
                            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center space-y-6">
                                <div className="relative">
                                    <Loader2 className="w-16 h-16 text-amber-500 animate-spin" strokeWidth={1.5} />
                                    <div className="absolute inset-0 blur-2xl bg-amber-500/20" />
                                </div>
                                <p className="text-xs font-black text-amber-500 uppercase tracking-[0.4em] animate-pulse">Initializing Upload...</p>
                            </div>
                        )}
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>
            </div>
        </motion.div>
    );
};
