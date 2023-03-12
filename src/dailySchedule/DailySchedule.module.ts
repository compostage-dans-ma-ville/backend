import { Module } from '@nestjs/common'
import { ScheduleService } from './DailySchedule.service'

@Module({
  providers: [ScheduleService],
  exports: [ScheduleService]
})
export class ScheduleModule {}
