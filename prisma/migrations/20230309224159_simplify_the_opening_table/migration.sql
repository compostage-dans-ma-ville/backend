/*
  Warnings:

  - The primary key for the `Opening` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Opening` table. All the data in the column will be lost.
  - You are about to drop the column `scheduleDayOfWeek` on the `Opening` table. All the data in the column will be lost.
  - You are about to drop the column `scheduleSiteId` on the `Opening` table. All the data in the column will be lost.
  - You are about to drop the `Schedule` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `DailyScheduleDayOfWeek` to the `Opening` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DailyScheduleSiteId` to the `Opening` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Opening" DROP CONSTRAINT "Opening_scheduleSiteId_scheduleDayOfWeek_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_siteId_fkey";

-- AlterTable
ALTER TABLE "Opening" DROP CONSTRAINT "Opening_pkey",
DROP COLUMN "id",
DROP COLUMN "scheduleDayOfWeek",
DROP COLUMN "scheduleSiteId",
ADD COLUMN     "DailyScheduleDayOfWeek" INTEGER NOT NULL,
ADD COLUMN     "DailyScheduleSiteId" INTEGER NOT NULL,
ADD CONSTRAINT "Opening_pkey" PRIMARY KEY ("DailyScheduleSiteId", "DailyScheduleDayOfWeek", "open");

-- DropTable
DROP TABLE "Schedule";

-- CreateTable
CREATE TABLE "DailySchedule" (
    "siteId" INTEGER NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,

    CONSTRAINT "DailySchedule_pkey" PRIMARY KEY ("siteId","dayOfWeek")
);

-- AddForeignKey
ALTER TABLE "DailySchedule" ADD CONSTRAINT "DailySchedule_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opening" ADD CONSTRAINT "Opening_DailyScheduleSiteId_DailyScheduleDayOfWeek_fkey" FOREIGN KEY ("DailyScheduleSiteId", "DailyScheduleDayOfWeek") REFERENCES "DailySchedule"("siteId", "dayOfWeek") ON DELETE RESTRICT ON UPDATE CASCADE;
