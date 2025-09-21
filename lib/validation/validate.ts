import { badRequestError } from "@/lib/errors/httpErrors"
import { ZodType, z } from "zod"

export function validate<TSchema extends ZodType>(
  schema: TSchema,
  data: unknown
): z.infer<TSchema> {
  const result = schema.safeParse(data)

  if (!result.success) {
    const errors = result.error.issues.map(issue => ({
      path: issue.path.join("."),
      message: issue.message,
    }))
    throw badRequestError(JSON.stringify(errors))
  }

  return result.data
}
