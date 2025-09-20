import { composeHandlers } from "@/lib/composeHandlers"
import { withAuth } from "@/lib/wrappers/withAuth"
import { withAuthOptional } from "@/lib/wrappers/withAuthOptional"
import { withErrorHandling } from "@/lib/wrappers/withErrorHandling"
import { withRole } from "@/lib/wrappers/withRole"
import { AuthContext, BaseContext, MaybeAuthContext, RouteHandler, Wrapper } from "@/types/routeTypes"
import { Role } from "@prisma/client"

function buildRoute<C extends BaseContext>(
  ...wrappers: Array<Wrapper<C>>
) {
  return (...fns: Array<Wrapper<C>>) =>
    (handler: RouteHandler<C>) =>
      composeHandlers(...wrappers, ...fns)(handler)
}


export const adminRoute = buildRoute<AuthContext>(
  withErrorHandling,
  withAuth,
  withRole([Role.ADMIN])
)

export const selfRoute = buildRoute<AuthContext>(
  withErrorHandling,
  withAuth
)

export const publicRoute = buildRoute<BaseContext>(
  withErrorHandling
)

export const publicRouteWithOptionalAuth = buildRoute<MaybeAuthContext>(
  withErrorHandling,
  withAuthOptional
)
