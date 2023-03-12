import { DailySchedule } from '@prisma/client'
import { OpeningSchema } from '~/seeder/opening.schema'

type DailyScheduleContent = Omit<DailySchedule & { openings: OpeningSchema[] }, 'siteId'>
export class DailyScheduleSchema implements DailyScheduleContent {
  /**
   * the day of the week between 0 and 6
   * 0 is Monday
  */
  dayOfWeek: number

  openings: OpeningSchema[]
}
