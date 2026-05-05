const { z } = require("zod");

const appointmentSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),

  appointmentDate: z.string().datetime({
    message:
      "Invalid date format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)",
  }),

  doctorName: z.string().max(255).nullable().optional(),
  clinicName: z.string().max(255).nullable().optional(),
  clinicId: z.number().int().positive().nullable().optional(),
  location: z.string().max(500).nullable().optional(),
  status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
  notes: z.string().nullable().optional(),
});

const appointmentUpdateSchema = appointmentSchema.partial();

module.exports = {
  appointmentSchema,
  appointmentUpdateSchema,
};
