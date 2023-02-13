/*
  Warnings:

  - You are about to drop the column `siteId` on the `Address` table. All the data in the column will be lost.
  - Added the required column `addressId` to the `Site` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_siteId_fkey";

-- DropIndex
DROP INDEX "Address_siteId_key";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "siteId";

-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "addressId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Site" ADD CONSTRAINT "Site_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
