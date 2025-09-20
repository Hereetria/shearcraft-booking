import { BaseContext } from "@/types/routeTypes"
import { RouteHandler, Wrapper } from "@/types/routeTypes"

export function composeHandlers<C extends BaseContext>(
  ...wrappers: Wrapper<C, C>[]
): (handler: RouteHandler<C>) => RouteHandler<C> {
  return (handler) =>
    wrappers.reduceRight((acc, fn) => fn(acc), handler)
}
