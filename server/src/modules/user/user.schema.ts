import { number, object, string, TypeOf, ZodIssueCode } from 'zod'

export const createUserSchema = {
  body: object({
    username: string({
      required_error: "username is required",
    }),
    email: string({
      required_error: "email is required",
    }).email("must be a valid email"),
    password: string({
      required_error: "password is required",
    })
      .min(6, "Password must be at least 6 characters long")
      .max(64, "Password should not be longer than 64 characters"),
    confirmPassword: string({
      required_error: "username is required",
    }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),
};

export type CreateUserInput = TypeOf<typeof createUserSchema.body>
