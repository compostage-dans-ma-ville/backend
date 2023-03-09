/*
  Warnings:

  - The primary key for the `Schedule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `close` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `open` on the `Schedule` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `dayOfWeek` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'OWNER', 'ADMIN');

-- AlterTable
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_pkey",
DROP COLUMN "close",
DROP COLUMN "open",
ADD COLUMN     "dayOfWeek" INTEGER NOT NULL,
ADD CONSTRAINT "Schedule_pkey" PRIMARY KEY ("siteId", "dayOfWeek");

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Opening" (
    "id" SERIAL NOT NULL,
    "open" INTEGER NOT NULL,
    "close" INTEGER NOT NULL,
    "scheduleId" INTEGER,
    "scheduleSiteId" INTEGER,
    "scheduleDayOfWeek" INTEGER,

    CONSTRAINT "Opening_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Opening" ADD CONSTRAINT "Opening_scheduleSiteId_scheduleDayOfWeek_fkey" FOREIGN KEY ("scheduleSiteId", "scheduleDayOfWeek") REFERENCES "Schedule"("siteId", "dayOfWeek") ON DELETE SET NULL ON UPDATE CASCADE;
