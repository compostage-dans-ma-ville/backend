import { Module } from '@nestjs/common'
import { PrismaService } from '~/prisma/prisma.service'
import { DailyScheduleService } from './DailySchedule.service'

@Module({
  providers: [DailyScheduleService, PrismaService],
  exports: [DailyScheduleService]
})
export class DailyScheduleModule {}
