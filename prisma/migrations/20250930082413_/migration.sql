/*
  Warnings:

  - A unique constraint covering the columns `[mfa_secret]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "mfa_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mfa_secret" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_mfa_secret_key" ON "public"."User"("mfa_secret");
