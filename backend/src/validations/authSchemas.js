const { z } = require("zod");

const emailSchema = z.string().email("Invalid email format");

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  role: z.enum(["patient", "caregiver", "clinic"]).default("patient"),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

module.exports = {
  signupSchema,
  loginSchema,
};
