import { isDbError, mapDbError } from "@/lib/errors/dbErrorMapper"
import { logError } from "@/lib/logger"
import { NextResponse } from "next/server"

export type ApiError = {
  status: number
  message: string
}

export function fail(status: number, message: string): ApiError {
  return { status, message }
}

function isApiError(err: unknown): err is ApiError {
  return (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    "message" in err
  )
}

export function handleError(err: unknown) {
  if (isApiError(err)) {
    logError(err, "ApiError")
    return NextResponse.json({ error: err.message }, { status: err.status })
  }

  if (isDbError(err)) {
    const apiError: ApiError = mapDbError(err)
    logError(apiError, "DbError")
    return NextResponse.json({ error: apiError.message }, { status: apiError.status })
  }

  logError(err, "Unexpected")
  return NextResponse.json({ error: "Internal server error" }, { status: 500 })
}