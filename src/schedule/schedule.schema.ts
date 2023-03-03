import { Schedule } from '@prisma/client'
import { Factory } from 'nestjs-seeder'

export const LAST_DAY_ID = 6

/**
 * A weak entity that can not exists without another one. So we can omit the ids
 * and register it in its related entity.
 */
export class ScheduleSchema implements Omit<Schedule, 'siteId'> {
  @Factory(() => Math.floor(Math.random() * LAST_DAY_ID))
    dayOfWeek: number
}
