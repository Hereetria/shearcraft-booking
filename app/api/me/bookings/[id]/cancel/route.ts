import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { handleError } from "@/lib/errors/errorHandler";
import { bookingService } from "@/services/bookingService";
import { badRequestError } from "@/lib/errors/httpErrors";
import { logInfo, logError } from "@/lib/logger";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    logInfo("Cancel booking request started", { context });
    
    const { user } = await requireAuth();
    logInfo("User authenticated", { userId: user.id });
    
    const { id: bookingId } = await context.params;
    logInfo("Booking ID extracted", { bookingId });

    if (!bookingId) {
      logError("Booking ID is missing", "Cancel booking error");
      return handleError(badRequestError("Booking ID is required"));
    }

    logInfo("Attempting to cancel booking", { bookingId, userId: user.id });
    const cancelledBooking = await bookingService.cancel(bookingId, user.id);
    logInfo("Booking cancelled successfully", { bookingId, userId: user.id });

    return NextResponse.json(
      {
        message: "Booking cancelled successfully",
        booking: cancelledBooking,
      },
      { status: 200 }
    );
  } catch (err) {
    logError(err, "Error cancelling booking");
    return handleError(err);
  }
}
