-- DropForeignKey
ALTER TABLE "MemberSiteInvitation" DROP CONSTRAINT "MemberSiteInvitation_siteId_fkey";

-- DropForeignKey
ALTER TABLE "MemberSiteInvitation" DROP CONSTRAINT "MemberSiteInvitation_userId_fkey";

-- AddForeignKey
ALTER TABLE "MemberSiteInvitation" ADD CONSTRAINT "MemberSiteInvitation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberSiteInvitation" ADD CONSTRAINT "MemberSiteInvitation_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE CASCADE ON UPDATE CASCADE;
