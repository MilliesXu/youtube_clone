import { number, object, string, TypeOf, ZodIssueCode } from 'zod'

export const createVideoSchema = {
  body: object({
    title: string({
      required_error: "email is required",
    }),
    description: string()
  })
}

export type CreateVideoInput = TypeOf<typeof createVideoSchema.body>