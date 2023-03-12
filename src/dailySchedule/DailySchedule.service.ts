import { Injectable } from '@nestjs/common'
import { Opening, Prisma, DailySchedule } from '@prisma/client'
import { DailyTime } from '~/api-services/DailyTime';
import { PrismaService } from '~/prisma/prisma.service'
import { GetDailyScheduleDto, GetScheduleDto } from './dto/getSchedule.dto';

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  findAll({ siteId }: Prisma.DailyScheduleWhereInput): Prisma.PrismaPromise<(DailySchedule & {
    openings: Opening[];
  })[]> {
    return this.prisma.dailySchedule.findMany({
      include: { openings: true },
      where: {
        siteId
      }
    })
  }

  count({ siteId }: Prisma.DailyScheduleWhereInput): Prisma.PrismaPromise<number> {
    return this.prisma.dailySchedule.count({
      where: {
        siteId
      }
    })
  }

  toDto(schedules: Array<DailySchedule & { openings: Opening[] }>): GetScheduleDto['schedules'] {
    const scheduleDto: GetScheduleDto['schedules'] = [null, null, null, null, null, null, null]
    schedules.forEach(({ dayOfWeek, openings }) => {
      if(openings.length === 0) {
        scheduleDto[dayOfWeek] = []
      } else {
        scheduleDto[dayOfWeek] = openings.map(o => {
          const [openHours, openMinutes] = DailyTime.fromMinutes(o.open)
          const [closeHours, closeMinutes] = DailyTime.fromMinutes(o.close)
          const opening = {
            open: `${openHours}:${openMinutes}`,
            close: `${closeHours}:${closeMinutes}`
          }
          return opening
        })
      }
    })
    return scheduleDto
  }
}
