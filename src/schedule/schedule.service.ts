import { Injectable } from '@nestjs/common'
import { Schedule } from '@prisma/client'
import { WeekTime } from '~/api-services/weekTime'
import { GetScheduleDto } from './dto/get-schedule.dto'

@Injectable()
export class ScheduleService {
  toDto(schedules: Schedule[]): GetScheduleDto {
    const scheduleDto: GetScheduleDto = [null, null, null, null, null, null, null]
    schedules.forEach((schedule) => {
      // TODO: is open the whole day. Use a boolean isOpenFullDay and isOpenFullDay ? []: [opening]
      // TODO: write tests
      const { days, hours, minutes } = WeekTime.fromMinutes(schedule.open)
      const close = WeekTime.fromMinutes(schedule.close)
      const opening = {
        open: `${hours}:${minutes}`,
        close: `${close.hours}:${close.minutes}`
      }
      if (scheduleDto[days] === null) {
        scheduleDto[days] = [opening]
      } else {
        // can not be null as it is checked above
        scheduleDto[days]!.push(opening)
      }
    })
    return scheduleDto
  }
}
