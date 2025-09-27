import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { handleError } from "@/lib/errors/errorHandler";
import { bookingService } from "@/services/bookingService";

export async function POST() {
  try {  
    const result = await bookingService.updateExpiredBookings();
    
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}
