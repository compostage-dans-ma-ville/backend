import { Injectable } from '@nestjs/common'
import { Seeder, DataFactory } from 'nestjs-seeder'
import { randomInRange } from '~/api-services/utils'
import { MINUTES_IN_DAY } from '~/api-services/weekTime'
import { PrismaService } from '~/prisma/prisma.service'
import { ScheduleSchema } from '~/schedule/schedule.schema'
import { SiteSchema } from './site.schema'

const DAYS_IN_WEEK = 7
const getRandomOpeningInDay = (fromMin?: number): ScheduleSchema => {
  const open = randomInRange(fromMin ?? 0, MINUTES_IN_DAY - 1)
  const close = randomInRange(open + 1, MINUTES_IN_DAY)
  return { open, close }
}

@Injectable()
export class SiteSeeder implements Seeder {
  constructor(private prisma: PrismaService) {}

  async seed(): Promise<void> {
    const siteSeeds = DataFactory.createForClass(SiteSchema)
      .generate(20)
    siteSeeds.forEach(async (s, i) => {
      const { address, ...site } = s as unknown as SiteSchema
      const { id } = await this.prisma.address.create({ data: address })

      const schedules: ScheduleSchema[] = new Array(DAYS_IN_WEEK).fill(undefined)
        .map((_, dayIndex) => {
          const isClosedToday = Math.random() > 0.7
          if (isClosedToday) return undefined
          const hasManyOpeningsToday = Math.random() > 0.7
          const amountOfOpenings = hasManyOpeningsToday ? randomInRange(2, 3) : 1
          const scheduleStart = dayIndex * MINUTES_IN_DAY
          return new Array(amountOfOpenings).fill(undefined)
            .reduce<ScheduleSchema[]>((acc, __, i) => {
              let newItem: ScheduleSchema
              if (i === 0) {
                newItem = getRandomOpeningInDay(0)
              } else {
                const previousItem = acc[i - 1]
                const fromMin = previousItem.close + 1
                newItem = getRandomOpeningInDay(fromMin)
              }
              acc.push({
                open: scheduleStart + newItem.open,
                close: scheduleStart + newItem.close
              })
              return acc
            }, [])
        })
        .flat()
        .filter((x: ScheduleSchema | undefined): x is ScheduleSchema => x !== undefined)

      console.log({ id: i, schedules })
      await this.prisma.site.create({
        data: {
          ...site,
          Schedules: {
            create: schedules
          },
          addressId: id
        }
      })
    })
  }

  async drop(): Promise<void> {
    await this.prisma.site.deleteMany()
  }
}
