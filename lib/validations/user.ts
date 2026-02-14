import { z } from "zod";

export const userCreateSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["student", "teacher", "moderator", "admin"]),
});

export const userUpdateSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    role: z.enum(["student", "teacher", "moderator", "admin"]),
    status: z.enum(["active", "inactive", "suspended", "pending"]),
});

export const userPasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type UserCreateFormData = z.infer<typeof userCreateSchema>;
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;
export type UserPasswordFormData = z.infer<typeof userPasswordSchema>;
