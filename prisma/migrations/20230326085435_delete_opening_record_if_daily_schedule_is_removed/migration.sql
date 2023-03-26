-- DropForeignKey
ALTER TABLE "Opening" DROP CONSTRAINT "Opening_DailyScheduleSiteId_DailyScheduleDayOfWeek_fkey";

-- AddForeignKey
ALTER TABLE "Opening" ADD CONSTRAINT "Opening_DailyScheduleSiteId_DailyScheduleDayOfWeek_fkey" FOREIGN KEY ("DailyScheduleSiteId", "DailyScheduleDayOfWeek") REFERENCES "DailySchedule"("siteId", "dayOfWeek") ON DELETE CASCADE ON UPDATE CASCADE;
