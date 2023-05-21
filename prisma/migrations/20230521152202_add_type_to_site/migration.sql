/*
  Warnings:

  - Added the required column `type` to the `Site` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SiteType" AS ENUM ('BUILDING_FOOT', 'EDUCATIONAL_INSTITUTION', 'ADMINISTRATIVE_INSTITUTION', 'COMPANY');

-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "type" "SiteType" NOT NULL;
