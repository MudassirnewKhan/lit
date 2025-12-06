-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "public"."applications" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "university_id" TEXT NOT NULL,
    "essay" TEXT,
    "status" "public"."ApplicationStatus" NOT NULL DEFAULT 'pending',
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "applications_email_key" ON "public"."applications"("email");
