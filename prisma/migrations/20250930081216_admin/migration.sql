-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('admin', 'subadmin', 'mentor', 'sponsor', 'awardee');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_roles" (
    "user_id" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id","role")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
