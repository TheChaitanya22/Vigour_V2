const z = require("zod");
const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["user", "coach"], {
    errorMap: () => ({ message: "Role must be either 'user' or 'coach'" }),
  }),
});

// Login schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// JWT payload schema
const jwtPayloadSchema = z.object({
  email: z.string().email(),
  role: z.enum(["user", "coach"]),
});

module.exports = {
  registerSchema,
  loginSchema,
  jwtPayloadSchema,
};
