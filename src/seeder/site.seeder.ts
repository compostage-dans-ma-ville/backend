import { Injectable } from '@nestjs/common'
import { Seeder, DataFactory } from 'nestjs-seeder'
import { randomInRange } from '~/utils/random'
import { PrismaService } from '~/prisma/prisma.service'
import { DailyScheduleSchema } from '~/seeder/DailySchedule.schema'
import { SiteSchema } from './site.schema'
import { DailyScheduleSeeder } from './DailySchedule.seeder'

const DAYS_IN_WEEK = 7

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

      const siteRecord = await this.prisma.site.create({
        data: {
          ...site,
          addressId: id
        }
      })

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

      const results = schedules.map((dailySchedule) => this.prisma.dailySchedule.create({
        data: {
          siteId: siteRecord.id,
          dayOfWeek: dailySchedule.dayOfWeek,
          openings: {
            create: dailySchedule.openings
          }
        }
      }))
      await Promise.allSettled(results)
    })
  }

  async drop(): Promise<void> {
    await this.prisma.site.deleteMany()
  }
}
