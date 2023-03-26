-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "accessConditions" TEXT,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true;
