const { z } = require("zod");

const appointmentSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),

  appointmentDate: z.string().datetime({
    message:
      "Invalid date format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)",
  }),

  doctorName: z.string().max(255).optional(),
  clinicName: z.string().max(255).optional(),
  clinicId: z.number().int().positive().optional(),
  location: z.string().max(500).optional(),
  status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
  notes: z.string().optional(),
});

const appointmentUpdateSchema = appointmentSchema.partial();

module.exports = {
  appointmentSchema,
  appointmentUpdateSchema,
};
