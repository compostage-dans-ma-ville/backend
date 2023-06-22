-- CreateTable
CREATE TABLE "MemberSiteInvitation" (
    "userId" INTEGER NOT NULL,
    "siteId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemberSiteInvitation_pkey" PRIMARY KEY ("userId","siteId")
);

-- AddForeignKey
ALTER TABLE "MemberSiteInvitation" ADD CONSTRAINT "MemberSiteInvitation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberSiteInvitation" ADD CONSTRAINT "MemberSiteInvitation_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
