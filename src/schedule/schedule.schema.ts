import { Schedule } from '@prisma/client'

/**
 * A weak entity that can not exists without another one. So we can omit the ids
 * and register it in its related entity.
 */
export class ScheduleSchema implements Omit<Schedule, 'siteId'> {
  open: number

  close: number
}
