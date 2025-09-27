import { ApiError, fail } from "@/lib/errors/errorHandler"

export const badRequestError = (msg = "Bad Request"): ApiError =>
  fail(400, msg)

export const unauthorizedError = (msg = "Unauthorized"): ApiError =>
  fail(401, msg)

export const forbiddenError = (msg = "Forbidden"): ApiError =>
  fail(403, msg)

export const notFoundError = (msg = "Not Found"): ApiError =>
  fail(404, msg)

export const conflictError = (msg = "Conflict"): ApiError =>
  fail(409, msg)

export const tooManyRequestsError = (msg = "Too Many Requests"): ApiError =>
  fail(429, msg)

export const internalError = (msg = "Internal Server Error"): ApiError =>
  fail(500, msg)
