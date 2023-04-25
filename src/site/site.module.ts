import { Module } from '@nestjs/common'
import { SiteService } from './site.service'
import { SiteController } from './site.controller'
import { PrismaService } from '~/prisma/prisma.service'
import { DailyScheduleModule } from '~/dailySchedule/DailySchedule.module'
import { AbilityModule } from '~/ability/ability.module'

@Module({
  imports: [DailyScheduleModule, AbilityModule],
  controllers: [SiteController],
  providers: [SiteService, PrismaService]
})
export class SiteModule {}
