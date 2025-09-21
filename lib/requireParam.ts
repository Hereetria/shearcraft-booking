import { badRequestError } from "@/lib/errors/httpErrors";

export function requireParam(
  name: string,
  params?: Record<string, string>
): string {
  const value = params?.[name]
  if (!value) {
    throw badRequestError(`Missing required param: ${name}`)
  }
  return value
}