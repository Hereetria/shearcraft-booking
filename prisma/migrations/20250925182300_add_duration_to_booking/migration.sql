/*
  Warnings:

  - Added the required column `duration` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Booking" ADD COLUMN     "duration" INTEGER;

-- Update existing records with a default duration of 30 minutes
UPDATE "public"."Booking" SET "duration" = 30 WHERE "duration" IS NULL;

-- Make the column NOT NULL after updating existing records
ALTER TABLE "public"."Booking" ALTER COLUMN "duration" SET NOT NULL;
