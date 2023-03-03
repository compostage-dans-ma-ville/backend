import { Injectable } from '@nestjs/common'
import { Schedule } from '@prisma/client'
import { DataFactory } from 'nestjs-seeder'
import { ScheduleSchema } from './schedule.schema'

const AMOUNT_OF_DAYS_IN_WEEK = 7
@Injectable()
/**
 * This class is meant to be used in other seeders.
 * Thus it does not implement the proper Seeder interface,
 * but the seed can be used to generate some instance of the entity.
 */
export class ScheduleSeeder {
  seed(params: { amount: number, fullWeek?: boolean }): ScheduleSchema[] {
    const { amount, fullWeek } = params
    if (fullWeek) {
      return new Array(AMOUNT_OF_DAYS_IN_WEEK).fill(null).map((x, i) => ({ dayOfWeek: i }))
    }
    return DataFactory.createForClass(ScheduleSchema)
      .generate(amount) as Schedule[]
  }
}
