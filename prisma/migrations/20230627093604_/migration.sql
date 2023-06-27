/*
  Warnings:

  - The primary key for the `UserSiteRelation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId,siteId]` on the table `UserSiteRelation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserSiteRelation" DROP CONSTRAINT "UserSiteRelation_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "UserSiteRelation_userId_siteId_key" ON "UserSiteRelation"("userId", "siteId");
