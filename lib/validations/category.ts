import { z } from "zod";
export const categorySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
    slug: z.string().min(2, "Slug must be at least 2 characters").optional(),
    icon: z.string().min(1, "Icon is required"),
    color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"),
    description: z.string().max(500, "Description must be less than 500 characters").optional(),
});
export type CategoryFormData = z.infer<typeof categorySchema>;
