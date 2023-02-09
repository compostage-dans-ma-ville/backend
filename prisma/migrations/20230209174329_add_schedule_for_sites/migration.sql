-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "siteId" INTEGER NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "open" TEXT,
    "close" TEXT,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "Site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
