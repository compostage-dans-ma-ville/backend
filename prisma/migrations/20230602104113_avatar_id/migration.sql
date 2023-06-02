/*
  Warnings:

  - You are about to drop the column `imageId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_imageId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "imageId",
ADD COLUMN     "avatarId" TEXT;
