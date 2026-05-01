import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long")
      .regex(/^[a-zA-Z0-9_]+$/, "Username must be alphanumeric"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    imageUrl: z.string().url("Invalid image URL").optional(),
  }),
});