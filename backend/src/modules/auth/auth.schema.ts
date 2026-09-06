import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Please enter a valid email address" })
    .toLowerCase(),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, { message: "Please enter your password" }),
});

export type LoginInput = z.infer<typeof loginSchema>;
