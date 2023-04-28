-- DropForeignKey
ALTER TABLE "UserOrganizationRelation" DROP CONSTRAINT "UserOrganizationRelation_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "UserOrganizationRelation" DROP CONSTRAINT "UserOrganizationRelation_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserOrganizationRelation" ADD CONSTRAINT "UserOrganizationRelation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOrganizationRelation" ADD CONSTRAINT "UserOrganizationRelation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
