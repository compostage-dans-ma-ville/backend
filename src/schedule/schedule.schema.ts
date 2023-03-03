import { Schedule } from '@prisma/client'
import { Factory } from 'nestjs-seeder'

/**
 * A weak entity that can not exists without another one. So we can omit the ids
 * and register this in its related entity
 */
export class ScheduleSchema implements Omit<Schedule, 'siteId'> {
  @Factory(() => Math.floor(Math.random() * 6) + 1)
    dayOfWeek: number
}
