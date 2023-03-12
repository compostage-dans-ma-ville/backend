import { Module } from '@nestjs/common'
import { SiteService } from './site.service'
import { SiteController } from './site.controller'
import { PrismaService } from '~/prisma/prisma.service'
import { ScheduleModule } from '~/dailySchedule/DailySchedule.module'

@Module({
  imports: [ScheduleModule],
  controllers: [SiteController],
  providers: [SiteService, PrismaService]
})
export class SiteModule {}
