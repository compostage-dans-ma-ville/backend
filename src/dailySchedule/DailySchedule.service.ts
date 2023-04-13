import { Injectable } from '@nestjs/common'
import { Opening, Prisma, DailySchedule } from '@prisma/client'
import { DailyTime } from '~/api-services/DailyTime'
import { PrismaService } from '~/prisma/prisma.service'
import { GetScheduleDto } from './dto/getSchedule.dto'

const formatHHMM = ([hours, minutes]: [number, number]) => `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
@Injectable()
export class DailyScheduleService {
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

  toDto(schedules: (DailySchedule & { openings: Opening[] })[]): GetScheduleDto['schedules'] {
    if (schedules.length === 0) return undefined
    const scheduleDto: GetScheduleDto['schedules'] = [null, null, null, null, null, null, null]
    schedules.forEach(({ dayOfWeek, openings }) => {
      if (openings.length === 0) {
        scheduleDto[dayOfWeek] = []
      } else {
        scheduleDto[dayOfWeek] = openings.map(o => {
          const open = DailyTime.fromMinutes(o.open)
          const close = DailyTime.fromMinutes(o.close)
          const opening = {
            open: formatHHMM(open),
            close: formatHHMM(close)
          }
          return opening
        })
      }
    })
    return scheduleDto
  }
}
