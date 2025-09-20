import { z, ZodType } from "zod"

export type BaseContext = {
  params: Record<string, string>
}

export type AuthContext = BaseContext & {
  userId: string
  userRole: string
}

export type MaybeAuthContext = BaseContext & {
  userId?: string
  userRole?: string
}

export type RouteHandler<C extends BaseContext = BaseContext> = (
  req: Request,
  ctx: C
) => Promise<Response>

export type Wrapper<
  CIn extends BaseContext = BaseContext,
  COut extends BaseContext = CIn
> = (handler: RouteHandler<COut>) => RouteHandler<CIn>


export type SchemaHandler<TSchema extends ZodType, C extends BaseContext> =
  RouteHandler<C & { body: z.infer<TSchema> }>
