import { z } from "zod";
export const courseStep1Schema = z.object({
    title: z.string().min(5, "Title too short"),
    short_description: z.string().min(10, "Description too short"),
    description: z.string().min(20, "Content too short"),
    category_id: z.string().min(1, "Select category"),
    instructor_ids: z.array(z.string()).min(1, "Select instructor"),
    support_instructor_ids: z.array(z.string()).optional(),
    batch_no: z.number().min(1, "Batch required"),
    discount_expires_at: z.string({ error: "Select deadline" }).min(1, "Select deadline"),
    level: z.enum(["beginner", "intermediate", "advanced"], { error: "Select level" }),
    course_type: z.enum(["recorded", "live", "hybrid"], { error: "Select type" }),
    language: z.string().min(1, "Select language"),
});export const courseStep2Schema = z.object({
    requirements: z.array(z.string()).min(1, "Add at least one requirement"),
    target_audience: z.array(z.string()).min(1, "Define your target audience"),
});

export const courseStep3Schema = z.object({
    price: z.number().min(0, "Price cannot be negative"),
    discount_price: z.number().nullable().optional().refine((val) => val === null || val === undefined || val >= 0, "Discount price cannot be negative"),
    thumbnail_url: z.string().min(1, "Course thumbnail is required"),
    preview_video_url: z.string().optional(),
    community_facebook_url: z.union([z.string().url("Must be a valid URL"), z.literal(""), z.null()]).optional(),
    community_whatsapp_url: z.union([z.string().url("Must be a valid URL"), z.literal(""), z.null()]).optional(),
    bkash_automatic_enabled: z.boolean().optional(),
    manual_payment_methods: z.object({
        bkash: z.string().optional(),
        nagad: z.string().optional(),
        upay: z.string().optional(),
        rocket: z.string().optional(),
    }).optional(),
}).refine((data) => {
    if (data.discount_price && data.discount_price >= data.price) {
        return false;
    }
    return true;
}, {
    message: "Discount price must be less than regular price",
    path: ["discount_price"],
});
export const courseStep4Schema = z.object({
    tags: z.array(z.string()).optional(),
    projects: z.array(z.object({
        title: z.string().min(1, "Project title is required"),
        description: z.string().min(1, "Project description is required"),
        image_url: z.string().optional(),
    })).optional(),
    faqs: z.array(z.object({
        question: z.string().min(1, "Question is required"),
        answer: z.string().min(1, "Answer is required"),
    })).optional(),
    resources: z.array(z.object({
        title: z.string().min(1, "Resource title is required"),
        type: z.string(),
        url: z.string().url("Must be a valid URL"),
    })).optional(),
    modules: z.array(z.object({
        title: z.string().min(1, "Module title is required"),
        lessons: z.array(z.object({
            title: z.string().min(1, "Lesson title is required"),
            video_url: z.string().optional(),
        })).optional(),
    })).optional(),
});
export const courseFormSchema = courseStep1Schema
    .merge(courseStep2Schema)
    .merge(courseStep3Schema)
    .merge(courseStep4Schema);
