-- AlterTable
ALTER TABLE "public"."PasswordResetToken" ADD COLUMN     "used" BOOLEAN NOT NULL DEFAULT false;
