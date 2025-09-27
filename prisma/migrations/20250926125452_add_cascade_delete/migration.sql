-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_parentBookingId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_parentBookingId_fkey" FOREIGN KEY ("parentBookingId") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
