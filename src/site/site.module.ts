import { Module } from '@nestjs/common'
import { SiteService } from './site.service'
import { SiteController } from './site.controller'
import { PrismaService } from '~/prisma/prisma.service'
import { DailyScheduleModule } from '~/dailySchedule/DailySchedule.module'

@Module({
  imports: [DailyScheduleModule],
  controllers: [SiteController],
  providers: [SiteService, PrismaService]
})
export class SiteModule {}
