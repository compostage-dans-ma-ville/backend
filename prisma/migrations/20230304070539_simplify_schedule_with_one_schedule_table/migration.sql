/*
  Warnings:

  - The primary key for the `Schedule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dayOfWeek` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the `Opening` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `close` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `open` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Opening" DROP CONSTRAINT "Opening_scheduleSiteId_scheduleDayOfWeek_fkey";

-- AlterTable
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_pkey",
DROP COLUMN "dayOfWeek",
ADD COLUMN     "close" INTEGER NOT NULL,
ADD COLUMN     "open" INTEGER NOT NULL,
ADD CONSTRAINT "Schedule_pkey" PRIMARY KEY ("siteId", "open");

-- DropTable
DROP TABLE "Opening";
