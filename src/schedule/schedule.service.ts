import { Injectable } from '@nestjs/common'
import { Opening, Prisma, Schedule } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  findAll({ siteId }: Prisma.ScheduleWhereInput): Prisma.PrismaPromise<(Schedule & {
    openings: Opening[];
  })[]> {
    return this.prisma.schedule.findMany({
      include: { openings: true },
      where: {
        siteId
      }
    })
  }

  count({ siteId }: Prisma.ScheduleWhereInput): Prisma.PrismaPromise<number> {
    return this.prisma.schedule.count({
      where: {
        siteId
      }
    })
  }

  // toDto(schedules: Schedue[]): GetScheduleDto {
  //   const scheduleDto: GetScheduleDto = [null, null, null, null, null, null, null]
  //   schedules.forEach((schedule) => {
  //     // TODO: is open the whole day. Use a boolean isOpenFullDay and isOpenFullDay ? []: [opening]
  //     // TODO: write tests
  //     const { days, hours, minutes } = DailyTime.fromMinutes(schedule.open)
  //     const close = DailyTime.fromMinutes(schedule.close)
  //     const opening = {
  //       open: `${hours}:${minutes}`,
  //       close: `${close.hours}:${close.minutes}`
  //     }
  //     if (scheduleDto[days] === null) {
  //       scheduleDto[days] = [opening]
  //     } else {
  //       // can not be null as it is checked above
  //       scheduleDto[days]!.push(opening)
  //     }
  //   })
  //   return scheduleDto
  // }
}
