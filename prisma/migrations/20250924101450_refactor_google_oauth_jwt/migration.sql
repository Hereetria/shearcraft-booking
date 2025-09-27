-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "image" TEXT,
ALTER COLUMN "passwordHash" DROP NOT NULL;
