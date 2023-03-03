/*
  Warnings:

  - The primary key for the `Schedule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `close` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `open` on the `Schedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_pkey",
DROP COLUMN "close",
DROP COLUMN "id",
DROP COLUMN "open",
ADD CONSTRAINT "Schedule_pkey" PRIMARY KEY ("siteId", "dayOfWeek");

-- CreateTable
CREATE TABLE "Opening" (
    "id" SERIAL NOT NULL,
    "open" TEXT NOT NULL,
    "close" TEXT NOT NULL,
    "scheduleId" INTEGER,
    "scheduleSiteId" INTEGER,
    "scheduleDayOfWeek" INTEGER,

    CONSTRAINT "Opening_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Opening" ADD CONSTRAINT "Opening_scheduleSiteId_scheduleDayOfWeek_fkey" FOREIGN KEY ("scheduleSiteId", "scheduleDayOfWeek") REFERENCES "Schedule"("siteId", "dayOfWeek") ON DELETE SET NULL ON UPDATE CASCADE;
