import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/errors/errorHandler";
import { bookingService } from "@/services/bookingService";
import { z } from "zod";

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  userId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get("userId");
    
    const query = querySchema.parse({
      date: searchParams.get("date"),
      userId: userIdParam || undefined,
    });

    const bookings = await bookingService.getBookingsForDate(query.date, query.userId);
    
    return NextResponse.json(bookings, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}
