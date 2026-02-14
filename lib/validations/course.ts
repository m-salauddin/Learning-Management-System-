import { z } from "zod";

export const courseStep1Schema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    short_description: z.string().min(10, "Short description must realize the value (min 10 chars)"),
    description: z.string().min(20, "Please provide a more detailed description (min 20 chars)"),
    category_id: z.string().min(1, "Please select a category"),
    instructor_id: z.string().min(1, "Please select an instructor"),
    batch_no: z.number().min(1, "Batch number is required"),
    level: z.enum(["beginner", "intermediate", "advanced"]),
    course_type: z.enum(["recorded", "live", "hybrid"]),
    language: z.string().min(1, "Language is required"),
});

export const courseStep2Schema = z.object({
    learning_objectives: z.array(z.string()).min(1, "Add at least one learning objective"),
    requirements: z.array(z.string()).min(1, "Add at least one requirement"),
    target_audience: z.array(z.string()).min(1, "Define your target audience"),
});

export const courseStep3Schema = z.object({
    price: z.number().min(0, "Price cannot be negative"),
    discount_price: z.number().nullable().optional().refine((val) => val === null || val === undefined || val >= 0, "Discount price cannot be negative"),
    thumbnail_url: z.string().min(1, "Course thumbnail is required"),
    preview_video_url: z.string().optional(),
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
});

export const courseFormSchema = courseStep1Schema
    .merge(courseStep2Schema)
    .merge(courseStep3Schema)
    .merge(courseStep4Schema);
