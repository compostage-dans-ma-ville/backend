-- CreateEnum
CREATE TYPE "SiteRole" AS ENUM ('MEMBER', 'ADMIN', 'REFEREE');

-- CreateTable
CREATE TABLE "UserSiteRelation" (
    "userId" INTEGER NOT NULL,
    "role" "SiteRole" NOT NULL,
    "siteId" INTEGER NOT NULL,

    CONSTRAINT "UserSiteRelation_pkey" PRIMARY KEY ("userId","siteId")
);

-- AddForeignKey
ALTER TABLE "UserSiteRelation" ADD CONSTRAINT "UserSiteRelation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSiteRelation" ADD CONSTRAINT "UserSiteRelation_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
