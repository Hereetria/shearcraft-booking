import { z } from "zod"

export function zEnumFromPrisma<
  T extends Record<string, string>,
  U extends T[keyof T]
>(e: T) {
  const values = Object.values(e) as U[]
  const literals = values.map(v => z.literal(v)) as [
    z.ZodLiteral<U>,
    ...z.ZodLiteral<U>[]
  ]
  return z.union(literals)
}
