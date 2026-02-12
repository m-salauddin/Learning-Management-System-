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
                className="relative group overflow-hidden p-6 md:p-8 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-3xl shadow-2xl"
            >
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[100px] -mr-40 -mt-40 rounded-full" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,1)]" />
                            Phase 03
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                            The <span className="text-amber-500">Presentation</span>
                        </h2>
                        <p className="text-white/40 text-xs md:text-sm max-w-lg font-medium leading-relaxed">
                            Set the value and visual identity. Excellence in presentation determines the perceived value of your knowledge.
                        </p>
                    </div>
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-linear-to-br from-amber-500/20 to-amber-500/5 border border-white/10 flex items-center justify-center text-amber-500 shadow-2xl backdrop-blur-md">
                        <DollarSign className="w-7 h-7 md:w-8 md:h-8" />
                    </div>
                </div>
            </motion.div>
            <div className="p-6 rounded-3xl border border-border/50 bg-card/30 backdrop-blur-xl shadow-xl space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Pricing */}
                    <div className="space-y-4">
                        <label className={labelClasses}>
                            <DollarSign className="w-4 h-4 text-muted-foreground" />
                            Pricing & Video
                        </label>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Regular Price</p>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                                        className={cn(inputClasses, "pl-8")}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Discount Price (Optional)</p>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
                                    <input
                                        type="number"
                                        value={formData.discount_price || ""}
                                        onChange={(e) => setFormData(prev => ({ ...prev, discount_price: e.target.value ? parseInt(e.target.value) : null }))}
                                        className={cn(inputClasses, "pl-8")}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 pt-2">
                                <label className={labelClasses}>
                                    <Video className="w-4 h-4 text-muted-foreground" />
                                    Preview Video
                                </label>
                                <input
                                    type="url"
                                    value={formData.preview_video_url}
                                    onChange={(e) => setFormData(prev => ({ ...prev, preview_video_url: e.target.value }))}
                                    placeholder="YouTube or Vimeo URL"
                                    className={inputClasses}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="space-y-4">
                        <label className={labelClasses}>
                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                            Course Thumbnail
                        </label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={cn(
                                "relative aspect-video rounded-2xl overflow-hidden border border-dashed transition-all cursor-pointer",
                                isDragging ? "border-primary bg-primary/5" : "border-border/50 bg-muted/20 hover:bg-muted/30"
                            )}
                        >
                            {(formData.thumbnail_url || thumbnailPreview) ? (
                                <>
                                    <Image src={thumbnailPreview || formData.thumbnail_url || ""} alt="Thumbnail" fill className="object-cover" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <div className="p-3 rounded-full bg-white/10 text-white"><Upload className="w-5 h-5" /></div>
                                        <div onClick={(e) => { e.stopPropagation(); removeThumbnail(); }} className="p-3 rounded-full bg-red-500/20 text-red-500"><X className="w-5 h-5" /></div>
                                    </div>
                                </>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                                    <Upload className="w-8 h-8 text-muted-foreground mb-3" />
                                    <p className="text-sm font-semibold text-foreground">Click or drag to upload</p>
                                    <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tight">Recommendation: 1280x720px</p>
                                </div>
                            )}
                            {isUploadingThumbnail && (
                                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                </div>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
