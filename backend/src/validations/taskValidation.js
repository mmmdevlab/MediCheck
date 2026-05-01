const { z } = require("zod");

const createTaskSchema = z.object({
  appointmentId: z.number().int().positive("Appointment ID is required"),
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().max(1000, "Description too long").optional(),
  taskType: z
    .enum([
      "medication",
      "imaging",
      "lab_work",
      "follow_up",
      "rest",
      "lifestyle",
      "other",
    ])
    .default("other")
    .optional(),
  dueDate: z.string().datetime().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional(),
  taskType: z
    .enum([
      "medication",
      "imaging",
      "lab_work",
      "follow_up",
      "rest",
      "lifestyle",
      "other",
    ])
    .optional(),
  isCompleted: z.boolean().optional(),
  dueDate: z.string().datetime().optional(),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
};
