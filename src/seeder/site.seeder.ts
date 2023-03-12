import { Injectable } from '@nestjs/common'
import { Seeder, DataFactory } from 'nestjs-seeder'
import { randomInRange } from '~/api-services/utils'
import { MINUTES_IN_DAY } from '~/api-services/DailyTime'
import { PrismaService } from '~/prisma/prisma.service'
import { DailyScheduleSchema } from '~/seeder/DailySchedule.schema'
import { SiteSchema } from './site.schema'
import { DailyScheduleSeeder } from './DailySchedule.seeder'

const DAYS_IN_WEEK = 7
const getRandomOpeningInDay = (fromMin: number): DailyScheduleSchema => {
  const open = randomInRange(fromMin, MINUTES_IN_DAY - 1)
  const close = randomInRange(open + 1, MINUTES_IN_DAY)
  return { open, close }
}

@Injectable()
export class SiteSeeder implements Seeder {
  constructor(private prisma: PrismaService) {}

  async seed(): Promise<void> {
    const siteSeeds = DataFactory.createForClass(SiteSchema)
      .generate(20)
    const dailySechuleSeeder = new DailyScheduleSeeder()
  
    siteSeeds.forEach(async (s) => {
      const { address, ...site } = s as unknown as SiteSchema
      const { id } = await this.prisma.address.create({ data: address })

      const schedules: DailyScheduleSchema[] = new Array(DAYS_IN_WEEK).fill(undefined)
        .map((_, dayOfWeek) => {
          const isClosedToday = Math.random() > 0.7
          if (isClosedToday) return undefined
          const amountOfOpenings = Math.random() > 0.7 ? randomInRange(1, 3) : 0
          return dailySechuleSeeder.seed({
            amountOfOpenings,
            dayOfWeek
          })
        })
        .flat()
        .filter((x: DailyScheduleSchema | undefined): x is DailyScheduleSchema => x !== undefined)

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
