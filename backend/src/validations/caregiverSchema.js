const { z } = require("zod");

const grantAccessSchema = z.object({
  caregiver_email: z
    .string({
      required_error: "Caregiver email is required",
      invalid_type_error: "Caregiver email must be a string",
    })
    .email("Invalid email format")
    .min(1, "Caregiver email cannot be empty")
    .max(255, "Email is too long")
    .trim(),
});

module.exports = {
  grantAccessSchema,
};
