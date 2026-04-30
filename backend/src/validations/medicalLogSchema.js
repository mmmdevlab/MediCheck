const { z } = require("zod");

const createMedicalLogSchema = z.object({
  feelingScore: z
    .number({
      required_error: "Feeling score is required",
      invalid_type_error: "Feeling score must be a number",
    })
    .int("Feeling score must be an integer")
    .min(1, "Feeling score must be at least 1")
    .max(5, "Feeling score must be at most 5"),
});

module.exports = {
  createMedicalLogSchema,
};
