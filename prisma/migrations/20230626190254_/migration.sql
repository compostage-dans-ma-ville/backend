-- DropForeignKey
ALTER TABLE "UserSiteRelation" DROP CONSTRAINT "UserSiteRelation_siteId_fkey";

-- DropForeignKey
ALTER TABLE "UserSiteRelation" DROP CONSTRAINT "UserSiteRelation_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserSiteRelation" ADD CONSTRAINT "UserSiteRelation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSiteRelation" ADD CONSTRAINT "UserSiteRelation_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
