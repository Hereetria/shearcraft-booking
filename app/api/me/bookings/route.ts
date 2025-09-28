import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/requireAuth";
import { handleError } from "@/lib/errors/errorHandler";
import { bookingService } from "@/services/bookingService";
import { validate } from "@/lib/validation/validate";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rateLimit";

const bookingSchema = z.object({
  serviceIds: z.array(z.uuid()).optional(),
  packageId: z.uuid().optional(),
  dateTime: z.iso.datetime(),
  duration: z.number().min(1).max(480),
}).refine(
  (data) =>
    (data.serviceIds && data.serviceIds.length > 0 && !data.packageId) ||
    (!data.serviceIds && data.packageId),
  {
    message: "Booking must have either services OR a package, not both",
    path: ["serviceIds"],
  }
).strict();

export async function GET() {
  try {
    const { user } = await requireAuth();
    const bookings = await bookingService.getAllForSelf(user.id);
    
    return NextResponse.json(bookings, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateLimitRes = await checkRateLimit("create-booking", req, 5, { amount: 1, unit: "m" })
    if (rateLimitRes) return handleError(rateLimitRes)
      
    const { user } = await requireAuth();
    const body = validate(bookingSchema, await req.json());

    const booking = await bookingService.create({
      ...body,
      userId: user.id,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}