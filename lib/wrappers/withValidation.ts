import { NextResponse } from "next/server"
import z, { ZodType } from "zod"
import { RouteHandler, BaseContext, Wrapper } from "@/types/routeTypes"

export function withValidation<TSchema extends ZodType, C extends BaseContext = BaseContext>(
  schema: TSchema
): Wrapper<C, C & { body: z.infer<TSchema> }> {
  return (handler: RouteHandler<C & { body: z.infer<TSchema> }>): RouteHandler<C> => {
    return async (req, context) => {
      const json = await req.json()
      const result = schema.safeParse(json)

      if (!result.success) {
        return NextResponse.json(
          {
            errors: result.error.issues.map(issue => ({
              path: issue.path.join("."),
              message: issue.message,
            })),
          },
          { status: 400 }
        )
      }

      return handler(req, {
        ...context,
        params: context.params ?? {},
        body: result.data,
      } as C & { body: z.infer<TSchema> })
    }
  }
}
