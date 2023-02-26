/*
  Warnings:

  - You are about to drop the column `avatar` on the `Site` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ImageSiteRelation" DROP CONSTRAINT "ImageSiteRelation_siteId_fkey";

-- DropForeignKey
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_siteId_fkey";

-- DropForeignKey
ALTER TABLE "Site" DROP CONSTRAINT "Site_addressId_fkey";

-- AlterTable
ALTER TABLE "Site" DROP COLUMN "avatar";

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageSiteRelation" ADD CONSTRAINT "ImageSiteRelation_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
