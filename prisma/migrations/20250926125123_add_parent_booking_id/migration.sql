-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "parentBookingId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_parentBookingId_fkey" FOREIGN KEY ("parentBookingId") REFERENCES "public"."Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
