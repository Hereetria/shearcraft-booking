import { ApiError, fail } from "@/lib/errors/errorHandler"
import { Prisma } from "@prisma/client"

export function isDbError(err: unknown): err is Prisma.PrismaClientKnownRequestError {
  return err instanceof Prisma.PrismaClientKnownRequestError
}

export function mapDbError(err: Prisma.PrismaClientKnownRequestError): ApiError {
  switch (err.code) {
    case "P2002": {
      const fields = (err.meta?.target as string[]) ?? []
      const fieldList = fields.join(", ") || "field"
      return fail(409, `${fieldList} is already taken`)
    }

    case "P2003":
      return fail(409, "Foreign key constraint failed")

    case "P2004":
      return fail(400, "Transaction failed due to constraint violation")

    case "P2005":
      return fail(400, "Invalid value for a field")

    case "P2006":
      return fail(400, "Invalid value stored in the database")

    case "P2007":
      return fail(400, "Data validation error")

    case "P2014":
      return fail(400, "Invalid relation reference")

    case "P2025":
      return fail(404, "Record not found")

    case "P2033":
      return fail(400, "Numeric value out of range")

    case "P2034":
      return fail(409, "Transaction conflict occurred")

    default:
      return fail(500, "Database error")
  }
}
