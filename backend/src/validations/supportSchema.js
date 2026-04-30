const { z } = require("zod");

const createSupportRequestSchema = z.object({
  appointmentId: z
    .number({
      invalid_type_error: "Appointment ID must be a number",
    })
    .int("Appointment ID must be an integer")
    .positive("Appointment ID must be positive")
    .optional()
    .nullable(),

  caregiverId: z
    .number({
      invalid_type_error: "Caregiver ID must be a number",
    })
    .int("Caregiver ID must be an integer")
    .positive("Caregiver ID must be positive")
    .optional()
    .nullable(),

  requestType: z.enum(
    ["transport", "notes", "pickup", "meal_prep", "recovery_care", "other"],
    {
      required_error: "Request type is required",
      invalid_type_error: "Invalid request type",
    },
  ),

  message: z
    .string({
      invalid_type_error: "Message must be a string",
    })
    .min(1, "Message cannot be empty")
    .max(1000, "Message is too long (max 1000 characters)")
    .trim()
    .optional()
    .nullable(),
});

const updateSupportRequestSchema = z.object({
  message: z
    .string({
      required_error: "Message is required",
      invalid_type_error: "Message must be a string",
    })
    .min(1, "Message cannot be empty")
    .max(1000, "Message is too long (max 1000 characters)")
    .trim(),
});

module.exports = {
  createSupportRequestSchema,
  updateSupportRequestSchema,
};
